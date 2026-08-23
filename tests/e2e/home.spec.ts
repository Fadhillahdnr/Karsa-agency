import { expect, test } from '@playwright/test'
import { gotoReady } from './utils'

test.describe('Home', () => {
  test('loads with primary heading and navigation', async ({ page, isMobile }) => {
    await gotoReady(page, '/')

    await expect(page.getByRole('heading', { level: 1 })).toContainText('Dari Karsa')

    if (isMobile) {
      // Desktop nav is intentionally hidden below the md breakpoint in favor
      // of the burger menu — see mobile-menu.spec.ts for that flow.
      await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible()
    }
    else {
      const primaryNav = page.getByRole('navigation', { name: 'Primary' })
      await expect(primaryNav.getByRole('link', { name: 'Work', exact: true })).toBeVisible()
      await expect(primaryNav.getByRole('link', { name: 'Services', exact: true })).toBeVisible()
      await expect(primaryNav.getByRole('link', { name: 'Studio', exact: true })).toBeVisible()
    }
  })

  test('primary CTA navigates to Start a Project', async ({ page }) => {
    await gotoReady(page, '/')

    await page.getByRole('link', { name: /Start a Project/ }).first().click()
    await expect(page).toHaveURL(/\/start-a-project/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Tell us')
  })

  test('Explore Work navigates to the work listing', async ({ page }) => {
    await gotoReady(page, '/')

    await page.getByRole('link', { name: 'Explore Work' }).click()
    await expect(page).toHaveURL(/\/work/)
  })
})
