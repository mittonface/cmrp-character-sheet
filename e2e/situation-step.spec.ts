import { test, expect } from '@playwright/test';

test.describe('Situation Step', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to start fresh each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('displays the situation selection header', async ({ page }) => {
    await expect(page.getByText('CMRP')).toBeVisible();
    await expect(page.getByText('Character Creation')).toBeVisible();
    await expect(page.getByText('I. Choose Your Situation')).toBeVisible();
  });

  test('displays all situation cards', async ({ page }) => {
    // Check a sampling of known situations
    await expect(page.getByRole('button', { name: /Knight/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Churl/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Enchanter/ })).toBeVisible();
    await expect(
      page.getByRole('button', { name: /Troubadour/ }),
    ).toBeVisible();
  });

  test('situation cards are sorted alphabetically', async ({ page }) => {
    const cards = page.locator('button h3');
    const labels = await cards.allTextContents();

    const sorted = [...labels].sort((a, b) => a.localeCompare(b));
    expect(labels).toEqual(sorted);
  });

  test('shows required traits and retainers on cards', async ({ page }) => {
    // Knight card should show Valour, Chastity (required traits) and Manservant (required retainer)
    const knightCard = page.getByRole('button', { name: /Knight/ });
    await expect(knightCard.getByText('Valour')).toBeVisible();
    await expect(knightCard.getByText('Chastity')).toBeVisible();
    await expect(
      knightCard.getByText('Manservant (with coconuts)'),
    ).toBeVisible();
  });

  test('shows "+N more" for unfilled slots', async ({ page }) => {
    // Knight has 2 required traits + 1 required retainer = 3 filled, so "+2 more"
    const knightCard = page.getByRole('button', { name: /Knight/ });
    await expect(knightCard.getByText('+2 more')).toBeVisible();
  });

  test('shows fixed indifferent traits with strikethrough', async ({
    page,
  }) => {
    // Knight is indifferent to Subtlety (fixed type)
    const knightCard = page.getByRole('button', { name: /Knight/ });
    await expect(knightCard.getByText('Indifferent to')).toBeVisible();
    const subtletyBadge = knightCard.getByText('Subtlety');
    await expect(subtletyBadge).toBeVisible();
    await expect(subtletyBadge).toHaveClass(/line-through/);
  });

  test('shows "choose N" for select-type indifferent traits', async ({
    page,
  }) => {
    // Churl has select-type indifferent traits (choose 2)
    const churlCard = page.getByRole('button', { name: /Churl/ });
    await expect(churlCard.getByText('choose 2')).toBeVisible();
  });

  test('clicking a situation selects it', async ({ page }) => {
    const knightCard = page.getByRole('button', { name: /Knight/ });
    await knightCard.click();

    // Should show "Selected" badge
    await expect(knightCard.getByText('Selected')).toBeVisible();
  });

  test('selecting a situation shows its description', async ({ page }) => {
    await page.getByRole('button', { name: /Knight/ }).click();

    // Description panel should appear
    await expect(
      page.getByText('The armour-plated icon of the age!'),
    ).toBeVisible();
  });

  test('selecting a situation shows the Continue button', async ({ page }) => {
    // Continue should not be visible before selection
    await expect(
      page.getByRole('button', { name: 'Continue' }),
    ).not.toBeVisible();

    await page.getByRole('button', { name: /Knight/ }).click();

    await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
  });

  test('switching selection updates the description', async ({ page }) => {
    await page.getByRole('button', { name: /Knight/ }).click();
    await expect(
      page.getByText('The armour-plated icon of the age!'),
    ).toBeVisible();

    await page.getByRole('button', { name: /Churl/ }).click();
    await expect(page.getByText('The common folk:')).toBeVisible();
    // Old description should be gone
    await expect(
      page.getByText('The armour-plated icon of the age!'),
    ).not.toBeVisible();
  });

  test('switching selection moves the Selected badge', async ({ page }) => {
    const knightCard = page.getByRole('button', { name: /Knight/ });
    const churlCard = page.getByRole('button', { name: /Churl/ });

    await knightCard.click();
    await expect(knightCard.getByText('Selected')).toBeVisible();

    await churlCard.click();
    await expect(churlCard.getByText('Selected')).toBeVisible();
    await expect(knightCard.getByText('Selected')).not.toBeVisible();
  });

  test('clicking Continue advances to the Class step', async ({ page }) => {
    await page.getByRole('button', { name: /Knight/ }).click();
    await page.getByRole('button', { name: 'Continue' }).click();

    // Should now be on the Class step — situation step header should be gone
    await expect(page.getByText('I. Choose Your Situation')).not.toBeVisible();
    // Class step should be visible (breadcrumb shows "II")
    await expect(page.getByText('II. Declare Your Class')).toBeVisible();
  });

  test('persists selection across page reload', async ({ page }) => {
    await page.getByRole('button', { name: /Knight/ }).click();
    await page.getByRole('button', { name: 'Continue' }).click();

    // Reload — should NOT go back to situation step
    await page.reload();
    await expect(page.getByText('I. Choose Your Situation')).not.toBeVisible();
    // Knight has a single class (auto-set), so reload resumes past the class step
    await expect(page.getByText('II. Declare Your Class')).not.toBeVisible();
  });
});
