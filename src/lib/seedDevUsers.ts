import dbConnect from '@/lib/db';
import { User } from '@/models/User';

let demoChecked = false;
let adminChecked = false;

function seedingAllowed(): boolean {
  return (
    process.env.NODE_ENV !== 'production' ||
    process.env.ENABLE_DEMO_SEED === 'true'
  );
}

/**
 * Creates the demo account used by "Demo Login" when missing.
 */
export async function ensureDemoUser(): Promise<void> {
  if (!seedingAllowed() || demoChecked) return;

  await dbConnect();

  try {
    const exists = await User.findOne({ username: 'demo' }).select('_id').lean();
    if (exists) {
      demoChecked = true;
      return;
    }
    await User.create({
      username: 'demo',
      password: 'Demo@123',
    });
  } catch (e: unknown) {
    const dup =
      typeof e === 'object' &&
      e !== null &&
      'code' in e &&
      (e as { code?: number }).code === 11000;
    if (!dup) {
      console.error('ensureDemoUser:', e);
      return;
    }
  }

  demoChecked = true;
}

/**
 * Ensures an admin account exists for local/staging admin panel access.
 * Default credentials (dev): admin / Admin@123 — override via ADMIN_SEED_USERNAME / ADMIN_SEED_PASSWORD.
 * If someone registered the same username as a normal user, promotes them to admin (password unchanged).
 */
export async function ensureDevAdminUser(): Promise<void> {
  if (!seedingAllowed() || adminChecked) return;

  await dbConnect();

  const username = (process.env.ADMIN_SEED_USERNAME || 'admin').trim().toLowerCase();
  const password = process.env.ADMIN_SEED_PASSWORD || 'Admin@123';

  try {
    let doc = await User.findOne({ username });
    if (!doc) {
      await User.create({
        username,
        password,
        role: 'admin',
      });
    } else if (doc.role !== 'admin') {
      doc.role = 'admin';
      await doc.save();
    }
  } catch (e: unknown) {
    const dup =
      typeof e === 'object' &&
      e !== null &&
      'code' in e &&
      (e as { code?: number }).code === 11000;
    if (!dup) {
      console.error('ensureDevAdminUser:', e);
      return;
    }
  }

  adminChecked = true;
}
