import { ApiError } from '../types'
import { NotFoundAppError } from './errors'

const DEFAULT_TIMEOUT = 10000

/**
 * Fetches json info for company ID. Can be used to validate company ID.
 * @param companyId
 * @returns
 */
export const fetchCompany = async (companyId: string): Promise<Record<string, unknown>> => {
    const response = await fetch(
        `https://api.kvk.nl/test/api/v1/naamgevingen/kvknummer/${companyId}`,
        {
            signal: AbortSignal.timeout(DEFAULT_TIMEOUT),
            headers: {
                apikey: process.env.KVK_SECRETE ?? '',
            },
        }
    )

    if (!response.ok) {
        throw new Error(`KvK API returned ${response.status}`)
    }

    const data = await response.json()

    return data as Record<string, unknown>
}

/**
 * Requests App 2 to update the status of a loan.
 * @param loanId
 * @param status
 * @returns
 */
export const updateLoanStatus = async (loanId: string): Promise<Record<string, unknown>> => {
    const response = await fetch(`${process.env.APP2_URL}/loans/disbursed/${loanId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(DEFAULT_TIMEOUT),
    })

    if (!response.ok) {
        const body = (await response.json()) as { errors: ApiError[] }

        if (response.status === 404 && body.errors?.[0]?.code == 'NOT_FOUND') {
            throw new NotFoundAppError(`App 2 returned ${response.status}; loan ID not found`)
        }

        throw new Error(`App 2 returned ${response.status}`)
    }

    const body = await response.json() as { data: Record<string, unknown>}

    return body.data as Record<string, unknown>
}
