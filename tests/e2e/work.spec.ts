import { expect, test } from '@playwright/test'
import { gotoReady } from './utils'

test.describe('Work', () => {
  test('listing links through to a case study', async ({ page }) => {
    await gotoReady(page, '/work')

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

    const firstCaseStudy = page.getByRole('link', { name: /View Case Study/ }).first()
    await firstCaseStudy.click()

    await expect(page).toHaveURL(/\/work\/.+/)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByText('Challenge')).toBeVisible()
  })
})
