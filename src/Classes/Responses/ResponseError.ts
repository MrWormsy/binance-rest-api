import {Response, ResponseStatus} from "./Response";

export class ResponseError extends Response {

    /**
     * @param message The message of the error
     */
    constructor(public message: string) {
        super(ResponseStatus.ERROR, message);
    }
}
