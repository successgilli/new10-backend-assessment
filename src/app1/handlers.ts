import { DeleteCommand, PutCommand } from '@aws-sdk/lib-dynamodb'
import { Context, APIGatewayEvent } from 'aws-lambda'
import { dynamo } from '../db'
import { createLoanReqSchema, loanCreationItemSchema } from './validation'
import { logInfo, logError } from '../logger'
import { ApiError, Loan, LoanStatus, Tables } from '../types'
import { fetchCompany, updateLoanStatus } from './helpers'
import { randomUUID } from 'crypto'
import { ScanCommand } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { NotFoundAppError, ForbiddenAppError } from './errors'

export const createLoan = async (event: APIGatewayEvent, ctx: Context) => {
    try {
        logInfo(ctx, event, 'handler1 triggered')

        // Validate request
        const reqBody = createLoanReqSchema.validate(JSON.parse(event.body ?? ''))

        if (reqBody.error) {
            const errors: ApiError[] = reqBody.error.details.map(item => ({
                code: 'VALIDATION_ERROR',
                message: item.message,
                field: item.path.join('.'),
            }))

            return {
                statusCode: 400,
                body: JSON.stringify({ errors }),
            }
        }

        // Construct loan entity
        const { amount, companyID } = reqBody.value

        const now = new Date().toISOString()
        const loan: Loan = {
            id: randomUUID(),
            companyID,
            amount,
            status: LoanStatus.OFFERED,
            createdAt: now,
            updatedAt: now,
        }

        // validate loan entity.
        const validation = loanCreationItemSchema.validate(loan)

        if (validation.error) {
            const errors: ApiError[] = validation.error.details.map(item => ({
                code: 'VALIDATION_ERROR',
                message: item.message,
                field: item.path.join('.'),
            }))

            return {
                statusCode: 400,
                body: JSON.stringify({ errors }),
            }
        }

        // Insert company in DB
        const company = await fetchCompany(loan.companyID)
        await dynamo.send(
            new PutCommand({
                TableName: Tables.Company,
                Item: company,
            })
        )

        // Insert loan in DB.
        await dynamo.send(
            new PutCommand({
                TableName: Tables.Loan,
                Item: loan,
            })
        )

        return {
            statusCode: 200,
            body: JSON.stringify({ data: loan }),
        }
    } catch (err: unknown) {
        logError(ctx, event, `unexpected error occurred: ${err}`)

        return {
            statusCode: 500,
            body: JSON.stringify({
                errors: [{ code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' }],
            }),
        }
    }
}

export const disburse = async (event: APIGatewayEvent, ctx: Context) => {
    try {
        logInfo(ctx, event, 'disburse handler triggered')

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

        // Request loan status update
        const loan = await updateLoanStatus(id)

        return {
            statusCode: 200,
            body: JSON.stringify({ data: loan }),
        }
    } catch (err: unknown) {
        if (err instanceof NotFoundAppError) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    errors: [
                        {
                            code: 'NOT_FOUND',
                            message: 'Loan not found',
                        },
                    ],
                }),
            }
        }

        if (err instanceof ForbiddenAppError) {
            return {
                statusCode: 403,
                body: JSON.stringify({
                    errors: [
                        {
                            code: 'FORBIDDEN',
                            message: 'forbidden',
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

export const getAll = async (event: APIGatewayEvent, ctx: Context) => {
    try {
        logInfo(ctx, event, 'getAll handler triggered')

        const result = await dynamo.send(
            new ScanCommand({
                TableName: 'Loan',
                Limit: 10000,
            })
        )

        const loans = (result.Items ?? []).map(item => unmarshall(item)) as Loan[]

        return {
            statusCode: 200,
            body: JSON.stringify({ data: { loans, count: loans.length } }),
        }
    } catch (err: unknown) {
        logError(ctx, event, `unexpected error occurred: ${err}`)

        return {
            statusCode: 500,
            body: JSON.stringify({
                errors: [{ code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' }],
            }),
        }
    }
}

export const deleteLoan = async (event: APIGatewayEvent, ctx: Context) => {
    try {
        logInfo(ctx, event, 'deleteLoan handler triggered')

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

        // Delete loan
        const result = await dynamo.send(
            new DeleteCommand({
                TableName: 'Loan',
                Key: {
                    id,
                },
                ReturnValues: 'ALL_OLD',
            })
        )

        // Loan does not exist
        if (!result.Attributes) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    errors: [
                        {
                            code: 'NOT_FOUND',
                            message: 'Loan not found',
                        },
                    ],
                }),
            }
        }

        const loan = result.Attributes as Loan

        return {
            statusCode: 200,
            body: JSON.stringify({ data: loan }),
        }
    } catch (err: unknown) {
        logError(ctx, event, `unexpected error occurred: ${err}`)

        return {
            statusCode: 500,
            body: JSON.stringify({
                errors: [{ code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' }],
            }),
        }
    }
}
