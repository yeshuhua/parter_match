/**
 * 缓存预热的回调函数
 */
const Mappers = require('../services/cate/completion');
const redis = require('../models/redis')
const cacheUserIds = [9, 10, 11];
let lockKey = 'homePage_doPreHotJob_LOCK'

module.exports = async () => {
    // 是否有其它进程正在占用锁，避免分布式时每个服务都执行一次内容，浪费资源
    const isLocked = await redis.get(lockKey);
    console.log('isLocked:---', isLocked);
    if (isLocked) {
        // 说明有其它进程正在更新
        console.log('Another process is updating,skipping this run');
        return;
    }
    // 没有别的进程占用锁，尝试获取分布式锁
    // 注意一定要有过期时间，避免一直占用锁
    // 'NX'为仅当键不存在时设置
    const lockResult = await redis.set(lockKey, 'locked', 'NX', 'EX', 30);
    console.log('lockResult:---', lockResult);
    if (!lockResult) {
        // 获取失败
        console.log('Failed to obtain lock,skipping this run');
        return;
    }
    // 启动续期定时器（看门狗机制），当任务执行时间长于锁的时间，有可能锁过期时，任务未执行完，有别的用户
    // 开了一把新锁，而你的任务完成后却释放了它的锁。
    startRenewalTimer(lockKey, 'locked', 30)
    try {
        for (let i = 0; i < cacheUserIds.length; i++) {
            let cacheKey = `homePage:user:recommend:${cacheUserIds[i]}`;
            const result = await Mappers.User.userFindAll({
                limit: 35,
                offset: i * 35
            })
            // 写缓存
            try {
                console.log('writing --------');
                redis.set(cacheKey, JSON.stringify(result), 'EX', 86400);
            } catch (e) {
                console.log('redis set error');
            }

        }
    } catch (e) {
        console.error('Failed to update', e);
    } finally {
        // 无论成功还是失败都要释放锁，同时注意只能释放自己的锁
        await redis.del(lockKey);
    }
}

function startRenewalTimer(key, value, expirationTime) {
    console.log('开始续期定时器');
    let timer = setInterval(async () => {
        // 为锁续期
        const result = await redis.expire(key, expirationTime);
        console.log('result:----', result);
        if (result === 1) {
            console.log('锁已经续期');
        } else {
            console.log('续期失败，可能是已经释放锁');
            // 记得清除定时器
            clearInterval(timer);
        }
    }, expirationTime * 1000 * 0.8) // 设置续期定时器，在过期时间的80%时提前续期，以提防任务执行时间过长
} 