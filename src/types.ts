/**
 * API interface error.
 */
export interface ApiError {
    // TODO: use enum for code
    code: string
    message: string

    /** Available for validation errors */
    field?: string
}

/**
 * loan creation input request item.
 */
export interface loanCreationReq {
    companyID: string
    amount: number
}

/**
 * Loan entity
 */
export interface Loan {
    /** The ID f the loan request */
    id: string

    /** The id of the company requesting the loan */
    companyID: string
    amount: number
    status: LoanStatus
    createdAt: string
    updatedAt: string
}

/** Available loan statuses */
export enum LoanStatus {
    OFFERED = 'OFFERED',
    DISBURSED = 'DISBURSED',
}

export type LoanRequestExtractionResult = LoanRequestExtractionError | LoanRequestExtractionSuccess

interface LoanRequestExtractionError {
    success: false
    errors: ApiError[]
    value?: Loan
}

interface LoanRequestExtractionSuccess {
    success: true
    value: Loan
    errors: []
}

export enum Tables {
    Loan = 'Loan',
    Company = 'Company'
}
