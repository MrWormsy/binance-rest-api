/**
 * The symbol filters
 */
export type SymbolFilter =
    PriceFilter
    | PercentPrice
    | LotSize
    | MinNotional
    | IcebergParts
    | MarketLotSize
    | MaxNumOrders
    | MaxNumAlgoOrders
    | MaxNumIcebergOrders
    | MaxPosition;

/**
 * The Exchange filters
 */
export type ExchangeFilter = ExchangeMaxNumOrders | ExchangeMaxNumALgoOrders;

/**
 * The PRICE_FILTER defines the price rules for a symbol
 */
export interface PriceFilter {

    /**
     * The filter type
     */
    filterType: "PRICE_FILTER";

    /**
     * Defines the minimum price/stopPrice allowed; disabled on minPrice == 0
     */
    minPrice: string;

    /**
     * Defines the maximum price/stopPrice allowed; disabled on maxPrice == 0
     */
    maxPrice: string;

    /**
     * Defines the intervals that a price/stopPrice can be increased/decreased by; disabled on tickSize == 0
     */
    tickSize: string;
}

/**
 * The PERCENT_PRICE filter defines valid range for a price based on the average of the previous trades. avgPriceMins is the number of minutes the average price is calculated over. 0 means the last price is used
 */
export interface PercentPrice {

    /**
     * The filter type
     */
    filterType: "PERCENT_PRICE";

    multiplierUp: string;

    multiplierDown: string;

    avgPriceMins: number;
}

/**
 * The LOT_SIZE filter defines the quantity (aka "lots" in auction terms) rules for a symbol. There are 3 parts:
 */
export interface LotSize {

    /**
     * The filter type
     */
    filterType: "LOT_SIZE";

    /**
     * Defines the minimum quantity/icebergQty allowed
     */
    minQty: string;

    /**
     * Defines the maximum quantity/icebergQty allowed
     */
    maxQty: string;

    /**
     * Defines the intervals that a quantity/icebergQty can be increased/decreased by
     */
    stepSize: string;
}

/**
 * The MIN_NOTIONAL filter defines the minimum notional value allowed for an order on a symbol. An order's notional value is the price * quantity. applyToMarket determines whether or not the MIN_NOTIONAL filter will also be applied to MARKET orders. Since MARKET orders have no price, the average price is used over the last avgPriceMins minutes. avgPriceMins is the number of minutes the average price is calculated over. 0 means the last price is used.
 */
export interface MinNotional {

    /**
     * The filter type
     */
    filterType: "MIN_NOTIONAL",

    minNotional: string;

    applyToMarket: boolean;

    avgPriceMins: number;
}

/**
 * The ICEBERG_PARTS filter defines the maximum parts an iceberg order can have. The number of ICEBERG_PARTS is defined as CEIL(qty / icebergQty)
 */
export interface IcebergParts {

    /**
     * The filter type
     */
    filterType: "ICEBERG_PARTS";

    limit: number;
}

/**
 * The MARKET_LOT_SIZE filter defines the quantity (aka "lots" in auction terms) rules for MARKET orders on a symbol. There are 3 parts
 */
export interface MarketLotSize {

    /**
     * The filter type
     */
    filterType: "MARKET_LOT_SIZE";

    /**
     * Defines the minimum quantity allowed
     */
    minQty: string;

    /**
     * Defines the maximum quantity allowed
     */
    maxQty: string;

    /**
     * Defines the intervals that a quantity can be increased/decreased by
     */
    stepSize: string;
}

/**
 * The MAX_NUM_ORDERS filter defines the maximum number of orders an account is allowed to have open on a symbol. Note that both "algo" orders and normal orders are counted for this filter
 */
export interface MaxNumOrders {

    /**
     * The filter type
     */
    filterType: "MAX_NUM_ORDERS";

    /**
     * The maximum number of orders an account is allowed to have open on a symbol
     */
    maxNumOrders: number;
}

/**
 * The MAX_NUM_ALGO_ORDERS filter defines the maximum number of "algo" orders an account is allowed to have open on a symbol. "Algo" orders are STOP_LOSS, STOP_LOSS_LIMIT, TAKE_PROFIT, and TAKE_PROFIT_LIMIT orders
 */
export interface MaxNumAlgoOrders {

    /**
     * The filter type
     */
    filterType: "MAX_NUM_ALGO_ORDERS";

    /**
     * The maximum number of "algo" orders an account is allowed to have open on a symbol
     */
    maxNumAlgoOrders: number;
}

/**
 * The MAX_NUM_ICEBERG_ORDERS filter defines the maximum number of ICEBERG orders an account is allowed to have open on a symbol. An ICEBERG order is any order where the icebergQty is > 0
 */
export interface MaxNumIcebergOrders {

    /**
     * The filter type
     */
    filterType: "MAX_NUM_ICEBERG_ORDERS";

    /**
     * The maximum number of ICEBERG orders an account is allowed to have open on a symbol
     */
    maxNumIcebergOrders: number;
}

/**
 * The MAX_POSITION filter defines the allowed maximum position an account can have on the base asset of a symbol. An account's position defined as the sum of the account's
 * 1. free balance of the base asset
 * 2. locked balance of the base asset
 * 3. sum of the qty of all open BUY orders
 *
 * BUY orders will be rejected if the account's position is greater than the maximum position allowed
 */
export interface MaxPosition {

    /**
     * The filter type
     */
    filterType: "MAX_POSITION";

    /**
     * The allowed maximum position an account can have on the base asset of a symbol
     */
    maxPosition: string;
}

/**
 * The MAX_NUM_ORDERS filter defines the maximum number of orders an account is allowed to have open on the exchange. Note that both "algo" orders and normal orders are counted for this filter
 */
export interface ExchangeMaxNumOrders {

    /**
     * The filter type
     */
    filterType: "EXCHANGE_MAX_NUM_ORDERS";

    /**
     * The maximum number of orders an account is allowed to have open on the exchange
     */
    maxNumOrders: number;
}

/**
 * The MAX_ALGO_ORDERS filter defines the maximum number of "algo" orders an account is allowed to have open on the exchange. "Algo" orders are STOP_LOSS, STOP_LOSS_LIMIT, TAKE_PROFIT, and TAKE_PROFIT_LIMIT orders
 */
export interface ExchangeMaxNumALgoOrders {

    /**
     * The filter type
     */
    filterType: "EXCHANGE_MAX_ALGO_ORDERS";

    /**
     * The maximum number of "algo" orders an account is allowed to have open on the exchange
     */
    maxNumAlgoOrders: number;
}
