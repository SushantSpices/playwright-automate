import 'dotenv/config';
import { test, expect } from "@playwright/test";

test.describe("HRIS Attendance Test", () => {

  test("test attendance", async ({ page }) => {

    // 🔍 Debug navigation logs (very useful)
    page.on('framenavigated', frame => {
      console.log('Navigated to:', frame.url());
    });

    // Step 1: Go to HRIS
    await page.goto("https://hris.vidhypro.com/");

    // Step 2: Click Microsoft login button
    await Promise.all([
      page.waitForNavigation(),
      page.locator('[type="submit"]').click(),
    ]);

    // Step 3: Enter Microsoft Email
    await page.locator('[name="loginfmt"]').waitFor({ state: 'visible' });
    await page.locator('[name="loginfmt"]').fill(process.env.MICROSOFT_EMAIL || "");

    await Promise.all([
      // page.waitForNavigation(),
      page.locator('[type="submit"]').click(),
    ]);

    // Step 4: Enter Password
    await page.locator('[name="passwd"]').waitFor({ state: 'visible' });
    await page.locator('[name="passwd"]').fill(process.env.MICROSOFT_PASSWORD || "");

    await Promise.all([
      // page.waitForNavigation(),
      page.locator('input[type="submit"]').click(),
    ]);

    await page.waitForTimeout(5000);

    // Step 5: Handle "Stay signed in?" (optional)
    const staySignedInBtn = page.locator('input[type="button"][value="No"]');

    if (await staySignedInBtn.isVisible().catch(() => false)) {
      await Promise.all([
        // page.waitForNavigation(),
        staySignedInBtn.click(),
      ]);
    }

    
    const randomLoopCount = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < randomLoopCount; i++) {
      console.log(`Random loop iteration ${i + 1}`);
    }

    // Step 6: Ensure we are back on HRIS
    // await page.waitForURL('**https://hris.vidhypro.com**', { timeout: 60000 });

    await page.waitForTimeout(5000);

    console.log("✅ Logged in URL:", page.url());

    // Step 7: Wait for dashboard to load
    await page.waitForLoadState('networkidle');

    // Step 8: Navigate to Attendance Modal
    const attendanceLink = page.locator(
      'a[data-url="/Attendance/QuickAttendanceRequest/QuickAttendance"]'
    );

    await attendanceLink.waitFor({ state: 'visible', timeout: 20000 });
    await attendanceLink.click();

    // Step 9: Wait for attendance form
    await page.locator('[id="LoginID"]').nth(1).waitFor({ state: 'visible' });

    // Step 10: Fill HRIS credentials
    await page.locator('[id="LoginID"]').nth(1).fill(process.env.HRIS_ID || "");
    await page.locator('[id="LoginPassword"]').nth(1).fill(process.env.HRIS_PASSWORD || "");

    // Step 11: Select Check-In
    await page.locator('[id="Direction"]').selectOption('Out');

    // Step 12: Submit
    await Promise.all([
      page.waitForLoadState('networkidle'),
      page.locator('input[type="submit"][value="Submit"]').click(),
    ]);

    // Step 13: Assertion
    await expect(
      page.getByText("You have already checked In").first()
    ).toBeVisible({ timeout: 10000 });

    console.log("✅ Attendance test passed");

  });

});