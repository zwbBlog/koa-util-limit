class Limit {
    db: Map<string, { [key: string]: any }>;
    max: number;
    duration: number;
    namespace: string;
    error: string;
    white?: () => any;
    black?: () => any;
    constructor({
        db, max, duration, namespace, error
    }) {
        this.db = db;
        this.max = max;
        this.duration = duration;
        this.namespace = namespace;
        this.error = error;
    }
    set(id: string, type?: string): void {
        const cardName = `${this.namespace}:${id}`;
        const now = Date.now();
        const defaultMap = { 'time': now, 'data': [] };
        let cardJson = this.db.get(cardName);
        cardJson = type === 'reset' || !cardJson ? defaultMap : cardJson;
        cardJson.data.push(now);
        this.db.set(cardName, cardJson);
    }
    get(id): void {
        const cardName = `${this.namespace}:${id}`;
        const cardJson = this.db.get(cardName) || {};
        const now = Date.now();
        const { time = now, data = [] } = cardJson;
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
}) => {
    if (!id) { throw new Error('id function is required'); }
    const limit = new Limit({
        'db': new Map(), max, duration, namespace, error
    });
    return async (ctx, next) => {
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
