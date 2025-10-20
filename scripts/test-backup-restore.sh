#!/bin/bash

# Automated Backup Testing Script
# Tests database backup and restore procedures
# Run weekly via cron: 0 3 * * 0 /path/to/test-backup-restore.sh

set -e  # Exit on error

# Configuration
PROD_DB_URL="${SUPABASE_DB_URL}"  # Production database URL
TEST_DB_URL="${TEST_DB_URL:-$SUPABASE_TEST_DB_URL}"  # Test database URL
BACKUP_DIR="./backups"
LOG_FILE="./backup-test-$(date +%Y%m%d).log"

# Colors for output
GREEN='\033[0.32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1" | tee -a "$LOG_FILE"
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."

    if ! command -v pg_dump &> /dev/null; then
        error "pg_dump not found. Install PostgreSQL client tools."
        exit 1
    fi

    if ! command -v psql &> /dev/null; then
        error "psql not found. Install PostgreSQL client tools."
        exit 1
    fi

    if [ -z "$PROD_DB_URL" ]; then
        error "SUPABASE_DB_URL not set"
        exit 1
    fi

    if [ -z "$TEST_DB_URL" ]; then
        error "TEST_DB_URL not set"
        exit 1
    fi

    log "✓ Prerequisites check passed"
}

# Create backup
create_backup() {
    log "Creating backup from production database..."

    mkdir -p "$BACKUP_DIR"

    BACKUP_FILE="$BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S).sql"

    pg_dump "$PROD_DB_URL" \
        --no-owner \
        --no-acl \
        --format=plain \
        --file="$BACKUP_FILE"

    if [ -f "$BACKUP_FILE" ]; then
        BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
        log "✓ Backup created: $BACKUP_FILE ($BACKUP_SIZE)"
    else
        error "Backup file not created"
        exit 1
    fi

    echo "$BACKUP_FILE"
}

# Restore backup to test database
restore_backup() {
    local backup_file=$1

    log "Restoring backup to test database..."

    # Drop and recreate test database schema
    psql "$TEST_DB_URL" -c "DROP SCHEMA IF EXISTS public CASCADE;"
    psql "$TEST_DB_URL" -c "CREATE SCHEMA public;"

    # Restore backup
    psql "$TEST_DB_URL" < "$backup_file"

    log "✓ Backup restored to test database"
}

# Validate restored data
validate_restore() {
    log "Validating restored data..."

    # Check table counts
    local merchants_count=$(psql "$TEST_DB_URL" -t -c "SELECT COUNT(*) FROM merchants;")
    local deals_count=$(psql "$TEST_DB_URL" -t -c "SELECT COUNT(*) FROM deals;")
    local events_count=$(psql "$TEST_DB_URL" -t -c "SELECT COUNT(*) FROM events;")

    log "Table counts:"
    log "  - Merchants: $merchants_count"
    log "  - Deals: $deals_count"
    log "  - Events: $events_count"

    # Basic integrity checks
    local integrity_errors=0

    # Check for orphaned deals (deals without merchant)
    local orphaned_deals=$(psql "$TEST_DB_URL" -t -c "
        SELECT COUNT(*)
        FROM deals d
        LEFT JOIN merchants m ON d.merchant_id = m.id
        WHERE m.id IS NULL;
    ")

    if [ "$orphaned_deals" -gt 0 ]; then
        warn "Found $orphaned_deals orphaned deals (no merchant)"
        ((integrity_errors++))
    fi

    # Check for orphaned events
    local orphaned_events=$(psql "$TEST_DB_URL" -t -c "
        SELECT COUNT(*)
        FROM events e
        LEFT JOIN deals d ON e.deal_id = d.id
        WHERE d.id IS NULL;
    ")

    if [ "$orphaned_events" -gt 0 ]; then
        warn "Found $orphaned_events orphaned events (no deal)"
        ((integrity_errors++))
    fi

    if [ $integrity_errors -eq 0 ]; then
        log "✓ Data integrity validation passed"
        return 0
    else
        warn "Data integrity validation found $integrity_errors issues"
        return 1
    fi
}

# Run smoke tests
run_smoke_tests() {
    log "Running smoke tests..."

    # Test 1: Can query merchants
    psql "$TEST_DB_URL" -c "SELECT id, name FROM merchants LIMIT 1;" > /dev/null
    log "✓ Merchants table queryable"

    # Test 2: Can query deals
    psql "$TEST_DB_URL" -c "SELECT id, title FROM deals LIMIT 1;" > /dev/null
    log "✓ Deals table queryable"

    # Test 3: Check indexes exist
    local index_count=$(psql "$TEST_DB_URL" -t -c "
        SELECT COUNT(*)
        FROM pg_indexes
        WHERE schemaname = 'public';
    ")

    if [ "$index_count" -gt 0 ]; then
        log "✓ Indexes present ($index_count total)"
    else
        error "No indexes found after restore"
        return 1
    fi

    log "✓ Smoke tests passed"
}

# Cleanup old backups (keep last 7 days)
cleanup_old_backups() {
    log "Cleaning up old backups..."

    find "$BACKUP_DIR" -name "backup-*.sql" -mtime +7 -delete

    local remaining=$(find "$BACKUP_DIR" -name "backup-*.sql" | wc -l)
    log "✓ Cleanup complete ($remaining backups remaining)"
}

# Send notification (optional - configure with Slack webhook)
send_notification() {
    local status=$1
    local message=$2

    if [ -n "$SLACK_WEBHOOK_URL" ]; then
        curl -X POST "$SLACK_WEBHOOK_URL" \
            -H 'Content-Type: application/json' \
            -d "{\"text\":\"🔄 Backup Test: $status\\n$message\"}"
    fi
}

# Main execution
main() {
    log "=========================================="
    log "Starting Automated Backup Test"
    log "=========================================="

    check_prerequisites

    # Create backup
    BACKUP_FILE=$(create_backup)

    # Restore to test database
    restore_backup "$BACKUP_FILE"

    # Validate restore
    if validate_restore && run_smoke_tests; then
        log "=========================================="
        log "✓ BACKUP TEST PASSED"
        log "=========================================="
        send_notification "SUCCESS" "Backup and restore completed successfully"
        exit 0
    else
        error "=========================================="
        error "✗ BACKUP TEST FAILED"
        error "=========================================="
        send_notification "FAILURE" "Backup test failed - check logs"
        exit 1
    fi
}

# Run main function
main "$@"
