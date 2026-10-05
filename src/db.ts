import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? 'local',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? 'local',
    }
})

/**
 * Dynamo DB client.
 */
export const dynamo = DynamoDBDocumentClient.from(client)
