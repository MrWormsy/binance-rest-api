import crypto from "crypto";
import {BinanceAPIClient} from "../Classes";

/**
 * Get an object as a query parameters
 * @param params The params to parse
 * @return The query parameters
 */
export const getObjectAsQueryParameters = (params: { [p: string]: any }) => {
    return Object.keys(params).filter(key => params[key] !== undefined).map(key => key + '=' + (Array.isArray(params[key]) ? JSON.stringify(params[key]) : params[key])).join('&');
}

/**
 * Get the signature from the query parameters and the secret key
 * @param client The client wanting to sign
 * @param parameters The query parameters
 * @return The parameters signed by the secret key
 */
export const getSignatureFromParameters = (client: BinanceAPIClient, parameters: object) => {
    return getSignatureFromParametersAndBody(client, parameters, {});
}

/**
 * Get the signature from the request body and the secret key
 * @param client The client wanting to sign
 * @param body The body of the request
 * @return The parameters signed by the secret key
 */
export const getSignatureFromBody = (client: BinanceAPIClient, body: object) => {
    return getSignatureFromParametersAndBody(client, {}, body);
}

/**
 * Get the signature from the query parameters, the request body and the secret key
 * @param client The client wanting to sign
 * @param parameters The query parameters
 * @param body The body of the request
 * @return The parameters signed by the secret key
 */
export const getSignatureFromParametersAndBody = (client: BinanceAPIClient, parameters: object, body: object) => {
    return crypto.createHmac('sha256', client.binanceSecretKey)
        .update(getObjectAsQueryParameters({...parameters, ...body}))
        .digest('hex');
}
