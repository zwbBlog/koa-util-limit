type Driver = 'redis' | 'memory'
export interface Config {
    //id unique identification
    id: () => string
    //100 calls at most in 60 * 1000ms
    max: number
    duration: number
    //memory or redis
    driver?: Driver
    //namespace
    namespace?: string
    //error response
    error?: string | { [key: string]: any }
    //blacklist
    black?: () => boolean
    //whitelist
    white?: () => boolean
    //If it is redis, it can be ignored
    db?: any
}