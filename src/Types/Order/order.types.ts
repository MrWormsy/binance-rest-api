export type OrderStatus =
    'NEW'
    | 'PARTIALLY_FILLED'
    | 'FILLED'
    | 'CANCELED'
    | 'PENDING_CANCEL'
    | 'REJECTED'
    | 'EXPIRED';

export type OrderType =
    'LIMIT'
    | 'MARKET'
    | 'STOP_LOSS'
    | 'STOP_LOSS_LIMIT'
    | 'TAKE_PROFIT'
    | 'TAKE_PROFIT_LIMIT'
    | 'LIMIT_MAKER';

export type OrderResponseType = 'ACK' | 'RESULT' | 'FULL';

export type OrderSide = 'BUY' | 'SELL';

export type OrderBookLimit = 5 | 10 | 20 | 50 | 100 | 500 | 1000 | 5000;

export interface BidsAsks {

    /**
     * The price of the bid/ask
     */
    [0]: string;

    /**
     * The quantity of the bid/ask
     */
    [1]: string;
}

export interface OrderFill {

    price: string;

    qty: string;

    commission: string;

    commissionAsset: string;
}
