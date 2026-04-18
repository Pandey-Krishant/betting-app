# Task Progress: Fix Admin Users List + New User Visibility

## Current Issue: Only 4 users show in /admin/users (expect registered too)

**Status:** ✅ Plan approved, implementing...

## TODO Steps:
- [x] Step 1: Update TODO.md with progress ✅
- [x] Step 2: Edit src/app/admin/users/page.tsx - Add **total users count** header + **NEW badge** (createdAt <24h) for recent registrations. ✅
- [x] Step 3: Edit src/store/useAuthStore.ts - Add debug console.logs in register/login ✅
- [ ] Step 4: Test: `npm run dev` → register new → login admin → check /admin/users count >4, NEW badge, console logs.
- [ ] Step 5: Remove logs if ok, commit/push.

**Test Credentials:**
- Admin: admin/Admin@123 or gamma/11223344
- Demo: demo/Demo@123 (₹0)

**Expected:** After register "testuser", admin sees 5 users, newest with orange NEW badge.

