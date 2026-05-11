import { expect, test } from "@playwright/test";

test("operations console loads live API data and dispatches an event", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: /Distributed energy/i }))
    .toBeVisible();
  await expect(page.getByText("API connected")).toBeVisible();
  await expect(page.locator(".asset-row")).toHaveCount(4);
  await page.getByRole("button", { name: /Start event/i }).click();
  await expect(page.getByText("active").first()).toBeVisible();
  expect(errors).toEqual([]);
});
