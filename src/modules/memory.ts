import { Statement } from '../../index';
class Limit {
    db: Statement.IMap;
    max: number;
    duration: number;
    namespace: string;
    error: Statement.IError;
    constructor({ db, max, duration, namespace, error }: Statement.ILimit) {
        this.db = db;
        this.max = max;
        this.duration = duration;
        this.namespace = namespace;
        this.error = error;
    }
    set(id: string, type?: string): void {
        const cardName = `${this.namespace}:${id}`;
        const now = Date.now();
        const defaultMap: Statement.IMemoryMap = { 'time': now, 'data': [] };
        let cardJson = this.db.get(cardName);
        cardJson = type === 'reset' || !cardJson ? defaultMap : cardJson;
        cardJson.data.push(now);
        this.db.set(cardName, cardJson);
    }
    get(id: string): void {
        const cardName = `${this.namespace}:${id}`;
        const now = Date.now();
        const cardJson: Statement.IMemoryMap = this.db.get(cardName) || { 'time': now, 'data': [] };
        const { time, data } = cardJson;
        if (now - time <= this.duration && data.length < this.max) {
            return this.set(id);
        }
        if (now - time > this.duration) {
            return this.set(id, 'reset');
        }
        throw new Error(`${this.duration}内超过最大限制${this.max}`);
    }
}
export default ({
    id, max, duration, namespace, error, white, black
}: Statement.Config) => {
    if (!id) { throw new Error('id function is required'); }
    const limit = new Limit({
        'db': new Map(), max, duration, namespace, error
    });
    return async (ctx: any, next: () => void) => {
        const identification = id(ctx);
        const w = Boolean(await white(ctx)), b = Boolean(await black(ctx));
        let errorBody = error;
        let errorCode = error.code;
        try {
            if (b) {
                errorCode = 403;
                errorBody = { 'code': 403, 'msg': 'forbidden' };
                throw new Error('blacklist');
            }
            if (!b && w) { return await next(); }
            await limit.get(identification);
            return await next();
        } catch (e) {
            ctx.status = errorCode;
            ctx.body = errorBody;
        }
    };
};
