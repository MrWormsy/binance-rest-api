export type OCOStatus = 'RESPONSE' | 'EXEC_STARTED' | 'ALL_DONE';

export type OCOOrderStatus = 'EXECUTING' | 'ALL_DONE' | 'REJECT';

export interface OCOOrderSummary {

    symbol: string;

    orderId: number;

    clientOrderId: string;
}
