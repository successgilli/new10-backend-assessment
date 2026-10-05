/**
 * Not found app error
 */
export class NotFoundAppError extends Error {
    constructor(msg: string, cause?: unknown) {
        super(msg, { cause })
        this.name = 'NotFoundAppError'
    }
}

/**
 * Not found app error
 */
export class ForbiddenAppError extends Error {
    constructor(msg: string, cause?: unknown) {
        super(msg, { cause })
        this.name = 'ForbiddenAppError'
    }
}
