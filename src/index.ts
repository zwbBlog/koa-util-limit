import redis from './modules/redis';
import memory from './modules/memory';
import { Statement } from '../index';
export default ({
    id, db, max = 100, duration = 60000, namespace = 'limit',
    black, white, driver = 'redis',
    error = {
        'code': 429,
        'msg': 'too many requests'
    }
}: Statement.Config) => {
    const config = {
        id, db, max, duration, namespace, error, black, white
    };
    if (driver === 'redis') {
        return redis(config);
    }
    if (driver === 'memory') {
        return memory(config);
    }
};
