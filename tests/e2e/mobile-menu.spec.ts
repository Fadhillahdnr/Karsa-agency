import { expect, test } from '@playwright/test'
import { gotoReady } from './utils'

test.use({ viewport: { width: 390, height: 844 } })

test.describe('Mobile menu', () => {
  test('opens, moves focus into the menu, and closes on Escape', async ({ page }) => {
    await gotoReady(page, '/')

    const menuButton = page.getByRole('button', { name: 'Open menu' })
    await menuButton.click()

    const menu = page.getByRole('dialog', { name: 'Site menu' })
    await expect(menu).toBeVisible()

    const firstLink = menu.getByRole('link').first()
    await expect(firstLink).toBeFocused()

    await page.keyboard.press('Escape')
    await expect(menu).toBeHidden()
  })

  test('locks body scroll while open', async ({ page }) => {
    await gotoReady(page, '/')

    await page.getByRole('button', { name: 'Open menu' }).click()
    const overflow = await page.evaluate(() => document.body.style.overflow)
    expect(overflow).toBe('hidden')
  })
})
