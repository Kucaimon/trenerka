import { test, expect } from '@playwright/test'

test.describe('Trenerka MVP (mock)', () => {
  test('trainer login and dashboard', async ({ page }) => {
    await page.goto('/login/trainer')
    await page.getByLabel(/email|почта|e-mail/i).fill('trainer@trenerka.ru')
    await page.getByLabel(/password|пароль/i).fill('demo123')
    await page.getByRole('button', { name: /войти|log in|login/i }).click()
    await expect(page).toHaveURL(/\/trainer/)
    await expect(page.getByText(/дашборд|dashboard/i).first()).toBeVisible()
  })

  test('client login, workouts and payments', async ({ page }) => {
    await page.goto('/login/client')
    await page.getByLabel(/email|почта|e-mail/i).fill('client@trenerka.ru')
    await page.getByLabel(/password|пароль/i).fill('demo123')
    await page.getByRole('button', { name: /войти|log in|login/i }).click()
    await expect(page).toHaveURL(/\/client/)
    await page.goto('/client/workouts')
    await expect(page).toHaveURL(/\/client\/workouts/)
    await page.goto('/client/payments')
    await expect(page.getByText(/оплат|payment|баланс/i).first()).toBeVisible()
  })

  test('trainer can open clients list', async ({ page }) => {
    await page.goto('/login/trainer')
    await page.getByLabel(/email|почта|e-mail/i).fill('trainer@trenerka.ru')
    await page.getByLabel(/password|пароль/i).fill('demo123')
    await page.getByRole('button', { name: /войти|log in|login/i }).click()
    await page.goto('/trainer/clients')
    await expect(page.getByText(/клиент|client/i).first()).toBeVisible()
  })
})
