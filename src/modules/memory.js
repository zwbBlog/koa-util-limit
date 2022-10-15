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
    set(id,type){
        const cardName = `${this.namespace}:${id}`;
        const now = Date.now();
        const defaultMap = {'time':now,'data':[]};
        let cardJson = this.db.get(cardName);
        cardJson = type==='reset' || !cardJson ? defaultMap : cardJson;
        cardJson.data.push(now);
        this.db.set(cardName,cardJson);
    }
    get(id){
        const cardName = `${this.namespace}:${id}`;
        const cardJson = this.db.get(cardName) || {};
        const now = Date.now();
        const {time=now,data=[]} = cardJson;
        if(now-time<=this.duration && data.length<this.max){
            return this.set(id);
        }
        if(now-time>this.duration){
            return this.set(id,'reset');
        }
        throw new Error(`${this.duration}内超过最大限制${this.max}`);
    }
}
module.exports = ({
    id, max, duration, namespace, error,whitelist,blacklist,white,black
}) =>{
    if(!id){ throw new Error('id function is required'); }
    const limit = new Limit({
        'db':new Map(),max,duration,namespace,error,whitelist,blacklist
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
