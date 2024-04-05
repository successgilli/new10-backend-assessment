# Node.js Assignment (Serverless)

Congratulations, and welcome to the New10 Backend Engineer assignment!

We would like to see you (re)write a small NodeJS / Serverless app to showcase your knowledge of backend, serverless and API design using modern backend tools. Below you will find some recommendations from us on how you should approach this assignment, as well as a short brief for the app’s requirements.

Additionally we have provided some instructions on how to share your project with us. Please don’t hesitate to reach out with any further questions and enjoy!

[[_TOC_]]

## Things to know before getting started

- The main goal of this assignment is to test your skills in understanding an existing application and implementing new, well tested, functionality.
- Note that the current code is full of bad practices and inconsistencies, it's your job to refactor to best practices and standards that keep the code readable and simple.
- The app should be built using NodeJS and the Serverless Framework (already setup in the existing codebase).
- Feel free to use any additional NPM libraries you need to build/refactor the app.
- Don’t feel too restricted by the provided codebase, it's serving only as a reference and to also help us evaluate your approach to refactoring existing codebases. Feel free to move, delete and create as many files as you need.
- The app should run offline, so there's no need to deploy it anywhere.
- Although the existing codebase is using JavaScript, TypeScript is also accepted.

## The assignment

Take our existing “legacy” loan application and deliver an updated functional API which allows for viewing and managing loans (creation, disbursement and deletion). The application should use both the NodeJS runtime and the Serverless framework (offline).

### Requirements

1. Redesign the API and implement proper validations on inputs, including proper error messages and status code.
2. Extend the `/create` loan endpoint to also receive the `id` of the company applying for the loan.
    - Ensure the `id` is validated with [Test KVK API](#test-kvk-api) (see more info about the Test KvK API below), only companies present in this API should be accepted.
    - You should store all information about the company on DynamoDB.
3. Implement a new endpoint for the disburse functionality
    - `app1`: calls an endpoint on app2 to update the loan.
    - `app2`: processes the API request and updates the loan status to `disbursed`.
    - Both `app1` and `app2` are just folders and don't actually represent any logical/physical boundaries, you're free to rename and reorganize these to better fit the new structure you'll implement in the whole app.
4. Ensure the [OpenAPI specification](./docs/openapi.yml) reflects all the changes made to the API (codebase).
5. Basic functionality should be validated with unit tests (but be pragmatic and don't try to cover 100%).

### Test KVK API

An open (test) API provided by the Dutch Chamber of Commerce, with some mock companies and data about them. It’s free to use and does not require registration. You can follow the instructions at [https://developers.kvk.nl/documentation/testing](https://developers.kvk.nl/documentation/testing) to use the API.

Note that the company `id` mentioned above refers to `kvkNummer` in this Test API.

Example: in order to get data from a company based on its KVK number, the request should look like this:

```
curl -H "apikey: TEST_API_KEY_HERE" https://api.kvk.nl/test/api/v1/naamgevingen/kvknummer/69599084
```

### Tips

- Think about the API: Does it make sense? Does it follows the best practices?
- Think about your error handling flow.
- Think about the libraries used, don’t take the libraries that we included as mandatory.
- Rethink how the example project uses async/await.

## Getting started with the codebase

### Pre-requisites

- NodeJS >= v20
- [Serverless Framework](https://www.npmjs.com/package/serverless) (already installed in this project)
- Docker

### Getting started

1. Please clone this repository to your own space, making sure you create your new version as a Private repo (See further instructions below on how to share when finished).
2. The project is already setup for local development, so getting up to speed should be a breeze. It makes use of AWS Lambda for compute, and DynamoDB for storage, both of which are already pre-configured.

- Install dependencies: `npm install`
- Run tests: `npm test`
- Run a development server with [Serverless Offline](https://www.npmjs.com/package//serverless-offline): `npm start`
    - Make sure that the Docker daemon is running which is required for DynamoDB Local to run

## Uploading and sharing your project :rocket:

Once you have finished, please send us back the link to your newly created private version of the assignment (preferably on GitLab or GitHub). Before sending, please don’t forget to give us access to the project, so that we can review and pull down the code to run locally.

- GitLab: @sean.kiefer / @rictorres.new10
- GitHub: @sean6bucks / @rictorres
