import {Request} from "./Request";
import {
    IResponse24HTickerPrice,
    IResponseAccountInformation,
    IResponseAveragePrice,
    IResponseEmpty,
    IResponseExchangeInfo,
    IResponseKLine,
    IResponseNewOCOOrderACK,
    IResponseNewOCOOrderFULL,
    IResponseNewOCOOrderRESULT,
    IResponseNewOrderACK,
    IResponseNewOrderFULL,
    IResponseNewOrderRESULT,
    IResponseOCOOrder,
    IResponseOrder,
    IResponseOrderBook,
    IResponseOrderCountUsage,
    IResponseOrderOrOCOOrder,
    IResponseServerTime,
    IResponseStartUserDataStream,
    IResponseSymbolOrderBookTicker,
    IResponseSymbolPriceTicker,
    IResponseTrade,
    IResponseTradeAggregated,
} from "../Types";
import {ResponseError} from "./Responses";
import {ResponseSuccess} from "./Responses";
import {OrderBookLimit, OrderResponseType, OrderSide, OrderType} from "../Types";
import {KLineInterval} from "../Types";
import {TimeInForce} from "../Types";

export class BinanceAPIClient {

    /**
     * The URL of the API
     * @private
     */
    public apiUrl: string;

    /**
     * The BinanceAPIClient constructor
     * @param binanceAPIKey The API key of the binance API
     * @param binanceSecretKey The API secret key of the binance API
     * @param testingMode If the environment is the testing one
     */
    constructor(public binanceAPIKey: string, public binanceSecretKey: string, public testingMode: boolean = true) {
        this.apiUrl = testingMode ? "https://testnet.binance.vision" : "https://api.binance.com";
    }

    // ===== GENERAL ENDPOINTS =====

    /**
     * Test connectivity to the Rest API
     * @weight 1
     * @return An error if there is one, otherwise the data of the request
     */
    public ping = async (): Promise<ResponseError | ResponseSuccess<IResponseEmpty>> => {

        // Make the request
        const response = await new Request("GET", "/api/v3/ping", false).call(this, {});

        // If the response is an error we return it
        if (response instanceof ResponseError) {
            return response;
        }

        // Else we return the data a ResponseSuccess object
        return new ResponseSuccess(response as IResponseEmpty);
    }

    /**
     * Test connectivity to the Rest API and get the current server time
     * @weight 1
     * @return An error if there is one, otherwise the data of the request
     */
    public getServerTime = async (): Promise<ResponseError | ResponseSuccess<IResponseServerTime>> => {

        // Make the request
        const response = await new Request("GET", "/api/v3/time", false).call(this, {});

        // If the response is an error we return it
        if (response instanceof ResponseError) {
            return response;
        }

        // Else we return the data a ResponseSuccess object
        return new ResponseSuccess(response as IResponseServerTime);
    }

    /**
     * Current exchange trading rules and symbol information
     * @param symbols A list of symbol to have informations on (can be empty)
     * @weight 10
     * @return An error if there is one, otherwise the data of the request
     */
    public getExchangeInfo = async (symbols?: string[]): Promise<ResponseError | ResponseSuccess<IResponseExchangeInfo>> => {

        // Make the request
        const response = await new Request("GET", "/api/v3/exchangeInfo", false).call(this, {symbols: symbols});

        // If the response is an error we return it
        if (response instanceof ResponseError) {
            return response;
        }

        // Else we return the data a ResponseSuccess object
        return new ResponseSuccess(response as IResponseExchangeInfo);
    }

    // ===== MARKET DATA ENDPOINTS =====

    /**
     * Get the order book of a symbol
     * @param symbol The symbol to get the order book of
     * @param limit The limit of orders to gather : Default 100; max 5000. Valid limits:[5, 10, 20, 50, 100, 500, 1000, 5000]
     * @weight Adjusted based on the limit: (5, 10, 20, 50, 100 => 1 | 500 => 5 | 1000 => 10 | 5000 => 50)
     * @return An error if there is one, otherwise the data of the request
     */
    public getOrderBook = async (symbol: string, limit: OrderBookLimit = 100): Promise<ResponseError | ResponseSuccess<IResponseOrderBook>> => {

        // Make the request
        const response = await new Request("GET", "/api/v3/depth", false).call(this, {symbol: symbol, limit: limit});

        // If the response is an error we return it
        if (response instanceof ResponseError) {
            return response;
        }

        // Else we return the data a ResponseSuccess object
        return new ResponseSuccess(response as IResponseOrderBook);
    }

    /**
     * Get the recent trades of the symbol
     * @param symbol The symbol to get the recent trades of
     * @param limit The limit of orders to gather : Default 500; max 1000
     * @weight 1
     * @return An error if there is one, otherwise the data of the request
     */
    public getRecentTrades = async (symbol: string, limit = 500): Promise<ResponseError | ResponseSuccess<IResponseTrade[]>> => {

        // Make the request
        const response = await new Request("GET", "/api/v3/trades", false).call(this, {symbol: symbol, limit: limit});

        // If the response is an error we return it
        if (response instanceof ResponseError) {
            return response;
        }

        // Else we return the data a ResponseSuccess object
        return new ResponseSuccess(response as IResponseTrade[]);
    }

