# New Task Progress: New User Visibility + Register Orange Theme

## Plan Details:
**Issue 1**: New registered users already appear in /admin/users table (useAuthStore.users updated on register, table shows all, search works). Fix: Ensure state persistence, add 'new' badge by createdAt.
**Issue 2**: Register page bg-black → orange gradient theme. Inputs already orange-bordered.

**Files**:
- src/app/register/page.tsx (color theme).
- src/app/admin/users/page.tsx (highlight new users).

**Followup**:
1. Update register page orange.
2. Add new-user badge in admin table.
3. Test register → admin sees new with badge.
4. Push.

Proceed?
