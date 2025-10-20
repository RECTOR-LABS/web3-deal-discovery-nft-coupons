# Database Backup & Restore Procedures

**Platform:** Supabase PostgreSQL
**Project:** mdxrtyqsusczmmpgspgn (us-east-1)
**Last Updated:** October 19, 2025

## Overview

This document outlines the backup and restore procedures for the platform's PostgreSQL database hosted on Supabase. Regular backups are critical for:
- Data loss prevention
- Disaster recovery
- Rollback capabilities
- Development/staging data seeding

## Supabase Automatic Backups

### Free Tier
- **Point-in-Time Recovery (PITR)**: Not available
- **Daily Backups**: Not available
- **Manual Backups**: Required

### Pro Tier ($25/month)
- **Point-in-Time Recovery (PITR)**: 7 days
- **Daily Backups**: Retained for 7 days
- **Manual Backups**: Available via dashboard

### Team Tier ($599/month)
- **PITR**: 14 days
- **Daily Backups**: Retained for 14 days

**Recommendation**: Upgrade to Pro tier before production launch for automatic backups.

## Current Configuration

**Tier**: Free (as of 2025-10-19)
**Backup Strategy**: Manual exports + version control
**Backup Frequency**: Weekly recommended (before production), Daily (after production)

## Manual Backup Procedures

### Method 1: Supabase Dashboard Export

1. **Access Database**
   ```
   Navigate to: https://app.supabase.com/project/mdxrtyqsusczmmpgspgn
   Go to: Database > Backups
   ```

2. **Create Manual Backup**
   - Click "Create Backup"
   - Add description (e.g., "Pre-deployment backup - 2025-10-19")
   - Wait for backup completion
   - Download backup file

3. **Storage**
   - Store backup files securely (encrypted)
   - Maintain at least 3 recent backups
   - Archive old backups monthly

### Method 2: pg_dump (Command Line)

**Prerequisites:**
- PostgreSQL client tools installed
- Database credentials from Supabase settings

**Backup Command:**
```bash
# Full database backup
pg_dump \
  -h db.mdxrtyqsusczmmpgspgn.supabase.co \
  -p 5432 \
  -U postgres \
  -d postgres \
  --clean \
  --if-exists \
  --schema=public \
  --no-owner \
  --no-acl \
  -f backup_$(date +%Y%m%d_%H%M%S).sql

# With gzip compression
pg_dump \
  -h db.mdxrtyqsusczmmpgspgn.supabase.co \
  -p 5432 \
  -U postgres \
  -d postgres \
  --clean \
  --if-exists \
  --schema=public \
  --no-owner \
  --no-acl \
  | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz
```

**Password:**
- Will prompt for password (get from Supabase settings)
- Or set environment variable: `export PGPASSWORD='your_password'`

**Schema-Only Backup:**
```bash
pg_dump \
  -h db.mdxrtyqsusczmmpgspgn.supabase.co \
  -p 5432 \
  -U postgres \
  -d postgres \
  --schema-only \
  --schema=public \
  -f schema_$(date +%Y%m%d_%H%M%S).sql
```

**Data-Only Backup (Specific Table):**
```bash
pg_dump \
  -h db.mdxrtyqsusczmmpgspgn.supabase.co \
  -p 5432 \
  -U postgres \
  -d postgres \
  --data-only \
  --table=merchants \
  -f merchants_data_$(date +%Y%m%d_%H%M%S).sql
```

### Method 3: Automated Backup Script

Create `scripts/backup-database.sh`:

```bash
#!/bin/bash
# Database backup script

# Configuration
DB_HOST="db.mdxrtyqsusczmmpgspgn.supabase.co"
DB_PORT="5432"
DB_USER="postgres"
DB_NAME="postgres"
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$DATE.sql.gz"

# Create backup directory if not exists
mkdir -p "$BACKUP_DIR"

# Perform backup
echo "Starting backup at $(date)"
pg_dump \
  -h "$DB_HOST" \
  -p "$DB_PORT" \
  -U "$DB_USER" \
  -d "$DB_NAME" \
  --clean \
  --if-exists \
  --schema=public \
  --no-owner \
  --no-acl \
  | gzip > "$BACKUP_FILE"

# Check if backup was successful
if [ $? -eq 0 ]; then
  echo "Backup completed successfully: $BACKUP_FILE"
  echo "File size: $(du -h $BACKUP_FILE | cut -f1)"

  # Keep only last 10 backups
  ls -t "$BACKUP_DIR"/backup_*.sql.gz | tail -n +11 | xargs -r rm
  echo "Old backups cleaned up"
else
  echo "Backup failed!"
  exit 1
fi
```

**Usage:**
```bash
chmod +x scripts/backup-database.sh
PGPASSWORD='your_password' ./scripts/backup-database.sh
```

**Cron Schedule (Daily at 2 AM):**
```cron
0 2 * * * cd /path/to/project && PGPASSWORD='your_password' ./scripts/backup-database.sh >> logs/backup.log 2>&1
```

## Restore Procedures

### Test Restore (Staging Environment)

**IMPORTANT**: Always test restore in staging first!

1. **Create Test Database**
   - Create new Supabase project for testing
   - Or use local PostgreSQL instance

