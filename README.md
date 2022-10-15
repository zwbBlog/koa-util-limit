# koa-rate-limit

## Install

```bash
$ npm install koa-rate-limit
```

## Usage

```js
const koaRateLimit = require('koa-rate-limit');
const Redis = require('ioredis')
const koa = require('koa');
const app = koa();
app.use(koaRateLimit({
    //memory or redis
    'driver': 'redis' 
    //If it is redis, it can be ignored
    'db': new Redis(), 
    //100 calls at most in 60 * 1000ms
    'duration': 60*1000,
    'max': 100,
    //id unique identification
    'id': ctx => ctx.ip,
    //whitelist
    'white': ctx => {
        //return boolean
    },
    //blacklist
    'black': ctx => {
        //return boolean
    },
    //namespace
    'namespace':'limit',
    //error response
    'error':{
        'code': 429,
        'msg': 'too many requests'
    }
}));
```
