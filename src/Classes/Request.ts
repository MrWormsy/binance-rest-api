import {BinanceResponseType, MethodType} from "../Types";
import {BinanceAPIClient} from "./BinanceAPIClient";
import {getObjectAsQueryParameters, getSignatureFromParameters} from "../Utils/Utils";
import axios from "axios";
import {ResponseError} from "./Responses";

export class Request {

    /**
     * Create a request
     * @param method The method to make the request with
     * @param endpoint The endpoint to reach
     * @param signed If the method is signed
     */
    constructor(public method: MethodType, public endpoint: string, public signed: boolean = false) {}

    /**
     * Call the request
     * @param client The binance client
     * @param parameters The parameters of the request
     */
    public call = async (client: BinanceAPIClient, parameters: any): Promise<ResponseError | BinanceResponseType> => {

        // Build the URL
        let url = `${client.apiUrl}${this.endpoint}`;

        // If there are parameters we want to append them
        if (parameters !== {}) {
            url = `${url}?${getObjectAsQueryParameters(parameters)}`;
        }

        // If the request needs to be signed we add the signature
        if (this.signed) {

            // Get the signature
            const signature = getSignatureFromParameters(client, parameters);

            // If there is no parameters we want to add the '?'
            if (parameters === {}) {
                url = `${url}?signature=${signature}`;
            } else {
                url = `${url}&signature=${signature}`;
            }
        }

        // Try to make the call
        try {
            const response = await axios.request({
                method: this.method,
                url: url,
                headers: {
                    "X-MBX-APIKEY": client.binanceAPIKey
                }
            });

            // Return the response
            return response.data;
        }

        // If there is an error we catch it and return an error response
        catch (e: any) {
            return new ResponseError(e.response.data);
        }
    }
}