2. **Restore from Backup**
   ```bash
   # From uncompressed SQL file
   psql \
     -h db.test-project.supabase.co \
     -p 5432 \
     -U postgres \
     -d postgres \
     -f backup_20251019_120000.sql

   # From compressed file
   gunzip -c backup_20251019_120000.sql.gz | \
     psql \
       -h db.test-project.supabase.co \
       -p 5432 \
       -U postgres \
       -d postgres
   ```

3. **Verify Data**
   - Check table counts
   - Verify critical records
   - Test application functionality

### Production Restore

**CRITICAL**: Production restore is destructive. Follow this checklist:

#### Pre-Restore Checklist
- [ ] Create fresh backup of current database
- [ ] Notify all users of planned downtime
- [ ] Put application in maintenance mode
- [ ] Verify backup file integrity (checksum)
- [ ] Test restore in staging environment first
- [ ] Get team approval for restore

#### Restore Steps

1. **Enable Maintenance Mode**
   ```bash
   # Deploy maintenance page or disable API routes
   vercel env add MAINTENANCE_MODE "true"
   vercel --prod
   ```

2. **Backup Current State (Safety)**
   ```bash
   PGPASSWORD='password' pg_dump \
     -h db.mdxrtyqsusczmmpgspgn.supabase.co \
     -p 5432 \
     -U postgres \
     -d postgres \
     --schema=public \
     | gzip > safety_backup_$(date +%Y%m%d_%H%M%S).sql.gz
   ```

3. **Restore from Backup**
   ```bash
   # Stop all connections (if possible)
   # Then restore
   gunzip -c backup_file.sql.gz | \
     psql \
       -h db.mdxrtyqsusczmmpgspgn.supabase.co \
       -p 5432 \
       -U postgres \
       -d postgres
   ```

4. **Verify Restore**
   ```sql
   -- Check table counts
   SELECT schemaname, tablename,
          (xpath('/row/cnt/text()',
          xml_count))[1]::text::int as row_count
   FROM (
     SELECT table_name, table_schema,
            query_to_xml(format('SELECT count(*) as cnt FROM %I.%I',
            table_schema, table_name), false, true, '') as xml_count
     FROM information_schema.tables
     WHERE table_schema = 'public'
       AND table_type = 'BASE TABLE'
   ) t;

   -- Verify critical data
   SELECT COUNT(*) FROM merchants;
   SELECT COUNT(*) FROM deals;
   SELECT COUNT(*) FROM users;
   ```

5. **Post-Restore Actions**
   - Test application functionality
   - Verify user authentication
   - Check API endpoints
   - Monitor error logs
   - Disable maintenance mode

6. **Disable Maintenance Mode**
   ```bash
   vercel env rm MAINTENANCE_MODE
   vercel --prod
   ```

### Point-in-Time Recovery (PITR)

**Available on Pro tier and above.**

1. **Access PITR**
   - Go to Supabase Dashboard > Database > Backups
   - Click "Restore to point in time"

2. **Select Recovery Point**
   - Choose date and time (within 7 days on Pro tier)
   - Preview changes
   - Confirm restore

3. **Monitor Restore**
   - Restoration creates new database
   - Original database remains untouched
   - Switch connection string once verified

## Backup Verification

### Monthly Backup Test

Schedule monthly restore tests:

1. **Download Backup**
2. **Restore to Staging**
3. **Run Test Suite**
4. **Verify Data Integrity**
5. **Document Results**

### Backup Integrity Checks

```bash
# Generate checksum
sha256sum backup_20251019.sql.gz > backup_20251019.sql.gz.sha256

# Verify checksum
sha256sum -c backup_20251019.sql.gz.sha256
```

## Database Tables

Current schema includes:

- `merchants` - Merchant profiles and settings
- `deals` - Active and past deals
- `events` - Redemption and activity events
- `users` - User accounts and profiles
- `reviews` - Deal reviews and ratings
- `votes` - Deal voting records
- `resale_listings` - Secondary market NFT listings
- `referrals` - Referral program data
- `staking` - Staking positions and history
- `cashback_transactions` - Cashback reward records
- `badges` - User achievement NFT badges

**Views:**
- `merchants_with_location` - Merchants with geolocation data

**Functions:**
- `calculate_distance_miles()` - Distance calculation utility

## Emergency Contacts

**Database Issues:**
- Supabase Support: https://supabase.com/support
- Email: support@supabase.com

**Internal:**
- Database Admin: [To be assigned]
- DevOps Lead: [To be assigned]

## Backup Storage Recommendations

1. **Local Storage**: Short-term (7 days)
2. **Cloud Storage**: Long-term (S3, Google Cloud Storage)
3. **Off-site Storage**: Disaster recovery (encrypted)

**Security:**
- Encrypt backups at rest
- Use separate credentials for backup access
- Restrict backup file permissions (chmod 600)
- Never commit backups to version control

## Maintenance Schedule

- **Daily**: Automated backups (production)
- **Weekly**: Backup verification test
- **Monthly**: Full restore test in staging
- **Quarterly**: Backup strategy review

---

**Next Review Date:** January 19, 2026

**Document Owner:** DevOps Team

**Last Tested:** [To be filled after first test]
