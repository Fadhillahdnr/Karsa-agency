import { expect, test } from '@playwright/test'
import { gotoReady } from './utils'

test.use({ reducedMotion: 'reduce' })

test.describe('Reduced motion', () => {
  test('homepage content is fully visible and accessible', async ({ page }) => {
    await gotoReady(page, '/')

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByText('Every digital product')).toBeVisible()
    await expect(page.getByText('What We Do')).toBeVisible()
    await expect(page.getByRole('link', { name: /Start a Project/ }).first()).toBeVisible()
  })
})
