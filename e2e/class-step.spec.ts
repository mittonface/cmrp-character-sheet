import { test, expect } from '@playwright/test';

/** Helper: select a situation and advance to the Class step */
async function goToClassStep(
  page: import('@playwright/test').Page,
  situation: string,
) {
  await page.getByRole('button', { name: new RegExp(situation) }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByText('II. Declare Your Class')).toBeVisible();
}

test.describe('Class Step', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test.describe('single-class situations', () => {
    test('Knight shows single class card with no selection needed', async ({
      page,
    }) => {
      await goToClassStep(page, 'Knight');

      // Should show the single Upper Class card
      await expect(page.getByText('Upper Class')).toBeVisible();
      await expect(page.getByText('♛')).toBeVisible();

      // Should show "Determined by your Situation" text
      await expect(
        page.getByText('Determined by your Situation'),
      ).toBeVisible();

      // Should NOT show a "Selected" badge (single-class skips it)
      await expect(page.getByText('Selected')).not.toBeVisible();
    });

    test('Knight context text indicates class is predetermined', async ({
      page,
    }) => {
      await goToClassStep(page, 'Knight');

      await expect(
        page.getByText('your class is already determined'),
      ).toBeVisible();
    });

    test('Churl shows single Lower Class card', async ({ page }) => {
      await goToClassStep(page, 'Churl');

      await expect(page.getByText('Lower Class')).toBeVisible();
      await expect(page.getByText('⚒')).toBeVisible();
      await expect(
        page.getByText('Determined by your Situation'),
      ).toBeVisible();
    });

    test('single-class situation shows Continue button immediately', async ({
      page,
    }) => {
      await goToClassStep(page, 'Knight');

      // Class is auto-set, so Continue should be visible right away
      await expect(
        page.getByRole('button', { name: 'Continue' }),
      ).toBeVisible();
    });

    test('single-class Continue advances to Slots step', async ({ page }) => {
      await goToClassStep(page, 'Knight');

      await page.getByRole('button', { name: 'Continue' }).click();

      await expect(page.getByText('II. Declare Your Class')).not.toBeVisible();
      await expect(page.getByText('III. Fill Your Ledger')).toBeVisible();
    });
  });

  test.describe('multi-class situations', () => {
    test('Enchanter shows all three class cards', async ({ page }) => {
      await goToClassStep(page, 'Enchanter');

      await expect(page.getByText('Upper Class')).toBeVisible();
      await expect(page.getByText('Middle Class')).toBeVisible();
      await expect(page.getByText('Lower Class')).toBeVisible();
    });

    test('multi-class context text offers a choice', async ({ page }) => {
      await goToClassStep(page, 'Enchanter');

      await expect(
        page.getByText('you may claim standing among the following classes'),
      ).toBeVisible();
    });

    test('Continue button is hidden until a class is selected', async ({
      page,
    }) => {
      await goToClassStep(page, 'Enchanter');

      await expect(
        page.getByRole('button', { name: 'Continue' }),
      ).not.toBeVisible();
    });

    test('clicking a class card selects it and shows Continue', async ({
      page,
    }) => {
      await goToClassStep(page, 'Enchanter');

      await page.getByText('Upper Class').click();

      await expect(page.getByText('Selected')).toBeVisible();
      await expect(
        page.getByRole('button', { name: 'Continue' }),
      ).toBeVisible();
    });

    test('switching class selection moves the Selected badge', async ({
      page,
    }) => {
      await goToClassStep(page, 'Enchanter');

      const upperCard = page.locator('button', { hasText: 'Upper Class' });
      const lowerCard = page.locator('button', { hasText: 'Lower Class' });

      await upperCard.click();
      await expect(upperCard.getByText('Selected')).toBeVisible();

      await lowerCard.click();
      await expect(lowerCard.getByText('Selected')).toBeVisible();
      await expect(upperCard.getByText('Selected')).not.toBeVisible();
    });

    test('displays class mottos', async ({ page }) => {
      await goToClassStep(page, 'Enchanter');

      await expect(
        page.getByText('Terribly important, frightfully well-bred'),
      ).toBeVisible();
      await expect(
        page.getByText('Not quite posh, not quite peasant'),
      ).toBeVisible();
      await expect(
        page.getByText('Mud-farming is an honest living'),
      ).toBeVisible();
    });

    test('displays sigils for each class', async ({ page }) => {
      await goToClassStep(page, 'Enchanter');

      await expect(page.getByText('♛')).toBeVisible();
      await expect(page.getByText('⚜')).toBeVisible();
      await expect(page.getByText('⚒')).toBeVisible();
    });

    test('Cleric shows only Upper and Middle class options', async ({
      page,
    }) => {
      await goToClassStep(page, 'Cleric');

      await expect(page.getByText('Upper Class')).toBeVisible();
      await expect(page.getByText('Middle Class')).toBeVisible();
      await expect(page.getByText('Lower Class')).not.toBeVisible();
    });
  });

  test.describe('class-required traits', () => {
    test('Enchanter Upper shows Lorefulness as required trait', async ({
      page,
    }) => {
      await goToClassStep(page, 'Enchanter');

      const upperCard = page.locator('button', { hasText: 'Upper Class' });
      await expect(upperCard.getByText('Required Traits')).toBeVisible();
      await expect(upperCard.getByText('Lorefulness')).toBeVisible();
    });

    test('Enchanter Middle shows Wisdom in the Ways of Science', async ({
      page,
    }) => {
      await goToClassStep(page, 'Enchanter');

      const middleCard = page.locator('button', { hasText: 'Middle Class' });
      await expect(
        middleCard.getByText('Wisdom in the Ways of Science'),
      ).toBeVisible();
    });

    test('Enchanter Lower shows Druidry as required trait', async ({
      page,
    }) => {
      await goToClassStep(page, 'Enchanter');

      const lowerCard = page.locator('button', { hasText: 'Lower Class' });
      await expect(lowerCard.getByText('Druidry')).toBeVisible();
    });

    test('Cleric Upper shows Decorum, Middle shows Chastity', async ({
      page,
    }) => {
      await goToClassStep(page, 'Cleric');

      const upperCard = page.locator('button', { hasText: 'Upper Class' });
      await expect(upperCard.getByText('Decorum')).toBeVisible();

      const middleCard = page.locator('button', { hasText: 'Middle Class' });
      await expect(middleCard.getByText('Chastity')).toBeVisible();
    });

    test('Troubadour class cards show no required traits section', async ({
      page,
    }) => {
      await goToClassStep(page, 'Troubadour');

      await expect(page.getByText('Required Traits')).not.toBeVisible();
    });
  });

  test.describe('navigation', () => {
    test('Continue from multi-class advances to Slots step', async ({
      page,
    }) => {
      await goToClassStep(page, 'Enchanter');

      await page.getByText('Upper Class').click();
      await page.getByRole('button', { name: 'Continue' }).click();

      await expect(page.getByText('III. Fill Your Ledger')).toBeVisible();
    });

    test('breadcrumb step I navigates back to Situation step', async ({
      page,
    }) => {
      await goToClassStep(page, 'Knight');

      // Click breadcrumb for step I
      await page.getByRole('button', { name: 'I Situation' }).click();

      await expect(page.getByText('I. Choose Your Situation')).toBeVisible();
    });

    test('situation label is shown in context text', async ({ page }) => {
      await goToClassStep(page, 'Enchanter');

      await expect(
        page.locator('span', { hasText: 'Enchanter' }),
      ).toBeVisible();
    });
  });

  test.describe('persistence', () => {
    test('class selection persists across page reload', async ({ page }) => {
      await goToClassStep(page, 'Enchanter');
      await page.getByText('Upper Class').click();
      await page.getByRole('button', { name: 'Continue' }).click();

      // Now on slots step — reload
      await page.reload();

      // Should still be on slots step, not back at class
      await expect(page.getByText('III. Fill Your Ledger')).toBeVisible();
    });

    test('going back to class step preserves the selection', async ({
      page,
    }) => {
      await goToClassStep(page, 'Enchanter');
      await page.getByText('Upper Class').click();
      await page.getByRole('button', { name: 'Continue' }).click();

      // Go back via breadcrumb
      await page.getByRole('button', { name: 'II Class' }).click();

      const upperCard = page.locator('button', { hasText: 'Upper Class' });
      await expect(upperCard.getByText('Selected')).toBeVisible();
    });
  });
});
