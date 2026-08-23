import { expect, test } from '@playwright/test'
import { gotoReady } from './utils'

test.describe('Services', () => {
  test('listing links through to a service detail page', async ({ page }) => {
    await gotoReady(page, '/services')

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

    const firstService = page.getByRole('link', { name: /Learn more/ }).first()
    await firstService.click()

    await expect(page).toHaveURL(/\/services\/.+/)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByText('Business Problems')).toBeVisible()
  })
})
