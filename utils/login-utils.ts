import { Page } from "@playwright/test";

export const login = async ({ page }: { page: Page }) => {
//   await page.goto("https://dev-iam.providhy.com/login");

//   await page.locator('[data-cy="tenantId"]').fill("248413");
//   await page.locator('[data-cy="username"]').fill("sushant1");
//   await page.locator('[data-cy="password"]').fill("Admin@123");

  console.log(page, "remove this before comitting")

  await page.goto("https://uat-iam.providhy.com/login");

  await page.locator('[data-cy="tenantId"]').fill("044747");
  await page.locator('[data-cy="username"]').fill("uat1");
  await page.locator('[data-cy="password"]').fill("Test@123");

  await page.locator('[data-cy="login"]').click();
};
