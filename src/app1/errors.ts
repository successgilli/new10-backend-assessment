/**
 * Not found app error
 */
export class NotFoundAppError extends Error {
    constructor(msg: string, cause?: unknown) {
        super(msg, { cause })
        this.name = 'NotFoundAppError'
    }
}
