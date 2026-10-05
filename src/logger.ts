import { APIGatewayEvent, Context } from 'aws-lambda'

/**
 * Logs to std.
 *
 * @param ctx
 * @param msg
 */
export const logInfo = (ctx: Context, event: APIGatewayEvent, msg: string) => {
    console.log(JSON.stringify({
        msg,
        requestID: ctx.awsRequestId,
        event,
    }))
}

/**
 * Logs to std.
 *
 * @param ctx
 * @param msg
 */
export const logError = (ctx: Context, event: APIGatewayEvent, msg: string) => {
    console.error(JSON.stringify({
        msg,
        requestID: ctx.awsRequestId,
        event,
    }))
}
