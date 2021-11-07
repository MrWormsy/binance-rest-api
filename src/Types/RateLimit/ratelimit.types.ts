export type RateLimitType = 'REQUEST_WEIGHT' | 'ORDERS' | 'RAW_REQUESTS';

export type RateLimitInterval = 'SECOND' | 'MINUTE' | 'DAY';

export interface RateLimit {

    rateLimitType: RateLimitType;
    interval: RateLimitInterval;
    intervalNum: number;
    limit: number;

}
