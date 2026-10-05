import { APIGatewayEvent, Context } from 'aws-lambda'
import { dynamo } from '../db'
import { createLoan, deleteLoan, disburse, getAll } from './handlers'
import { fetchCompany, updateLoanStatus } from './helpers'
import { LoanStatus } from '../types'
import { marshall } from '@aws-sdk/util-dynamodb'
import { NotFoundAppError } from './errors'

jest.mock('../db', () => ({
    dynamo: {
        send: jest.fn(),
    },
}))

jest.mock('./helpers', () => ({
    fetchCompany: jest.fn(),
    updateLoanStatus: jest.fn(),
}))

const mockSend = dynamo.send as jest.Mock
const mockFetchCompany = fetchCompany as jest.Mock
const mockUpdateLoanStatus = updateLoanStatus as jest.Mock

const ctx = {} as Context

describe('createLoan', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('creates a loan', async () => {
        mockFetchCompany.mockResolvedValue({
            kvkNummer: '69599084',
            naam: 'Test Company',
        })
        mockSend.mockResolvedValue({})

        const event = {
            body: JSON.stringify({
                amount: 10000,
                companyID: '69599084',
            }),
        } as APIGatewayEvent

        const response = await createLoan(event, ctx)

        expect(response.statusCode).toBe(200)
        expect(JSON.parse(response.body)).toMatchSnapshot({
            data: {
                id: expect.any(String),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            },
        })
        expect(mockFetchCompany).toHaveBeenCalledWith('69599084')
        expect(mockSend).toHaveBeenCalledTimes(2)
    })

    it('returns 400 for invalid request', async () => {
        const event = {
            body: JSON.stringify({
                amount: 10000,
            }),
        } as APIGatewayEvent

        const response = await createLoan(event, ctx)

        expect(response.statusCode).toBe(400)
        expect(mockSend).not.toHaveBeenCalled()
    })
})

describe('getAll', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('returns all loans', async () => {
        mockSend.mockResolvedValue({
            Items: [
                marshall({
                    id: 'loan-1',
                    companyID: '69599084',
                    amount: 10000,
                    status: LoanStatus.OFFERED,
                }),
            ],
        })

        const response = await getAll({} as APIGatewayEvent, ctx)

        expect(response.statusCode).toBe(200)

        expect(JSON.parse(response.body)).toEqual({
            data: {
                loans: [
                    {
                        id: 'loan-1',
                        companyID: '69599084',
                        amount: 10000,
                        status: LoanStatus.OFFERED,
                    },
                ],
                count: 1,
            },
        })
    })

    it('returns 500 when database operation fails', async () => {
        mockSend.mockRejectedValue(new Error('DynamoDB failed'))

        const response = await getAll({} as APIGatewayEvent, ctx)

        expect(response.statusCode).toBe(500)
    })
})

describe('deleteLoan', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('deletes a loan', async () => {
        mockSend.mockResolvedValue({
            Attributes: {
                id: 'loan-1',
                amount: 10000,
                status: LoanStatus.OFFERED,
            },
        })

        const event = {
            pathParameters: { id: 'loan-1' },
        } as unknown as APIGatewayEvent

        const response = await deleteLoan(event, ctx)

        expect(response.statusCode).toBe(200)
        expect(mockSend).toHaveBeenCalledTimes(1)
    })

    it('returns 404 when loan does not exist', async () => {
        mockSend.mockResolvedValue({})

        const event = {
            pathParameters: { id: 'missing-loan' },
        } as unknown as APIGatewayEvent

        const response = await deleteLoan(event, ctx)

        expect(response.statusCode).toBe(404)
    })
})

describe('disburse', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('disburses a loan', async () => {
        mockUpdateLoanStatus.mockResolvedValue({
            id: 'loan-1',
            amount: 10000,
            status: LoanStatus.DISBURSED,
        })

        const event = {
            pathParameters: { id: 'loan-1' },
        } as unknown as APIGatewayEvent

        const response = await disburse(event, ctx)

        expect(response.statusCode).toBe(200)
        expect(mockUpdateLoanStatus).toHaveBeenCalledWith('loan-1')
    })

    it('returns 404 when loan does not exist', async () => {
        mockUpdateLoanStatus.mockRejectedValue(new NotFoundAppError('Loan not found'))

        const event = {
            pathParameters: { id: 'missing-loan' },
        } as unknown as APIGatewayEvent

        const response = await disburse(event, ctx)

        expect(response.statusCode).toBe(404)
    })
})
