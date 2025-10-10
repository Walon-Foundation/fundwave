# Admin Subdomain Setup Guide

This guide explains how to set up and deploy the admin interface for FundWaveSL at `admin.fundwavesl.org`.

## Overview

The admin functionality provides a separate subdomain interface for platform administrators to:
- Monitor platform statistics and health
- Manage users (activate, suspend, ban)
- Moderate campaigns (approve, reject, complete)
- Handle reports and content moderation
- Configure platform-wide settings

## Architecture

- **Main site**: `fundwavesl.org` - Public user-facing platform
- **Admin panel**: `admin.fundwavesl.org` - Restricted admin interface
- **Routing**: Handled by Next.js middleware based on host header
- **Authentication**: Clerk + super-admin allowlist
- **Database**: Shared PostgreSQL database with both platforms

## Configuration Steps

### 1. Environment Variables

Add these variables to your `.env` file:

```bash
# Admin Configuration
ADMIN_CLERK_ID=user_[YOUR_CLERK_USER_ID]  # Replace with your Clerk user ID
ADMIN_HOST=admin.fundwavesl.org
DEV_ADMIN_HOST=admin.localhost:3000
```

**How to get your Clerk User ID:**
1. Go to your Clerk dashboard
2. Navigate to Users section
3. Find your user account
4. Copy the user ID (starts with `user_`)

### 2. Clerk Configuration

Update your Clerk settings to support the admin subdomain:

**In Clerk Dashboard > Configure > Domains:**
1. Add `admin.fundwavesl.org` to Allowed Origins
2. Add `https://admin.fundwavesl.org/` to Sign-in URL
3. Add `https://admin.fundwavesl.org/` to Sign-up URL
4. Add `https://admin.fundwavesl.org/*` to Redirect URLs

**For development:**
- Add `http://admin.localhost:3000` to development domains

### 3. DNS Configuration

Set up DNS records for the admin subdomain:

```
Type: CNAME
Name: admin
Value: cname.vercel-dns.com
TTL: Auto
```

### 4. Vercel Deployment

**Option A: Same Project (Recommended)**
1. In your Vercel project settings, go to Domains
2. Add `admin.fundwavesl.org` as a domain
3. The middleware will handle routing based on the host header

**Option B: Separate Project**
1. Create a new Vercel project
2. Deploy the same codebase
3. Set `admin.fundwavesl.org` as the domain
4. Add all required environment variables

### 5. Environment Variables in Vercel

Set these in your Vercel project settings:

```bash
# Database
DATABASE_URL_PROD=[your_production_db_url]
NODE_ENV=production

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=[your_clerk_key]
CLERK_SECRET_KEY=[your_clerk_secret]
WEBHOOK_SECRET=[your_webhook_secret]

# Admin (CRITICAL)
ADMIN_CLERK_ID=user_[your_clerk_user_id]
ADMIN_HOST=admin.fundwavesl.org
DEV_ADMIN_HOST=admin.localhost:3000

# Other required variables
SUPABASE_URL=[your_supabase_url]
SUPABASE_SERVICE_ROLE_KEY=[your_supabase_key]
MONIME_SPACE_ID=[your_monime_space_id]
MONIME_ACCESS_TOKEN=[your_monime_token]
```

## Local Development

### 1. Start Development Server

```bash
pnpm dev
```

### 2. Access Admin Panel

- **Admin**: `http://admin.localhost:3000`
- **Main site**: `http://localhost:3000`

### 3. Testing Middleware

The middleware will automatically:
- Redirect non-admin users away from admin routes
- Enforce authentication on admin subdomain
- Allow only super-admin (ADMIN_CLERK_ID) access

## Security Features

### 1. Host-Based Access Control
- Admin routes only accessible via admin subdomain
- Main site blocks `/admin` routes and redirects to home

### 2. Authentication Layers
- **Level 1**: Clerk authentication required
- **Level 2**: Super-admin allowlist (ADMIN_CLERK_ID)
- **Level 3**: API route validation

### 3. Route Protection
```typescript
// Middleware automatically handles:
if (isAdminHost) {
  // Require authentication
  // Check super-admin status
  // Block non-admin users
}
```

## API Endpoints

Admin APIs are available at `/api/admin/` with these endpoints:

- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/users` - User management
- `PATCH /api/admin/users` - Update user status
- `GET /api/admin/campaigns` - Campaign management  
- `PATCH /api/admin/campaigns` - Update campaign status
- `GET /api/admin/reports` - Report management
- `PATCH /api/admin/reports` - Update report status

All endpoints require super-admin authentication.

## Admin Features

### Dashboard (`/admin`)
- Live platform statistics
- User, campaign, and donation metrics
- System health indicators
- Recent activity overview

### User Management (`/admin/users`)
- View all platform users
- Search and filter capabilities
- User status management (active/suspended/banned)
- KYC verification status
- Activity tracking

### Campaign Management (`/admin/campaigns`) 
- View all campaigns
- Search and filter by status/type
- Campaign moderation actions
- Progress tracking
- Creator information

### Reports Management (`/admin/reports`)
- View content reports
- Filter by type and status
- Investigation workflow
- Priority management
- Resolution tracking

### Settings (`/admin/settings`)
- Platform-wide configuration
- Feature toggles
- Content moderation settings
- System maintenance mode
- Environment information

## Troubleshooting

### Can't Access Admin Panel

1. **Check Environment Variables**
   ```bash
   # Verify ADMIN_CLERK_ID is set correctly
   echo $ADMIN_CLERK_ID
   ```

2. **Verify Clerk User ID**
   - Log in to main site first
   - Check browser DevTools > Network tab
   - Look for your user ID in API responses

3. **Domain Issues**
   - Ensure DNS is pointing to Vercel
   - Check Vercel domain configuration
   - Verify Clerk allowed origins

### 403 Forbidden Errors

This usually means:
- `ADMIN_CLERK_ID` doesn't match your Clerk user ID
- Environment variable not set in production
- Clerk authentication failed

### Middleware Issues

Check middleware logs:
```bash
# In development
console.log("Admin access attempt:", { userId, adminClerkId, host });
```

## Production Checklist

- [ ] DNS records configured
- [ ] Vercel domain added
- [ ] All environment variables set
- [ ] Clerk domains configured
- [ ] Admin user ID verified
- [ ] SSL certificate active
- [ ] Database connection tested
- [ ] Admin access confirmed

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Verify environment variables
3. Test with browser DevTools Network tab
4. Check Clerk dashboard for auth errors
5. Review middleware console logs

## Security Notes

- **Never commit ADMIN_CLERK_ID to version control**
- **Regularly rotate Clerk secrets**
- **Monitor admin access logs**
- **Use strong passwords for admin accounts**
- **Enable 2FA on Clerk admin account**

The admin panel is now ready for production use at `admin.fundwavesl.org`!