class Limit {
    db: any;
    max: number;
    duration: number;
    namespace: string;
    error: string;
    white?: () => boolean | undefined;
    black?: () => boolean | undefined;
    constructor({
        db, max, duration, namespace, error
    }) {
        this.db = db;
        this.max = max;
        this.duration = duration;
        this.namespace = namespace;
        this.error = error;
    }
    async set(id): Promise<void> {
        const cardName = `${this.namespace}:${id}`;
        const now = Date.now();
        await this.db.zcard(this.namespace);
        await this.db.zadd(cardName, now, now);
        const ttl = await this.db.ttl(cardName);
        if (ttl <= -1) { await this.db.pexpire(cardName, this.duration); }
    }
    async get(id): Promise<void> {
        const cardName = `${this.namespace}:${id}`;
        const cardData = await this.db.zrange(cardName, 0, -1);
        if (cardData.length < this.max) {
            return await this.set(id);
        }
        throw new Error(`${this.duration}内超过最大限制${this.max}`);
    }
}
export default ({
    id, db, max, duration, namespace, error, white, black
}) => {
    if (!id) { throw new Error('id function is required'); }
    if (!db) { throw new Error('db is required'); }
    const limit = new Limit({
        db, max, duration, namespace, error
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
