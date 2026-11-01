import {test, expect} from '@playwright/test';

test.beforeEach(async ({page}) => {
  // Keep tests offline and deterministic: no Firebase, analytics or weather requests
  await page.route(
    /googleapis\.com|google-analytics\.com|googletagmanager\.com|api\.met\.no/,
    (route) => route.abort(),
  );
  await page.goto('/');
});

test('home page loads with name, socials and featured project', async ({page}) => {
  await expect(page).toHaveTitle(/Aleksi Nokelainen/);
  await expect(page.getByRole('heading', {level: 1, name: 'Aleksi Nokelainen'})).toBeVisible();
  await expect(page.getByRole('link', {name: 'GitHub', exact: true}).first()).toBeVisible();
  await expect(page.getByRole('link', {name: /AuroraWatcher/}).first()).toBeVisible();
});

test('personal projects accordion opens and closes', async ({page}) => {
  const toggle = page.getByRole('button', {name: /More personal projects/});
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('link', {name: /^Swim/})).toHaveCount(0);

  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('link', {name: /^Swim/})).toBeVisible();

  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test('language toggle switches the page to Finnish', async ({page}) => {
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');

  await page.getByRole('button', {name: /Switch to Finnish/}).click();

  await expect(page.locator('html')).toHaveAttribute('lang', 'fi');
  await expect(page.getByRole('button', {name: /Lisää omia projekteja/})).toBeVisible();
  await expect(page.getByText('Full Stack -kehittäjä')).toBeVisible();
});

test('skip link jumps to main content', async ({page}) => {
  // Wait for the app to hydrate so Tab starts from the top of the page
  await expect(page.getByRole('heading', {level: 1})).toBeVisible();
  await page.keyboard.press('Tab');
  const skipLink = page.getByRole('link', {name: 'Skip to content'});
  await expect(skipLink).toBeFocused();
  await skipLink.press('Enter');
  await expect(page).toHaveURL(/#main$/);
});
