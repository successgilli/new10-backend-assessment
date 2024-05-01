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
