import { Statement } from '../../';
class Limit {
    db: any;
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
    async set(id: string): Promise<void> {
        const cardName = `${this.namespace}:${id}`;
        const now = Date.now();
        await this.db.zcard(this.namespace);
        await this.db.zadd(cardName, now, now);
        const ttl = await this.db.ttl(cardName);
        if (ttl <= -1) { await this.db.pexpire(cardName, this.duration); }
    }
    async get(id: string): Promise<void> {
        const cardName = `${this.namespace}:${id}`;
        const cardData = await this.db.zrange(cardName, 0, -1);
        if (cardData.length < this.max) {
            return await this.set(id);
        }
        throw new Error(`${this.duration}ms内超过最大限制${this.max}次`);
    }
}
export default ({
    id, db, max, duration, namespace, error, white, black
}: Statement.Config) => {
    if (!id) { throw new Error('id function is required'); }
    if (!db) { throw new Error('db is required'); }
    const limit = new Limit({
        db, max, duration, namespace, error
    });
    return async (ctx: any, next: () => void) => {
        const identification = id(ctx);
        const w = Boolean(await white(ctx)), b = Boolean(await black(ctx));
        let { code, msg } = error;
        try {
            if (b) {
                code = 403; msg = 'forbidden';
                throw new Error('blacklist');
            }
            if (!b && w) { return await next(); }
            await limit.get(identification);
            return await next();
        } catch (e) {
            ctx.status = code;
            ctx.body = { code, msg, 'e': JSON.stringify(e) };
        }
    };
};