    /**
     * Get the the older trades of the symbol
     * @param symbol The symbol to get the older trades of
     * @param limit The limit of orders to gather : Default 500; max 1000
     * @param fromId TradeId to fetch from. Default gets most recent trades
     * @weight 5
     * @return An error if there is one, otherwise the data of the request
     */
    public getHistoricalTrades = async (symbol: string, limit = 500, fromId?: number): Promise<ResponseError | ResponseSuccess<IResponseTrade[]>> => {

        // Make the request
        const response = await new Request("GET", "/api/v3/historicalTrades", false).call(this, {
            symbol: symbol,
            limit: limit,
            fromId: fromId
        });

        // If the response is an error we return it
        if (response instanceof ResponseError) {
            return response;
        }

        // Else we return the data a ResponseSuccess object
        return new ResponseSuccess(response as IResponseTrade[]);
    }

    /**
     * Get compressed, aggregate trades. Trades that fill at the time, from the same taker order, with the same price will have the quantity aggregated
     * @param symbol The symbol to get the older trades of
     * @param limit The limit of orders to gather : Default 500; max 1000
     * @param fromId ID to get aggregate trades from INCLUSIVE
     * @param startTime Timestamp in ms to get aggregate trades from INCLUSIVE
     * @param endTime Timestamp in ms to get aggregate trades until INCLUSIVE
     *
     * 1. If both startTime and endTime are sent, time between startTime and endTime must be less than 1 hour.
     * 2. If fromId, startTime, and endTime are not sent, the most recent aggregate trades will be returned.
     *
     * @weight 1
     * @return An error if there is one, otherwise the data of the request
     */
    public getAggregateTrades = async (symbol: string, limit = 500, fromId?: number, startTime?: number, endTime?: number): Promise<ResponseError | ResponseSuccess<IResponseTradeAggregated[]>> => {

        // Make the request
        const response = await new Request("GET", "/api/v3/aggTrades", false).call(this, {
            symbol: symbol,
            limit: limit,
            fromId: fromId,
            startTime: startTime,
            endTime: endTime
        });

        // If the response is an error we return it
        if (response instanceof ResponseError) {
            return response;
        }

        // Else we return the data a ResponseSuccess object
        return new ResponseSuccess(response as IResponseTradeAggregated[]);
    }

    /**
     * Get Kline/candlestick bars for a symbol. Klines are uniquely identified by their open time
     *
     *  If startTime and endTime are not sent, the most recent klines are returned.
     * @param symbol The symbol to get the older trades of
     * @param interval TradeId to fetch from. Default gets most recent trades
     * @param limit The limit of KLines to gather : Default 500; max 1000
     * @param startTime The start timestamp of the KLines
     * @param endTime The end timestamp of the KLines
     * @weight 1
     * @return An error if there is one, otherwise the data of the request
     */
    public getKLines = async (symbol: string, interval: KLineInterval, limit = 500, startTime?: number, endTime?: number): Promise<ResponseError | ResponseSuccess<IResponseKLine[]>> => {

        // Make the request
        const response = await new Request("GET", "/api/v3/klines", false).call(this, {
            symbol: symbol,
            interval: interval,
            limit: limit,
            startTime: startTime,
            endTime: endTime
        });

        // If the response is an error we return it
        if (response instanceof ResponseError) {
            return response;
        }

        // Else we return the data a ResponseSuccess object
        return new ResponseSuccess(response as IResponseKLine[]);
    }

    /**
     * Current average price for a symbol
     * @param symbol The symbol to get the average price
     * @weight 1
     * @return An error if there is one, otherwise the data of the request
     */
    public getAveragePrice = async (symbol: string): Promise<ResponseError | ResponseSuccess<IResponseAveragePrice>> => {

        // Make the request
        const response = await new Request("GET", "/api/v3/avgPrice", false).call(this, {symbol: symbol});

        // If the response is an error we return it
        if (response instanceof ResponseError) {
            return response;
        }

        // Else we return the data a ResponseSuccess object
        return new ResponseSuccess(response as IResponseAveragePrice);
    }

    /**
     * 24 hour rolling window price change statistics. Careful when accessing this with no symbol.
     * @param symbol The symbol to get the average price (if not given get ALL THE SYMBOLS' 24 hour rolling window price)
     *
     * If the symbol is not sent, tickers for all symbols will be returned in an array.
     *
     * @weight 1 for a single symbol; 40 when the symbol parameter is omitted
     * @return An error if there is one, otherwise the data of the request
     */
    public get24HourTickerPrice = async (symbol?: string): Promise<ResponseError | ResponseSuccess<IResponse24HTickerPrice | IResponse24HTickerPrice[]>> => {

        // Make the request
        const response = await new Request("GET", "/api/v3/ticker/24hr", false).call(this, {symbol: symbol});

        // If the response is an error we return it
        if (response instanceof ResponseError) {
            return response;
        }

        // If the symbol is undefined we return the result as an array
        if (symbol === undefined) {
            return new ResponseSuccess(response as IResponse24HTickerPrice[]);
        }

        // Else we return the data a ResponseSuccess object as a single object
        return new ResponseSuccess(response as IResponse24HTickerPrice);
    }

