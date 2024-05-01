# Getting Started with the Backend Client

This project uses `serverless-offline` to handle Lambda invocations locally, as well as a Docker image to help imitate a DynamoDB instance. Make sure that the Docker daemon is running

**_NOTE: While this doc is in the `/src`, scripts for backend should be run from the root folder_**
  
### Local Development

- Install dependencies: `npm install`
- Run a development server with [Serverless Offline](https://www.npmjs.com/package//serverless-offline): `npm start`

### Testing

To run unit tests, use the `npm run test` command