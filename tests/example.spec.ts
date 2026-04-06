import { test, expect } from "@playwright/test";
import { login } from "../utils/login-utils";

test.describe("Login Tests", () => {
  test("valid login", async ({ page }) => {
    await login({ page });

    await page.locator('[href="/inventory/products"]').click();

    await Promise.all([page.waitForResponse((r) => r.url().includes("api/"))]);

    await page.getByRole("button", { name: "Inactive" }).click();

    await Promise.all([page.waitForResponse((r) => r.url().includes("api/"))]);

    const row = page
      .locator(".ant-table-row.ant-table-row-level-0.cursor-pointer")
      .nth(0);

    const selectedProductId = await row.locator("td").nth(1).innerText();

    await row.locator("td").last().locator("button").click();

    await page.waitForTimeout(1000);

    const modalBody = page.locator(".ant-modal-content");

    await modalBody.getByRole("button", { name: "Activate" }).click();

    await Promise.all([page.waitForResponse((r) => r.url().includes("api/"))]);

    await page.getByRole("button", { name: "Active" }).first().click();

    await Promise.all([page.waitForResponse((r) => r.url().includes("api/"))]);

    console.log("selectedProductId", selectedProductId);
    await expect(page.getByText(selectedProductId).first()).toBeAttached();

    // await expect(page).toHaveURL(/dashboard/);
  });

  test("invalid login", async ({ page }) => {
    await page.goto("https://dev-iam.providhy.com/login");

    await page.locator('[data-cy="tenantId"]').fill("248413");
    await page.locator('[data-cy="username"]').fill("sushant1");
    await page.locator('[data-cy="password"]').fill("Admin@1234");

    await page.locator('[data-cy="login"]').click();
    await Promise.all([
      page.waitForResponse((r) => r.url().includes("api/token")),
    ]);

    await expect(
      page
        .getByText(
          "We couldn't verify your login information. Please check your Tenant ID, username, and password.",
        )
        .first(),
    ).toBeVisible();
  });

  test("test attendance", async ({ page }) => {
    await page.goto("https://hris.vidhypro.com/");

    await page.locator('[type="submit"]').click();
    await page
      .locator('[name="loginfmt"]')
      .fill("xxxxxx.xxxxxx@vidhypro.com");  // vidhypro email

    await page.locator('[type="submit"]').click();

    await page.locator('[name="passwd"]').fill("xxxxxx"); // vidhypro password

    await page.locator('input[type="submit"]').click();

    await page.locator('input[type="submit"]').click();

    await Promise.all([page.waitForResponse((r) => r.url().includes(""))]);

    await page.waitForTimeout(2000);

    await page.locator('a[data-url="/Attendance/QuickAttendanceRequest/QuickAttendance"]').click();

    await Promise.all([page.waitForResponse((r) => r.url().includes(""))]);

    await page.locator('[id="LoginID"]').nth(1).fill("xxxxxx"); //employee id
    await page.locator('[id="LoginPassword"]').nth(1).fill("xxxxx"); //employee password

    await page.locator('input[type="submit"][value="Submit"]').click();

    await expect(page.getByText("You have already checked In").first()).toBeAttached();
  });
});
