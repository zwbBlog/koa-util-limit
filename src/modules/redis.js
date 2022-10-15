class Limit {
    constructor({
        db, max, duration, namespace, error
    }) {
        this.db = db;
        this.max = max;
        this.duration = duration;
        this.namespace = namespace;
        this.error = error;
    }
    async set(id){
        const cardName = `${this.namespace}:${id}`;
        const now = Date.now();
        await this.db.zcard(this.namespace);
        await this.db.zadd(cardName,now,now);
        const ttl = await this.db.ttl(cardName);
        if(ttl<=-1){ await this.db.pexpire(cardName,this.duration); }
    }
    async get(id){
        const cardName = `${this.namespace}:${id}`;
        const cardData = await this.db.zrange(cardName,0,-1);
        if(cardData.length<this.max){
            return await this.set(id);
        }
        throw new Error(`${this.duration}内超过最大限制${this.max}`);
    }
}
module.exports = ({
    id, db, max, duration, namespace, error,white,black
}) =>{
    if(!id){ throw new Error('id function is required'); }
    if(!db){ throw new Error('db is required'); }
    const limit = new Limit({
        db,max,duration,namespace,error
    });
    return async (ctx,next) =>{
        const identification = id(ctx);
        let w,b;
        if(typeof white === 'function'){ w=white(ctx); }
        if(typeof black === 'function'){ b=black(ctx); }
        try{
            if(b){ throw new Error('blacklist'); }
            if(!b && w){ return await next(); }
            await limit.get(identification);
            return await next();
        }catch (e) {
            ctx.status = 429;
            ctx.body = error;
        }
    };
};