    /**
     * Latest price for a symbol or symbols
     * @param symbol The symbol to get the latest price of (can be omitted)
     *
     * If the symbol is not sent, prices for all symbols will be returned in an array
     *
     * @weight 1 for a single symbol; 2 when the symbol parameter is omitted
     * @return An error if there is one, otherwise the data of the request
     */
    public getTickerPrice = async (symbol?: string): Promise<ResponseError | ResponseSuccess<IResponseSymbolPriceTicker | IResponseSymbolPriceTicker[]>> => {

        // Make the request
        const response = await new Request("GET", "/api/v3/ticker/price", false).call(this, {symbol: symbol});

        // If the response is an error we return it
        if (response instanceof ResponseError) {
            return response;
        }

        // If the symbol is undefined we return the result as an array
        if (symbol === undefined) {
            return new ResponseSuccess(response as IResponseSymbolPriceTicker[]);
        }

        // Else we return the data a ResponseSuccess object as a single object
        return new ResponseSuccess(response as IResponseSymbolPriceTicker);
    }

    /**
     * Best price/quantity on the order book for a symbol or symbols
     * @param symbol The symbol to get the best price/quantity of (can be omitted)
     *
     * If the symbol is not sent, bookTickers for all symbols will be returned in an array
     *
     * @weight 1 for a single symbol; 2 when the symbol parameter is omitted
     * @return An error if there is one, otherwise the data of the request
     */
    public getTickerOrderBook = async (symbol?: string): Promise<ResponseError | ResponseSuccess<IResponseSymbolOrderBookTicker | IResponseSymbolOrderBookTicker[]>> => {

        // Make the request
        const response = await new Request("GET", "/api/v3/ticker/bookTicker", false).call(this, {symbol: symbol});

        // If the response is an error we return it
        if (response instanceof ResponseError) {
            return response;
        }

        // If the symbol is undefined we return the result as an array
        if (symbol === undefined) {
            return new ResponseSuccess(response as IResponseSymbolOrderBookTicker[]);
        }

        // Else we return the data a ResponseSuccess object as a single object
        return new ResponseSuccess(response as IResponseSymbolOrderBookTicker);
    }

    // ===== ACCOUNT ENDPOINTS =====

    /**
     * Create a new trade order
     * @param symbol The symbol to create the order of
     * @param side The side of the order
     * @param type The type of the order
     * @param timeInForce TODO
     * @param quantity The quantity of the order
     * @param quoteOrderQty The quote order quantity
     * @param price The price of the order
     * @param newClientOrderId A unique id among open orders. Automatically generated if not sent. Orders with the same newClientOrderID can be accepted only when the previous one is filled, otherwise the order will be rejected
     * @param stopPrice Used with STOP_LOSS, STOP_LOSS_LIMIT, TAKE_PROFIT, and TAKE_PROFIT_LIMIT orders
     * @param icebergQty Used with LIMIT, STOP_LOSS_LIMIT, and TAKE_PROFIT_LIMIT to create an iceberg order
     * @param newOrderRespType Set the response JSON. ACK, RESULT, or FULL; MARKET and LIMIT order types default to FULL, all other orders default to ACK
     * @param recvWindow The value cannot be greater than 60000
     * @param timestamp timestamp of when the request was created and sent
     * @weight 1
     * @return An error if there is one, otherwise the data of the request
     */
    public createOrder = async (symbol: string, side: OrderSide, type: OrderType, timeInForce?: TimeInForce, quantity?: number, quoteOrderQty?: number, price?: number, newClientOrderId?: string, stopPrice?: number, icebergQty?: number, newOrderRespType?: OrderResponseType, recvWindow?: number, timestamp?: number): Promise<ResponseError | ResponseSuccess<IResponseNewOrderACK | IResponseNewOrderRESULT | IResponseNewOrderFULL>> => {

        // Some additional mandatory parameters based on order type
        switch (type) {
            case "LIMIT":
                if (timeInForce === undefined || quantity === undefined || price === undefined) {
                    return new ResponseError("One of the following argument is undefined: 'timeInForce', 'quantity' or 'price'");
                }
                break;
            case "MARKET":

                /*
                MARKET orders using the quantity field specifies the amount of the base asset the user wants to buy or sell at the market price.
                E.g. MARKET order on BTCUSDT will specify how much BTC the user is buying or selling.
                 */

                /*
                MARKET orders using quoteOrderQty specifies the amount the user wants to spend (when buying) or receive (when selling) the quote asset; the correct quantity will be determined based on the market liquidity and quoteOrderQty.
                E.g. Using the symbol BTCUSDT:
                BUY side, the order will buy as many BTC as quoteOrderQty USDT can.
                SELL side, the order will sell as much BTC needed to receive quoteOrderQty USDT.
                 */

                if (!((quantity !== undefined && quoteOrderQty === undefined) || (quantity === undefined && quoteOrderQty !== undefined))) {
                    return new ResponseError("Either 'quantity' or 'quoteOrderQty' must be given");
                }
                break;
            case "STOP_LOSS":

                /*
                This will execute a MARKET order when the stopPrice is reached.
                 */

                if (quantity === undefined || stopPrice === undefined) {
                    return new ResponseError("One of the following argument is undefined: 'quantity' or 'stopPrice'");
                }
                break;
            case "STOP_LOSS_LIMIT":

                if (timeInForce === undefined || quantity === undefined || price === undefined || stopPrice === undefined) {
                    return new ResponseError("One of the following argument is undefined: 'timeInForce', 'quantity', 'price' or 'stopPrice'");
                }
                break;
            case "TAKE_PROFIT":

                /*
                This will execute a MARKET order when the stopPrice is reached.
                 */

                if (quantity === undefined || stopPrice === undefined) {
                    return new ResponseError("One of the following argument is undefined: 'quantity' or 'stopPrice'");
                }
                break;
            case "TAKE_PROFIT_LIMIT":

                if (timeInForce === undefined || quantity === undefined || price === undefined || stopPrice === undefined) {
                    return new ResponseError("One of the following argument is undefined: 'timeInForce', 'quantity', 'price' or 'stopPrice'");
                }
                break;
            case "LIMIT_MAKER":

                /*
                This is a LIMIT order that will be rejected if the order immediately matches and trades as a taker.
                This is also known as a POST-ONLY order.
                 */

                if (quantity === undefined || price === undefined) {
                    return new ResponseError("One of the following argument is undefined: 'quantity' or 'price'");
                }
                break;
        }

        // Make the request
        const response = await new Request("POST", "/api/v3/order", true).call(this, {
            symbol: symbol,
            side: side,
            type: type,
            timeInForce: timeInForce,
            quantity: quantity,
            quoteOrderQty: quoteOrderQty,
            price: price,
            newClientOrderId: newClientOrderId,
            stopPrice: stopPrice,
            icebergQty: icebergQty,
            newOrderRespType: newOrderRespType,
            recvWindow: recvWindow,
            timestamp: timestamp !== undefined ? timestamp : Date.now()
        });

        // If the response is an error we return it
        if (response instanceof ResponseError) {
            return response;
        }

        // Else we return the data a ResponseSuccess object

        // Now we want to return the correct response type

        // If the newOrderRespType is undefined we return the default values
        if (newOrderRespType === undefined) {

            if (type === "MARKET" || type === "LIMIT") {
                return new ResponseSuccess(response as IResponseNewOrderFULL);
            } else {
                return new ResponseSuccess(response as IResponseNewOrderACK);
            }

        }

        if (newOrderRespType === "ACK") {
            return new ResponseSuccess(response as IResponseNewOrderACK);
        }

        if (newOrderRespType === "RESULT") {
            return new ResponseSuccess(response as IResponseNewOrderRESULT);
        }

        if (newOrderRespType === "FULL") {
            return new ResponseSuccess(response as IResponseNewOrderFULL);
        }

        // Otherwise we return it as FULL (even if there might be an error if we reach here)
        return new ResponseSuccess(response as IResponseNewOrderFULL);
    }

