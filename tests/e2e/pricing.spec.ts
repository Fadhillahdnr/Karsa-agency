import { expect, test } from '@playwright/test'
import { gotoReady } from './utils'

test.describe('PDF-derived services and pricing', () => {
  test('publishes the four approved service pillars', async ({ page }) => {
    await gotoReady(page, '/services')

    for (const title of ['Website', 'Design', 'Photography', 'Videography + Editing']) {
      await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible()
    }
    await expect(page.getByRole('heading', { name: 'Pengembangan Web', exact: true })).toHaveCount(0)
  })

  test('groups every approved package and includes add-ons and terms', async ({ page }) => {
    await gotoReady(page, '/packages')

    await expect(page.locator('article')).toHaveCount(26)
    await expect(page.getByRole('heading', { name: 'Paket per layanan' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Satu arah, beberapa touchpoint' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Dukungan setelah launch' })).toBeVisible()

    const fullPresenceMotion = page.locator('article').filter({ hasText: 'Full Presence Motion' })
    await expect(fullPresenceMotion).toContainText('IDR 9.900.000')
    await expect(fullPresenceMotion).toContainText('25 edited photos')

    await expect(page.getByText('Rp400.000+ / halaman')).toBeVisible()
    await expect(page.getByText('40% kickoff', { exact: false })).toBeVisible()
    await expect(page.getByText('14 hari perbaikan bug teknis', { exact: false })).toBeVisible()
  })
})
