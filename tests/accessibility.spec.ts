import {test, expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('home page has no WCAG 2 AA violations', async ({page}) => {
  await page.route(
    /googleapis\.com|google-analytics\.com|googletagmanager\.com|api\.met\.no/,
    (route) => route.abort(),
  );
  await page.goto('/');
  // Wait for the entrance animations to finish so colours are final
  await expect(page.getByRole('heading', {level: 1})).toBeVisible();
  await page.waitForTimeout(1500);

  const results = await new AxeBuilder({page})
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  expect(results.violations).toEqual([]);
});
