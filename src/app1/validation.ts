import joi from 'joi'
import { Loan, loanCreationReq, LoanStatus } from '../types'

/**
 * Schema validation definition for a loan item.
 */
export const loanCreationItemSchema = joi.object<Loan>({
    id: joi.string().uuid().required(),
    companyID: joi.string().required(),
    amount: joi.number().min(1).required(),
    status: joi.string().valid(LoanStatus.OFFERED, LoanStatus.DISBURSED).required(),
    createdAt: joi.string().isoDate().required(),
    updatedAt: joi.string().isoDate().required(),
})

/**
 * Validation for loan request object.
 */
export const createLoanReqSchema = joi.object<loanCreationReq>({
    companyID: joi.string().required(),
    amount: joi.number().required(),
})
