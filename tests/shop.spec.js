import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';
const SHOP_PATH = '/shop';

test.describe('Shop Feature QA: Search, Filter, and Pagination', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto(BASE_URL + SHOP_PATH);
    });
    test('P-1: Should filter products by search term and show results (Tea Table)', async ({ page }) => {
        const searchTerm = 'Tea Table';
        await page.fill('data-testid=search-input', searchTerm);
        const productGridContainer = page.locator('.grid').first();
        await expect(productGridContainer).toContainText(searchTerm);
    });

    test('P-2: Should filter products correctly when selecting a category (Cap)', async ({ page }) => {
        const categoryToFilter = 'cap';
        const expectedProductName = 'Cap for Boys';
        const categoryButton = page.locator(`data-testid=filter-category-${categoryToFilter}`);
        await expect(categoryButton).toBeVisible();
        await categoryButton.click();

        const productGridContainer = page.locator('.grid').first();
        await expect(productGridContainer).toContainText(expectedProductName);
    });

    test('P-3: Should display "No results" message when search term is invalid', async ({ page }) => {
        const invalidSearchTerm = 'NonExistentProductXYZ12345';

        await page.fill('data-testid=search-input', invalidSearchTerm);

        const productItems = page.locator('div[data-testid^="product-item-"]');
        await expect(productItems).toHaveCount(0);

        const noResultsMessage = page.locator('data-testid=no-results-message');
        await expect(noResultsMessage).toBeVisible();

        const paginationContainer = page.locator('.flex.text-base.font-semibold.font-titleFont.py-10');
        await expect(paginationContainer).toBeHidden();
    });

});