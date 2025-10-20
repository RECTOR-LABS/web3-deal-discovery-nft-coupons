# Database Migrations

This directory contains database schema definitions and migration scripts for the Web3 Deal Discovery & NFT Coupons platform.

## Current Schema (Supabase PostgreSQL)

**Project:** mdxrtyqsusczmmpgspgn
**Region:** us-east-1
**Generated:** October 19, 2025

### Tables (11)

1. **merchants** - Merchant profiles and business information
2. **deals** - Active and historical deal listings
3. **events** - Platform events (redemptions, activities)
4. **users** - User accounts and profiles
5. **reviews** - Deal reviews and ratings
6. **votes** - Deal voting (upvote/downvote) records
7. **resale_listings** - Secondary market NFT listings
8. **referrals** - Referral program tracking
9. **staking** - User staking positions
10. **cashback_transactions** - Cashback reward distribution
11. **badges** - User achievement NFT badges

### Views (2)

1. **merchants_with_location** - Merchants with geolocation data for distance calculations

### Functions (1)

1. **calculate_distance_miles()** - Calculate distance between coordinates in miles

## Schema Export

To export the current schema from Supabase:

```bash
# Export full schema
pg_dump \
  -h db.mdxrtyqsusczmmpgspgn.supabase.co \
  -p 5432 \
  -U postgres \
  -d postgres \
  --schema-only \
  --schema=public \
  --no-owner \
  --no-acl \
  -f migrations/schema.sql

# Or use Supabase CLI (recommended)
supabase db dump --schema public > migrations/schema.sql
```

## Migration Strategy

### Development
- Schema changes tracked in version control
- Supabase migrations tracked via `supabase/migrations/` (if using Supabase CLI)

### Production
- Test migrations in staging first
- Use Supabase dashboard for schema changes
- Create backup before each migration
- Document all schema changes

## Schema Changes Log

### Initial Schema (2025-10-01)
- Created 11 core tables
- Added geolocation views and functions

### Epic 1-10 Completion (2025-10-19)
- All tables populated and tested
- Schema stable and production-ready

## Next Steps

1. **Export Current Schema**
   ```bash
   # Install Supabase CLI
   npm install -g supabase

   # Export schema
   supabase db dump --schema public > migrations/schema.sql
   ```

2. **Version Control**
   - Commit schema.sql to repository
   - Update on each schema change

3. **Migration Testing**
   - Test schema in local PostgreSQL
   - Verify compatibility before production

## Tools

- **Supabase CLI**: Schema management and migrations
- **pg_dump**: PostgreSQL backup utility
- **TypeScript Types**: `lib/database/types.ts` (auto-generated from Supabase)

## References

- Supabase Docs: https://supabase.com/docs/guides/database
- PostgreSQL Docs: https://www.postgresql.org/docs/
- Backup Guide: `docs/operations/BACKUP-RESTORE.md`