    /**
     * Test new order creation and signature/recvWindow long. Creates and validates a new order but does not send it into the matching engine
     * @param symbol The symbol to create the order of
     * @param side The side of the order
     * @param type The type of the order
     * @param timeInForce TODO
     * @param quantity The quantity of the order
     * @param quoteOrderQty The quote order quantity
     * @param price The price of the order
     * @param newClientOrderId A unique id among open orders. Automatically generated if not sent. Orders with the same newClientOrderID can be accepted only when the previous one is filled, otherwise the order will be rejected
     * @param stopPrice Used with STOP_LOSS, STOP_LOSS_LIMIT, TAKE_PROFIT, and TAKE_PROFIT_LIMIT orders
     * @param icebergQty Used with LIMIT, STOP_LOSS_LIMIT, and TAKE_PROFIT_LIMIT to create an iceberg order
     * @param newOrderRespType Set the response JSON. ACK, RESULT, or FULL; MARKET and LIMIT order types default to FULL, all other orders default to ACK
     * @param recvWindow The value cannot be greater than 60000
     * @param timestamp timestamp of when the request was created and sent
     * @weight 1
     * @return An error if there is one, otherwise the data of the request
     */
    public testOrder = async (symbol: string, side: OrderSide, type: OrderType, timeInForce?: TimeInForce, quantity?: number, quoteOrderQty?: number, price?: number, newClientOrderId?: string, stopPrice?: number, icebergQty?: number, newOrderRespType?: OrderResponseType, recvWindow?: number, timestamp?: number): Promise<ResponseError | ResponseSuccess<IResponseEmpty>> => {

        // Some additional mandatory parameters based on order type
        switch (type) {
            case "LIMIT":
                if (timeInForce === undefined || quantity === undefined || price === undefined) {
                    return new ResponseError("One of the following argument is undefined: 'timeInForce', 'quantity' or 'price'");
                }
                break;
            case "MARKET":

                /*
                MARKET orders using the quantity field specifies the amount of the base asset the user wants to buy or sell at the market price.
                E.g. MARKET order on BTCUSDT will specify how much BTC the user is buying or selling.
                 */

                /*
                MARKET orders using quoteOrderQty specifies the amount the user wants to spend (when buying) or receive (when selling) the quote asset; the correct quantity will be determined based on the market liquidity and quoteOrderQty.
                E.g. Using the symbol BTCUSDT:
                BUY side, the order will buy as many BTC as quoteOrderQty USDT can.
                SELL side, the order will sell as much BTC needed to receive quoteOrderQty USDT.
                 */

                if (!((quantity !== undefined && quoteOrderQty === undefined) || (quantity === undefined && quoteOrderQty !== undefined))) {
                    return new ResponseError("Either 'quantity' or 'quoteOrderQty' must be given");
                }
                break;
            case "STOP_LOSS":

                /*
                This will execute a MARKET order when the stopPrice is reached.
                 */

                if (quantity === undefined || stopPrice === undefined) {
                    return new ResponseError("One of the following argument is undefined: 'quantity' or 'stopPrice'");
                }
                break;
            case "STOP_LOSS_LIMIT":

                if (timeInForce === undefined || quantity === undefined || price === undefined || stopPrice === undefined) {
                    return new ResponseError("One of the following argument is undefined: 'timeInForce', 'quantity', 'price' or 'stopPrice'");
                }
                break;
            case "TAKE_PROFIT":

                /*
                This will execute a MARKET order when the stopPrice is reached.
                 */

                if (quantity === undefined || stopPrice === undefined) {
                    return new ResponseError("One of the following argument is undefined: 'quantity' or 'stopPrice'");
                }
                break;
            case "TAKE_PROFIT_LIMIT":

                if (timeInForce === undefined || quantity === undefined || price === undefined || stopPrice === undefined) {
                    return new ResponseError("One of the following argument is undefined: 'timeInForce', 'quantity', 'price' or 'stopPrice'");
                }
                break;
            case "LIMIT_MAKER":

                /*
                This is a LIMIT order that will be rejected if the order immediately matches and trades as a taker.
                This is also known as a POST-ONLY order.
                 */

                if (quantity === undefined || price === undefined) {
                    return new ResponseError("One of the following argument is undefined: 'quantity' or 'price'");
                }
                break;
        }

        // Make the request
        const response = await new Request("POST", "/api/v3/order/test", true).call(this, {
            symbol: symbol,
            side: side,
            type: type,
            timeInForce: timeInForce,
            quantity: quantity,
            quoteOrderQty: quoteOrderQty,
            price: price,
            newClientOrderId: newClientOrderId,
            stopPrice: stopPrice,
            icebergQty: icebergQty,
            newOrderRespType: newOrderRespType,
            recvWindow: recvWindow,
            timestamp: timestamp !== undefined ? timestamp : Date.now()
        });

        // If the response is an error we return it
        if (response instanceof ResponseError) {
            return response;
        }

        // Else we return the data a ResponseSuccess object
        return new ResponseSuccess(response as IResponseEmpty);
    }

