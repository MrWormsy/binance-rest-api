export enum ResponseStatus {
    ERROR = "error",
    SUCCESS = "success"
}

export class Response {

    constructor(public status: ResponseStatus, public data: any) {
    }

}
