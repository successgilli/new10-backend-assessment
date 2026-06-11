# Getting Started with the Frontend Web App

This folder contains a small React app that allows the user to Create, Disburse, and Delete loans.

**_NOTE: The web app is self contained in the `/web` folder, and commands should be executed within this scope_**

## Local Development

1. Install dependencies: `$ npm install`
2. Run a development server with `$ npm run start` command
    - Runs the app in the development mode, [http://localhost:8080](http://localhost:8080) to view it in your browser.

## Testing

### Pre-requisites
To run provided integration test suite with `playwright` make sure that you first have the necessary browser client installed
```
$ npx playwright install chromium
```

### Running Integration Tests

1. Run server client offline to test against
    - [Backend Client - Local Development](../src/README.md#local-development)
    - Should be done from the root folder
2. Run `$ npm run test` to trigger the integration test suite.
    - should be done from the `/web` folder
    - Playwright as been configured to automatically start the Frontend (8080) local server, so no need to run it ahead of time.

### Acceptance contract

[`tests/integration.spec.js`](./tests/integration.spec.js) is the acceptance contract for the frontend work. Your implementation must make it pass end-to-end against your running backend.

You're free to change the test if you find a genuine issue with it (a flaky selector, a missing scenario, an assertion that doesn't match the behaviour you're building). Just note what you changed and why in your README so we can talk through it during the review.

### UI contracts

The integration test depends on the following contracts. Treat these as fixed; everything else (component structure, styling, state management, copy outside this list) is yours to design.

- **Empty state:** when there are no loans, the page renders the text `No Loans Found`.
- **Create form:**
    - An input field with the accessible label `KvK Number` (i.e. a properly associated `<label>`).
    - An input field with the accessible label `Amount`.
    - A submit button whose accessible name contains `create` (case-insensitive) — so `Create`, `Create loan`, etc. all work.
- **Loan list rows:** each loan is rendered with `data-testid="loan-item"` and a `data-loan-id="<id>"` attribute holding the loan id.
- **Amount cell:** the amount is rendered as a raw number (e.g. `50000`), without currency symbols or thousands separators.
- **Status text:** each loan row contains the status as text, matched case-insensitively (`offered` / `disbursed` — uppercase, title case, etc. all work).
- **Row actions:** each loan row has two buttons whose accessible names contain `disburse` and `delete` respectively (case-insensitive). Accessible name typically comes from `aria-label` or visible button text.
- **After delete:** the deleted loan's id is no longer present anywhere on the page.