    /**
     * Check an order's status.
     *
     * Either orderId or origClientOrderId must be sent.
     *
     * For some historical orders cummulativeQuoteQty will be < 0, meaning the data is not available at this time.
     * @param symbol The symbol to get the order of
     * @param orderId The id of the order
     * @param origClientOrderId     The id of the order
     * @param recvWindow The value cannot be greater than 60000
     * @param timestamp timestamp of when the request was created and sent
     * @weight 2
     * @return An error if there is one, otherwise the data of the request
     */
    public getOrder = async (symbol: string, orderId?: number, origClientOrderId?: string, recvWindow?: number, timestamp?: number): Promise<ResponseError | ResponseSuccess<IResponseOrder>> => {

        // Either orderId or origClientOrderId must be sent
        if (!((orderId !== undefined && origClientOrderId === undefined) || (orderId === undefined && origClientOrderId !== undefined))) {
            return new ResponseError("Either 'orderId' or 'origClientOrderId' must be given");
        }

        // Make the request
        const response = await new Request("GET", "/api/v3/order", true).call(this, {
            symbol: symbol,
            orderId: orderId,
            origClientOrderId: origClientOrderId,
            recvWindow: recvWindow,
            timestamp: timestamp !== undefined ? timestamp : Date.now()
        });

        // If the response is an error we return it
        if (response instanceof ResponseError) {
            return response;
        }

        // Else we return the data a ResponseSuccess object
        return new ResponseSuccess(response as IResponseOrder);
    }

    /**
     * Cancel an active order
     * @param symbol The symbol to get the order of
     * @param orderId The id of the order
     * @param origClientOrderId     The id of the order
     * @param newClientOrderId Used to uniquely identify this cancel. Automatically generated by default
     * @param recvWindow The value cannot be greater than 60000
     * @param timestamp timestamp of when the request was created and sent
     * @weight 1
     * @return An error if there is one, otherwise the data of the request
     */
    public cancelOrder = async (symbol: string, orderId?: number, origClientOrderId?: string, newClientOrderId?: string, recvWindow?: number, timestamp?: number): Promise<ResponseError | ResponseSuccess<IResponseOrder>> => {

        // Either orderId or origClientOrderId must be sent
        if (!((orderId !== undefined && origClientOrderId === undefined) || (orderId === undefined && origClientOrderId !== undefined))) {
            return new ResponseError("Either 'orderId' or 'origClientOrderId' must be given");
        }

        // Make the request
        const response = await new Request("DELETE", "/api/v3/order", true).call(this, {
            symbol: symbol,
            orderId: orderId,
            origClientOrderId: origClientOrderId,
            newClientOrderId: newClientOrderId,
            recvWindow: recvWindow,
            timestamp: timestamp !== undefined ? timestamp : Date.now()
        });

        // If the response is an error we return it
        if (response instanceof ResponseError) {
            return response;
        }

        // Else we return the data a ResponseSuccess object
        return new ResponseSuccess(response as IResponseOrder);
    }

