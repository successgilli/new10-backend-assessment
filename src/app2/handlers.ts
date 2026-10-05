import { UpdateCommand } from '@aws-sdk/lib-dynamodb'
import { APIGatewayEvent, Context } from 'aws-lambda'
import { dynamo } from '../db'
import { logError, logInfo } from '../logger'
import { ApiError, LoanStatus } from '../types'
import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb'

export const setLoanStatusDisbursed = async (event: APIGatewayEvent, ctx: Context) => {
    try {
        logInfo(ctx, event, 'setLoanStatusDisbursed triggered')

        // Validate request
        const id = event.pathParameters?.id

        if (!id) {
            const errors: ApiError[] = [
                {
                    code: 'VALIDATION_ERROR',
                    message: 'Loan id is required',
                    field: 'id',
                },
            ]

            return {
                statusCode: 400,
                body: JSON.stringify({ errors }),
            }
        }

        // Update loan status
        const result = await dynamo.send(
            new UpdateCommand({
                TableName: 'Loan',
                Key: {
                    id,
                },
                UpdateExpression: 'SET #status = :status',
                ExpressionAttributeNames: {
                    '#status': 'status',
                },
                ExpressionAttributeValues: {
                    ':status': LoanStatus.DISBURSED,
                },
                ConditionExpression: 'attribute_exists(id)',
                ReturnValues: 'ALL_NEW',
            })
        )

        return {
            statusCode: 200,
            body: JSON.stringify({ data: result.Attributes }),
        }
    } catch (err: unknown) {
        if (err instanceof ConditionalCheckFailedException) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    errors: [
                        {
                            code: 'NOT_FOUND',
                            message: 'Loan not found',
                            field: 'id',
                        },
                    ],
                }),
            }
        }

        logError(ctx, event, `unexpected error occurred: ${err}`)

        return {
            statusCode: 500,
            body: JSON.stringify({
                errors: [{ code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' }],
            }),
        }
    }
}
