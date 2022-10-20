type Driver = 'redis' | 'memory'
export interface IMemoryMap {
    time: number
    data: Array<number | Date>
}
export type IMap = Map<string, IMemoryMap>
export interface IError {
    code: number
    msg: string
    [key: string]: any
}
export type IRoster = (ctx: any) => boolean | undefined
export interface ILimit {
    //100 calls at most in 60 * 1000ms
    max: number
    duration: number
    //memory or redis
    driver?: Driver
    //namespace
    namespace?: string
    //error response
    error?: IError
    //blacklist
    black?: IRoster
    //whitelist
    white?: IRoster
    //If it is redis, it can be ignored
    db?: IMap | any
}
export interface Config extends ILimit {
    //id unique identification
    id: (ctx: any) => string
}