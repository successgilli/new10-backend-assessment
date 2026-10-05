import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb'
import { APIGatewayEvent, Context } from 'aws-lambda'
import { dynamo } from '../db'
import { setLoanStatusDisbursed } from './handlers'
import { LoanStatus } from '../types'

jest.mock('../db', () => ({
    dynamo: {
        send: jest.fn(),
    },
}))

const mockSend = dynamo.send as jest.Mock

const ctx = {} as Context

describe('setLoanStatusDisbursed', () => {
    beforeEach(() => {
        process.env.INTERNAL_AUTH_SECRET = 'test-auth-secret'
        jest.clearAllMocks()
    })

    it('updates loan status to disbursed', async () => {
        mockSend.mockResolvedValue({
            Attributes: {
                id: 'loan-1',
                status: LoanStatus.DISBURSED,
                amount: 10000,
                companyID: '69599084',
            },
        })

        const event = {
            pathParameters: { id: 'loan-1' },
            headers: { internal_hash: 'test-auth-secret' },
        } as unknown as APIGatewayEvent

        const response = await setLoanStatusDisbursed(event, ctx)

        expect(response?.statusCode).toBe(200)
        expect(JSON.parse(response.body)).toMatchSnapshot()
    })

    it('returns 400 when loan ID not provided', async () => {
        const event = {} as unknown as APIGatewayEvent

        const response = await setLoanStatusDisbursed(event, ctx)

        expect(response?.statusCode).toBe(400)
    })

    it('returns 403 when lacks auth header', async () => {
        mockSend.mockRejectedValue(
            new ConditionalCheckFailedException({
                message: 'Condition failed',
                $metadata: {},
            })
        )

        const event = {
            pathParameters: { id: 'missing-loan' },
        } as unknown as APIGatewayEvent

        const response = await setLoanStatusDisbursed(event, ctx)

        expect(response?.statusCode).toBe(403)
    })

        it('returns 403 when has auth header with bad secret', async () => {
        mockSend.mockRejectedValue(
            new ConditionalCheckFailedException({
                message: 'Condition failed',
                $metadata: {},
            })
        )

        const event = {
            pathParameters: { id: 'missing-loan' },
            headers: { internal_hash: 'test-auth-secret-wrong' },
        } as unknown as APIGatewayEvent

        const response = await setLoanStatusDisbursed(event, ctx)

        expect(response?.statusCode).toBe(403)
    })

    it('returns 404 when loan does not exist', async () => {
        mockSend.mockRejectedValue(
            new ConditionalCheckFailedException({
                message: 'Condition failed',
                $metadata: {},
            })
        )

        const event = {
            pathParameters: { id: 'missing-loan' },
            headers: { internal_hash: 'test-auth-secret' },
        } as unknown as APIGatewayEvent

        const response = await setLoanStatusDisbursed(event, ctx)

        expect(response?.statusCode).toBe(404)
    })
})
