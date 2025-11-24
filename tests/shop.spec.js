// tests/shop.spec.js

import { test, expect } from '@playwright/test';

// กำหนด URL ฐานของโปรเจกต์ที่รันบนเครื่อง (Localhost)
const BASE_URL = 'http://localhost:3000';
const SHOP_PATH = '/shop'; // Path ไปยังหน้า Shop

test.describe('Shop Feature QA: Search, Filter, and Pagination', () => {

    test.beforeEach(async ({ page }) => {
        // ทุก Test จะเริ่มต้นจากการไปที่หน้า Shop
        await page.goto(BASE_URL + SHOP_PATH);
    });

    // =================================================================
    // P-1: Search Match (ค้นหาตรงกัน) - ตรวจสอบว่ามีผลลัพธ์
    // =================================================================
    test('P-1: Should filter products by search term and show results (Tea Table)', async ({ page }) => {
        const searchTerm = 'Tea Table';

        // 1. Action: พิมพ์คำค้นหาลงในช่อง input
        await page.fill('data-testid=search-input', searchTerm);

        // 2. Assertion 1: ตรวจสอบว่า Container หลักของผลลัพธ์ (grid) มีคำว่า "Tea Table" อยู่
        // locator('.grid').first() จะชี้ไปที่ <div> ของรายการสินค้า
        const productGridContainer = page.locator('.grid').first();
        await expect(productGridContainer).toContainText(searchTerm);
    });

    // =================================================================
    // P-2: Filter by Category (กรองตามหมวดหมู่) - ตรวจสอบ Container
    // =================================================================
    test('P-2: Should filter products correctly when selecting a category (Cap)', async ({ page }) => {
        const categoryToFilter = 'cap';
        const expectedProductName = 'Cap for Boys'; // ใช้ชื่อสินค้าที่คาดหวังในหมวดหมู่นี้

        // 1. Action: คลิกปุ่ม Filter หมวดหมู่นั้น
        const categoryButton = page.locator(`data-testid=filter-category-${categoryToFilter}`);
        await expect(categoryButton).toBeVisible();
        await categoryButton.click();

        // 2. Assertion 1: ตรวจสอบว่า Container หลักของผลลัพธ์มีชื่อสินค้า "Cap for Boys" อยู่
        const productGridContainer = page.locator('.grid').first();
        await expect(productGridContainer).toContainText(expectedProductName);
    });

    // =================================================================
    // P-3: Search No Results (ค้นหาไม่พบผลลัพธ์) - โค้ดเดิมยังคงถูกต้อง
    // =================================================================
    test('P-3: Should display "No results" message when search term is invalid', async ({ page }) => {
        const invalidSearchTerm = 'NonExistentProductXYZ12345';

        // 1. Action: พิมพ์คำค้นหาที่ไม่มีในระบบ
        await page.fill('data-testid=search-input', invalidSearchTerm);

        // 2. Assertion 1: ตรวจสอบว่ารายการสินค้าหายไป (นับได้ 0)
        const productItems = page.locator('div[data-testid^="product-item-"]');
        await expect(productItems).toHaveCount(0);

        // 3. Assertion 2: ตรวจสอบว่าข้อความ "ไม่พบสินค้าที่คุณค้นหา" แสดงขึ้นมา
        const noResultsMessage = page.locator('data-testid=no-results-message');
        await expect(noResultsMessage).toBeVisible();

        // 4. Assertion 3: ตรวจสอบว่า Pagination Control หายไป
        const paginationContainer = page.locator('.flex.text-base.font-semibold.font-titleFont.py-10');
        await expect(paginationContainer).toBeHidden();
    });

});