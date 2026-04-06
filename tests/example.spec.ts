import 'dotenv/config';

import { test, expect } from "@playwright/test";
import { login } from "../utils/login-utils";

test.describe("Tests", () => {

  test("test attendance", async ({ page }) => {
    await page.goto("https://hris.vidhypro.com/");

    await page.locator('[type="submit"]').click();
    await page
      .locator('[name="loginfmt"]')
      .fill(process.env.MICROSOFT_EMAIL || "");  // vidhypro email

    await page.locator('[type="submit"]').click();

    await page.locator('[name="passwd"]').fill(process.env.MICROSOFT_PASSWORD || ""); // vidhypro password

    await page.locator('input[type="submit"]').click();

    await page.locator('input[type="submit"]').click();

    await Promise.all([page.waitForResponse((r) => r.url().includes(""))]);

    await page.waitForTimeout(2000);

    await page.locator('a[data-url="/Attendance/QuickAttendanceRequest/QuickAttendance"]').click();

    await Promise.all([page.waitForResponse((r) => r.url().includes(""))]);

    await page.locator('[id="LoginID"]').nth(1).fill(process.env.HRIS_ID || ""); //employee id
    await page.locator('[id="LoginPassword"]').nth(1).fill(process.env.HRIS_PASSWORD || ""); //employee password
    await page.locator('[id="Direction"]').selectOption('In'); //check in or out
    // await page.locator('[id="direction"]').selectOption('Out'); 

    await page.locator('input[type="submit"][value="Submit"]').click();

    await expect(page.getByText("You have already checked In").first()).toBeAttached();
  });
});