    /**
     * Cancels all active orders on a symbol. This includes OCO orders
     * @param symbol The symbol to get the order of
     * @param recvWindow The value cannot be greater than 60000
     * @param timestamp timestamp of when the request was created and sent
     * @weight 1
     * @return An error if there is one, otherwise the data of the request
     */
    public cancelAllOrders = async (symbol: string, recvWindow?: number, timestamp?: number): Promise<ResponseError | ResponseSuccess<IResponseOrderOrOCOOrder[]>> => {

        // Make the request
        const response = await new Request("DELETE", "/api/v3/openOrders", true).call(this, {
            symbol: symbol,
            recvWindow: recvWindow,
            timestamp: timestamp !== undefined ? timestamp : Date.now()
        });

        // If the response is an error we return it
        if (response instanceof ResponseError) {
            return response;
        }

        // Else we return the data a ResponseSuccess object
        return new ResponseSuccess(response as IResponseOrderOrOCOOrder[]);
    }

    /**
     * Get all open orders on a symbol. Careful when accessing this with no symbol
     * @param symbol The symbol to get the order of (can be omitted)
     * @param recvWindow The value cannot be greater than 60000
     * @param timestamp timestamp of when the request was created and sent
     * @weight 3 for a single symbol; 40 when the symbol parameter is omitted
     * @return An error if there is one, otherwise the data of the request
     */
    public getOpenOrders = async (symbol?: string, recvWindow?: number, timestamp?: number): Promise<ResponseError | ResponseSuccess<IResponseOrder[]>> => {

        // Make the request
        const response = await new Request("GET", "/api/v3/openOrders", true).call(this, {
            symbol: symbol,
            recvWindow: recvWindow,
            timestamp: timestamp !== undefined ? timestamp : Date.now()
        });

        // If the response is an error we return it
        if (response instanceof ResponseError) {
            return response;
        }

        // Else we return the data a ResponseSuccess object
        return new ResponseSuccess(response as IResponseOrder[]);
    }

    /**
     * Get all account orders; active, canceled, or filled
     * @param symbol The symbol to get the orders of
     * @param limit The limit : Default 500; max 1000
     * @param orderId If orderId is set, it will get orders >= that orderId. Otherwise most recent orders are returned
     * @param startTime Used to get the orders in an interval of time
     * @param endTime Used to get the orders in an interval of time
     * @param recvWindow The value cannot be greater than 60000
     * @param timestamp timestamp of when the request was created and sent
     * @weight 10 with symbol
     * @return An error if there is one, otherwise the data of the request
     */
    public getAllOrders = async (symbol: string, limit = 500, orderId?: number, startTime?: number, endTime?: number, recvWindow?: number, timestamp?: number): Promise<ResponseError | ResponseSuccess<IResponseOrder[]>> => {

        // Make the request
        const response = await new Request("GET", "/api/v3/allOrders", true).call(this, {
            symbol: symbol,
            limit: limit,
            startTime: startTime,
            endTime: endTime,
            recvWindow: recvWindow,
            timestamp: timestamp !== undefined ? timestamp : Date.now()
        });

        // If the response is an error we return it
        if (response instanceof ResponseError) {
            return response;
        }

        // Else we return the data a ResponseSuccess object
        return new ResponseSuccess(response as IResponseOrder[]);
    }

