import {Symbol, SymbolPermission} from "./Symbol";
import {RateLimit, RateLimitInterval, RateLimitType} from "./RateLimit";
import {ExchangeFilter} from "./Filter";
import {BidsAsks, OrderFill, OrderSide, OrderStatus, OrderType} from "./Order";
import {TimeInForce} from "./TimeInForce";
import {OCOOrderStatus, OCOOrderSummary, OCOStatus} from "./OCO";
import {SymbolBalance} from "./Account";

/**
 * The response types we can get
 */
export type BinanceResponseType = IResponseEmpty | IResponseServerTime | IResponseExchangeInfo | IResponseOrderBook | IResponseTrade | IResponseTradeAggregated | IResponseKLine | IResponseAveragePrice | IResponse24HTickerPrice | IResponseSymbolPriceTicker | IResponseSymbolOrderBookTicker | IResponseNewOrderACK | IResponseNewOrderRESULT | IResponseNewOrderFULL | IResponseOrder | IResponseOCOOrder | IResponseNewOCOOrderACK | IResponseNewOCOOrderRESULT | IResponseNewOCOOrderFULL | IResponseAccountInformation | IResponseOrderCountUsage | IResponseStartUserDataStream;

/**
 * An empty response
 */
export interface IResponseEmpty {
}

/**
 * A single timestamp response with the server time
 */
export interface IResponseServerTime {
    serverTime: number
}

/**
 * The exchange info response
 */
export interface IResponseExchangeInfo {

    timezone: string;

    serverTime: number;

    rateLimits: RateLimit[];

    exchangeFilters: ExchangeFilter[];

    symbols: symbol[];
}

/**
 * The response of an order book
 */
export interface IResponseOrderBook {

    lastUpdateId: number;

    bids: BidsAsks[];

    asks: BidsAsks[];
}

/**
 * The response element of a trade
 */
export interface IResponseTrade {

    id: number;

    price: string;

    qty: string;

    quoteQty: string;

    time: number;

    isBuyerMaker: boolean;

    isBestMatch: boolean;
}

/**
 * The response element of a trade aggregated
 */
export interface IResponseTradeAggregated {

    /**
     * Aggregate tradeId
     */
    a: number;

    /**
     * Price
     */
    p: string;

    /**
     * Quantity
     */
    q: string;

    /**
     * First tradeId
     */
    f: number;

    /**
     * Last tradeId
     */
    l: number;

    /**
     * Timestamp
     */
    T: number;

    /**
     * Was the buyer the maker?
     */
    m: boolean;

    /**
     * Was the trade the best price match?
     */
    M: boolean;
}

/**
 * The response element of a KLine
 */
export interface IResponseKLine {

    /**
     * Open time
     */
    [0]: number;

    /**
     * Open
     */
    [1]: string;

    /**
     * High
     */
    [2]: string;

    /**
     * Low
     */
    [3]: string;

    /**
     * Close
     */
    [4]: string;

    /**
     * Volume
     */
    [5]: string;

    /**
     * Close time
     */
    [6]: number;

    /**
     * Quote asset volume
     */
    [7]: string;

    /**
     * Number of trades
     */
    [8]: number;

    /**
     * Taker buy base asset volume
     */
    [9]: string;

    /**
     * Taker buy quote asset volume
     */
    [10]: string;

    /**
     * Ignore
     */
    [11]: string
}

/**
 * The response of the average price of a symbol
 */
export interface IResponseAveragePrice {

    mins: number;

    price: string;
}

/**
 * The response of the symbol's 24h ticker price
 */
export interface IResponse24HTickerPrice {

    symbol: string;

    priceChange: string;

    priceChangePercent: string;

    weightedAvgPrice: string;

    prevClosePrice: string;

    lastPrice: string;

    lastQty: string;

    bidPrice: string;

    bidQty: string;

    askPrice: string;

    askQty: string;

    openPrice: string;

    highPrice: string;

    lowPrice: string;

    volume: string;

    quoteVolume: string;

    openTime: number;

    closeTime: number;

    /**
     * First tradeId
     */
    firstId: number;

    /**
     * Last tradeId
     */
    lastId: number;

    /**
     * Trade count
     */
    count: number;
}

/**
 * The response element of a symbol's price ticker
 */
export interface IResponseSymbolPriceTicker {

    symbol: string;

    price: string;
}

/**
 * The response element of a symbol's order book ticker
 */
export interface IResponseSymbolOrderBookTicker {

    symbol: string;

    bidPrice: string;

    bidQty: string;

    askPrice: string;

    askQty: string;

}

export interface IResponseNewOrderACK {

    symbol: string;

    orderId: number;

    orderListId: number;

    clientOrderId: string;

    transactTime: number;
}

export interface IResponseNewOrderRESULT extends IResponseNewOrderACK {

    price?: string;

    origQty?: string;

    executedQty?: string;

    cummulativeQuoteQty?: string;

    status?: OrderStatus;

    timeInForce?: TimeInForce;

    type?: OrderType;

    side?: OrderSide;
}

export interface IResponseNewOrderFULL extends IResponseNewOrderRESULT {

    fills?: OrderFill[];
}

export interface IResponseOrder {

    symbol: string

    origClientOrderId: string;

    orderId: number

    orderListId: number;

    clientOrderId: string;

    price: string;

    origQty: string;

    executedQty: string;

    cummulativeQuoteQty: string;

    status: OrderStatus;

    timeInForce: TimeInForce;

    type: OrderType;

    side: OrderSide;

    stopPrice: string;

    icebergQty: string;

    time: number;

    updateTime: number;

    isWorking: boolean;

    origQuoteOrderQty: string;
}

export interface IResponseOCOOrder {

    contingencyType: "OCO";

    listStatusType: OCOStatus;

    listOrderStatus: OCOOrderStatus;

    listClientOrderId: string;

    transactionTime: number;

    orderListId: number;

    symbol: string;

    orders: OCOOrderSummary[];

    orderReports?: IResponseOrder[]
}

export type IResponseOrderOrOCOOrder = IResponseOrder | IResponseOCOOrder;

export interface IResponseNewOCOOrderACK extends IResponseNewOrderACK {
    orders: OCOOrderSummary[];
    orderReports: IResponseOrder[];
}

export interface IResponseNewOCOOrderRESULT extends IResponseNewOrderRESULT {
    orders: OCOOrderSummary[];
    orderReports: IResponseOrder[];
}

export interface IResponseNewOCOOrderFULL extends IResponseNewOrderFULL {
    orders: OCOOrderSummary[];
    orderReports: IResponseOrder[];
}

export interface IResponseAccountInformation {

    makerCommission: number;

    takerCommission: number;

    buyerCommission: number;

    sellerCommission: number;

    canTrade: boolean;

    canWithdraw: boolean

    canDeposit: boolean;

    updateTime: number;

    accountType: SymbolPermission;

    balances: SymbolBalance[];

    permissions: SymbolPermission[];
}

export interface IResponseOrderCountUsage {

    rateLimitType: RateLimitType,

    interval: RateLimitInterval;

    intervalNum: number;

    limit: number;

    count: number;
}

export interface IResponseStartUserDataStream {
    listenKey: string;
}
