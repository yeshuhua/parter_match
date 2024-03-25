const { parentPort, workerData } = require('worker_threads');
const Mappers = require('../../services/cate/completion');
const minDistance = require('../algorithms/minDistance');

(async () => {
    try {
        const userId = workerData?.userId;
        console.log(userId);
        const tags = workerData?.tags;
        console.log(tags);
        const start = workerData?.start;
        // 是预先将所有用户先查出来取缓存，还是现查？
        const userList = await Mappers.User.userFindAll({
            // 优化1：只查询需要的字段
            attributes: ['id', 'tags']
        })
        // console.log(JSON.stringify(userList));
        for (let i = 0; i < userList?.length; i++) {
            // 优化2：标签为空的用户直接跳过，同时剔除自身
            if (!userList[i].tags || userList[i].id == userId) continue;
            let distance = minDistance(tags, userList[i].tags);
        }
        const end = performance.now();
        console.log(end - start);
        parentPort.postMessage({ userList });
    } catch (e) {
        parentPort.postMessage({ error: e.message });
    }
})()