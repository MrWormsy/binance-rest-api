import {Response, ResponseStatus} from "./Response";

export class ResponseSuccess<T> extends Response {

    /**
     * @param data The data
     */
    constructor(public data: T) {
        super(ResponseStatus.SUCCESS, data);
    }
}
