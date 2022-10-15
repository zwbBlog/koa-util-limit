export interface Config {
    id: () => string
    max: number
    duration: number
    driver?: string
    namespace?: string
    error?: string | object
    black?: () => boolean
    white?: () => boolean
    db?: any
}