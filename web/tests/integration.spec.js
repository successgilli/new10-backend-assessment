// @ts-check
const { test, expect } = require("@playwright/test");

const KVK_1 = "69599076";

test("Create, Update, and Delete Loans", async ({ page }) => {
    let targetLoanId, targetLoanEl;
    await test.step("Open form and check no loans created yet", async () => {
        await page.goto("/");
        // check that no loans currently in list
        await expect(page.getByText("No Loans Found")).toBeVisible();
    });

    await test.step("Create Loan and see displayed in Loans list", async () => {
        // fill in loan form based on label selector
        await page.getByLabel("KvK Number").fill(KVK_1);
        await page.getByLabel("Amount").fill("50000");
        // submit create form
        await page.getByText("Create").click();

        // wait for at least one loan item to render
        await expect(await page.getByTestId("loan-item").first()).toBeVisible();

        // check that lasted loan in list (in case of DB not being reset) is the recently created one
        await expect(
            page
                .getByTestId("loan-item")
                .last()
                .getByText("50000")
        ).toBeVisible();
        await expect(
            page
                .getByTestId("loan-item")
                .last()
                .getByText("offered")
        ).toBeVisible();
    });

    await test.step(
        "Disburse Loan and see updated status Loans list",
        async () => {
            // get loan id from list content
            targetLoanEl = await page.getByTestId("loan-item").last();
            targetLoanId = await targetLoanEl.getAttribute("data-loan-id");

            // disburse loan
            await targetLoanEl
                .getByRole("button", { name: "disburse" })
                .click();

            // check that status is updated
            await expect(targetLoanEl.getByText("disbursed")).toBeVisible();
        }
    );

    await test.step("Delete Loan and see updated Loans list", async () => {
        // click disburse
        await targetLoanEl.getByRole("button", { name: "delete" }).click();

        // check that status is updated
        await expect(page.getByText(targetLoanId)).not.toBeVisible();
    });
});
