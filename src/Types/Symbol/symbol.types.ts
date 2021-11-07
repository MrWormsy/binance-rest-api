import {OrderType} from "../Order";
import {SymbolFilter} from "../Filter";

export interface Symbol {

    symbol: string;

    status: SymbolStatus;

    /**
     * Refers to the asset that is the quantity of a symbol. For the symbol BTCUSDT, BTC would be the base asset
     */
    baseAsset: string;

    baseAssetPrecision: number;

    /**
     * Refers to the asset that is the price of a symbol. For the symbol BTCUSDT, USDT would be the quote asset
     */
    quoteAsset: string;

    quotePrecision: number;

    quoteAssetPrecision: number;

    baseCommissionPrecision: number;

    quoteCommissionPrecision: number;

    orderTypes: OrderType[];

    icebergAllowed: boolean;

    ocoAllowed: boolean;

    quoteOrderQtyMarketAllowed: boolean;

    isSpotTradingAllowed: boolean;

    isMarginTradingAllowed: boolean;

    filters: SymbolFilter[];

    permissions: SymbolPermission[]
}

export type SymbolStatus =
    'PRE_TRADING'
    | 'TRADING'
    | 'POST_TRADING'
    | 'END_OF_DAY'
    | 'HALT'
    | 'AUCTION_MATCH'
    | 'BREAK';

export type SymbolType = 'SPOT';

export type SymbolPermission = 'SPOT' | 'MARGIN';
