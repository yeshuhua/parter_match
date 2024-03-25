/**
 * 最小编辑算法，用来求出两个字符串或者数组之间最少经过几次转换可以变为对方
 * 参考：https://www.swvq.com/boutique/detail/tangieiie 使用了动态规划
 */
function minEditDistance(arr1, arr2 = []) {
    const m = arr1.length;
    const n = arr2?.length || 0;

    // 创建一个二维数组来存储编辑距离
    const dp = Array.from(Array(m + 1), () => Array(n + 1).fill(0));

    // 初始化第一列
    for (let i = 0; i <= m; i++) {
        dp[i][0] = i;
    }

    // 初始化第一行
    for (let j = 0; j <= n; j++) {
        dp[0][j] = j;
    }

    // 计算编辑距离
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (arr1[i - 1] === arr2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1]; // 字符相等，跳过
            } else {
                dp[i][j] = Math.min(
                    dp[i - 1][j] + 1, // 删除操作
                    dp[i][j - 1] + 1, // 插入操作
                    dp[i - 1][j - 1] + 1 // 替换操作
                );
            }
        }
    }

    return dp[m][n]; // 返回最小编辑距离
}


// const arr1 = ["hello", "world", "foo"];
const arr1 = ["hello", "foo"];
const arr2 = ["hello", "bar"];
const distance = minEditDistance(arr1, arr2);
// console.log(distance);
// 这里实现的是数组版本
module.exports = minEditDistance