module.exports = ({
    id, db, max = 100, duration = 60000, namespace = 'limit',
    black,white,driver='redis',
    error={
        'code': 429,
        'msg': 'too many requests'
    }
}) =>{
    return require(`./modules/${driver}`)({
        id, db, max, duration, namespace,error,black,white
    });
};