    /**
     * Send in a new OCO
     *
     * Additional Info:
     * 1. Price Restrictions:
     * SELL: Limit Price > Last Price > Stop Price
     * BUY: Limit Price < Last Price < Stop Price
     * 2. Quantity Restrictions:
     * Both legs must have the same quantity.
     * ICEBERG quantities however do not have to be the same
     * 3. Order Rate Limit:
     * OCO counts as 2 orders against the order rate limit.
     *
     * @param symbol The symbol to create the order of
     * @param listClientOrderId    A unique Id for the entire orderList
     * @param side The side of the order
     * @param quantity The quantity of the order
     * @param limitClientOrderId A unique Id for the limit order
     * @param price The price of the order
     * @param limitIcebergQty Used to make the LIMIT_MAKER leg an iceberg order
     * @param stopClientOrderId A unique Id for the stop loss/stop loss limit leg
     * @param stopPrice The stop price
     * @param stopLimitPrice If provided, stopLimitTimeInForce is required
     * @param stopIcebergQty Used with STOP_LOSS_LIMIT leg to make an iceberg order
     * @param stopLimitTimeInForce Valid values are GTC/FOK/IOC
     * @param newOrderRespType Set the response JSON
     * @param recvWindow The value cannot be greater than 60000
     * @param timestamp timestamp of when the request was created and sent
     * @weight 1
     * @return An error if there is one, otherwise the data of the request
     */
    public newOCOOrder = async (symbol: string, side: OrderSide, quantity: number, price: number, listClientOrderId?: string, limitClientOrderId?: string, limitIcebergQty?: number, stopClientOrderId?: string, stopPrice?: number, stopLimitPrice?: number, stopIcebergQty?: number, stopLimitTimeInForce?: TimeInForce, newOrderRespType?: OrderResponseType, recvWindow?: number, timestamp?: number): Promise<ResponseError | ResponseSuccess<IResponseNewOCOOrderACK | IResponseNewOCOOrderRESULT | IResponseNewOCOOrderFULL>> => {

        // Make the request
        const response = await new Request("POST", "/api/v3/order/oco", true).call(this, {
            symbol: symbol,
            listClientOrderId: listClientOrderId,
            side: side,
            quantity: quantity,
            limitClientOrderId: limitClientOrderId,
            price: price,
            limitIcebergQty: limitIcebergQty,
            stopClientOrderId: stopClientOrderId,
            stopPrice: stopPrice,
            stopLimitPrice: stopLimitPrice,
            stopIcebergQty: stopIcebergQty,
            stopLimitTimeInForce: stopLimitTimeInForce,
            newOrderRespType: newOrderRespType,
            recvWindow: recvWindow,
            timestamp: timestamp !== undefined ? timestamp : Date.now()
        });

        // If the response is an error we return it
        if (response instanceof ResponseError) {
            return response;
        }

        // Else we return the data a ResponseSuccess object

        if (newOrderRespType === "ACK") {
            return new ResponseSuccess(response as IResponseNewOCOOrderACK);
        }

        if (newOrderRespType === "RESULT") {
            return new ResponseSuccess(response as IResponseNewOCOOrderRESULT);
        }

        // By default return the FULL reponse
        return new ResponseSuccess(response as IResponseNewOCOOrderFULL);
    }

    /**
     * Cancel an entire Order List
     * @param symbol The symbol to get the order of
     * @param orderListId The id of the order
     * @param listClientOrderId The id of the order
     * @param newClientOrderId Used to uniquely identify this cancel. Automatically generated by default
     * @param recvWindow The value cannot be greater than 60000
     * @param timestamp timestamp of when the request was created and sent
     * @weight 1
     * @return An error if there is one, otherwise the data of the request
     */
    public cancelOCOOrder = async (symbol: string, orderListId?: number, listClientOrderId?: string, newClientOrderId?: string, recvWindow?: number, timestamp?: number): Promise<ResponseError | ResponseSuccess<IResponseOCOOrder>> => {

        // Either orderListId or listClientOrderId must be sent
        if (!((orderListId !== undefined && listClientOrderId === undefined) || (orderListId === undefined && listClientOrderId !== undefined))) {
            return new ResponseError("Either 'orderListId' or 'listClientOrderId' must be given");
        }

        // Make the request
        const response = await new Request("DELETE", "/api/v3/orderList", true).call(this, {
            symbol: symbol,
            orderListId: orderListId,
            listClientOrderId: listClientOrderId,
            newClientOrderId: newClientOrderId,
            recvWindow: recvWindow,
            timestamp: timestamp !== undefined ? timestamp : Date.now()
        });

        // If the response is an error we return it
        if (response instanceof ResponseError) {
            return response;
        }

        // Else we return the data a ResponseSuccess object
        return new ResponseSuccess(response as IResponseOCOOrder);
    }

    /**
     * Retrieves a specific OCO based on provided optional parameters
     * @param orderListId The id of the order
     * @param listClientOrderId The id of the order
     * @param recvWindow The value cannot be greater than 60000
     * @param timestamp timestamp of when the request was created and sent
     * @weight 2
     * @return An error if there is one, otherwise the data of the request
     */
    public queryOCOOrder = async (orderListId?: number, listClientOrderId?: string, recvWindow?: number, timestamp?: number): Promise<ResponseError | ResponseSuccess<IResponseOCOOrder>> => {

        // Either orderListId or listClientOrderId must be sent
        if (!((orderListId !== undefined && listClientOrderId === undefined) || (orderListId === undefined && listClientOrderId !== undefined))) {
            return new ResponseError("Either 'orderListId' or 'listClientOrderId' must be given");
        }

        // Make the request
        const response = await new Request("GET", "/api/v3/orderList", true).call(this, {
            orderListId: orderListId,
            listClientOrderId: listClientOrderId,
            recvWindow: recvWindow,
            timestamp: timestamp !== undefined ? timestamp : Date.now()
        });

        // If the response is an error we return it
        if (response instanceof ResponseError) {
            return response;
        }

        // Else we return the data a ResponseSuccess object
        return new ResponseSuccess(response as IResponseOCOOrder);
    }

