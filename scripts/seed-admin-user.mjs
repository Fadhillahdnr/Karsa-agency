import { createClient } from '@supabase/supabase-js'

// pnpm forwards the literal "--" separator into argv (unlike npm, which
// strips it), so drop it before reading positional args.
const args = process.argv.slice(2).filter(arg => arg !== '--')

const email = process.env.ADMIN_EMAIL ?? args[0]
const password = process.env.ADMIN_PASSWORD ?? args[1]

if (!email || !password) {
  console.error('Usage: pnpm seed:admin -- <email> <password>')
  console.error('   or: ADMIN_EMAIL=... ADMIN_PASSWORD=... pnpm seed:admin')
  process.exit(1)
}

if (password.length < 8) {
  console.error('Password must be at least 8 characters (Supabase Auth minimum).')
  process.exit(1)
}

const url = process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceRoleKey) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set (see .env).')
  process.exit(1)
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// admin.listUsers() is paginated; the admin panel only ever has a handful of
// accounts, so one page (default 50) is enough to check for a duplicate.
const { data: existing, error: listError } = await supabase.auth.admin.listUsers()

if (listError) {
  console.error('Failed to list existing users:', listError.message)
  process.exit(1)
}

const existingUser = existing.users.find(user => user.email === email)

if (existingUser) {
  console.log(`Admin user ${email} already exists (${existingUser.id}) — updating password instead.`)
  const { error: updateError } = await supabase.auth.admin.updateUserById(existingUser.id, { password })
  if (updateError) {
    console.error('Failed to update password:', updateError.message)
    process.exit(1)
  }
  console.log('Password updated. Sign in at /admin/login.')
  process.exit(0)
}

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
})

if (error) {
  console.error('Failed to create admin user:', error.message)
  process.exit(1)
}

console.log(`Created admin user ${data.user.email} (${data.user.id}).`)
console.log('Sign in at /admin/login with this email and password.')