    /**
     * Retrieves all OCO based on provided optional parameters
     * @param fromId The id to query the orders from. If supplied, neither startTime or endTime can be provided
     * @param startTime The start time of the orders
     * @param endTime The end time of the orders
     * @param limit Default Value: 500; Max Value: 1000
     * @param recvWindow The value cannot be greater than 60000
     * @param timestamp timestamp of when the request was created and sent
     * @weight 10
     * @return An error if there is one, otherwise the data of the request
     */
    public queryAllOCOOrders = async (fromId?: number, startTime?: number, endTime?: number, limit?: number, recvWindow?: number, timestamp?: number): Promise<ResponseError | ResponseSuccess<IResponseOCOOrder[]>> => {

        // Make the request
        const response = await new Request("GET", "/api/v3/allOrderList", true).call(this, {
            fromId: fromId,
            startTime: startTime,
            endTime: endTime,
            limit: limit,
            recvWindow: recvWindow,
            timestamp: timestamp !== undefined ? timestamp : Date.now()
        });

        // If the response is an error we return it
        if (response instanceof ResponseError) {
            return response;
        }

        // Else we return the data a ResponseSuccess object
        return new ResponseSuccess(response as IResponseOCOOrder[]);
    }

    /**
     * Retrieves all open OCO order
     * @param recvWindow The value cannot be greater than 60000
     * @param timestamp timestamp of when the request was created and sent
     * @weight 10
     * @return An error if there is one, otherwise the data of the request
     */
    public queryAllOpenOCOOrders = async (recvWindow?: number, timestamp?: number): Promise<ResponseError | ResponseSuccess<IResponseOCOOrder[]>> => {

        // Make the request
        const response = await new Request("GET", "/api/v3/openOrderList", true).call(this, {
            recvWindow: recvWindow,
            timestamp: timestamp !== undefined ? timestamp : Date.now()
        });

        // If the response is an error we return it
        if (response instanceof ResponseError) {
            return response;
        }

        // Else we return the data a ResponseSuccess object
        return new ResponseSuccess(response as IResponseOCOOrder[]);
    }

    /**
     * Get current account information
     * @param recvWindow The value cannot be greater than 60000
     * @param timestamp timestamp of when the request was created and sent
     * @weight 10
     * @return An error if there is one, otherwise the data of the request
     */
    public getAccountInformations = async (recvWindow?: number, timestamp?: number): Promise<ResponseError | ResponseSuccess<IResponseAccountInformation>> => {

        // Make the request
        const response = await new Request("GET", "/api/v3/account", true).call(this, {
            recvWindow: recvWindow,
            timestamp: timestamp !== undefined ? timestamp : Date.now()
        });

        // If the response is an error we return it
        if (response instanceof ResponseError) {
            return response;
        }

        // Else we return the data a ResponseSuccess object
        return new ResponseSuccess(response as IResponseAccountInformation);
    }

    /**
     * Displays the user's current order count usage for all intervals
     * @param recvWindow The value cannot be greater than 60000
     * @param timestamp timestamp of when the request was created and sent
     * @weight 20
     * @return An error if there is one, otherwise the data of the request
     */
    public getAccountTradeList = async (recvWindow?: number, timestamp?: number): Promise<ResponseError | ResponseSuccess<IResponseOrderCountUsage[]>> => {

        // Make the request
        const response = await new Request("GET", "/api/v3/rateLimit/order", true).call(this, {
            recvWindow: recvWindow,
            timestamp: timestamp !== undefined ? timestamp : Date.now()
        });

        // If the response is an error we return it
        if (response instanceof ResponseError) {
            return response;
        }

        // Else we return the data a ResponseSuccess object
        return new ResponseSuccess(response as IResponseOrderCountUsage[]);
    }

    /**
     * Displays the user's current order count usage for all intervalsStart a new user data stream. The stream will close after 60 minutes unless a keepalive is sent
     * @weight 1
     * @return An error if there is one, otherwise the data of the request
     */
    public startUserDataStream = async (): Promise<ResponseError | ResponseSuccess<IResponseStartUserDataStream>> => {

        // Make the request
        const response = await new Request("POST", "/api/v3/userDataStream", false).call(this, {});

        // If the response is an error we return it
        if (response instanceof ResponseError) {
            return response;
        }

        // Else we return the data a ResponseSuccess object
        return new ResponseSuccess(response as IResponseStartUserDataStream);
    }

    /**
     * Keepalive a user data stream to prevent a time out. User data streams will close after 60 minutes. It's recommended to send a ping about every 30 minutes
     * @param listenKey The listen key given by the function "startUserDataStream"
     * @weight 1
     * @return An error if there is one, otherwise the data of the request
     */
    public keepaliveUserDataStream = async (listenKey: string): Promise<ResponseError | ResponseSuccess<IResponseEmpty>> => {

        // Make the request
        const response = await new Request("PUT", "/api/v3/userDataStream", false).call(this, {listenKey: listenKey});

        // If the response is an error we return it
        if (response instanceof ResponseError) {
            return response;
        }

        // Else we return the data a ResponseSuccess object
        return new ResponseSuccess(response as IResponseEmpty);
    }

    /**
     * Close out a user data stream
     * @param listenKey The listen key given by the function "startUserDataStream"
     * @weight 1
     * @return An error if there is one, otherwise the data of the request
     */
    public closeUserDataStream = async (listenKey: string): Promise<ResponseError | ResponseSuccess<IResponseEmpty>> => {

        // Make the request
        const response = await new Request("DELETE", "/api/v3/userDataStream", false).call(this, {listenKey: listenKey});

        // If the response is an error we return it
        if (response instanceof ResponseError) {
            return response;
        }

        // Else we return the data a ResponseSuccess object
        return new ResponseSuccess(response as IResponseEmpty);
    }
}
