/*
 * @@Description: 新金科算法题
 * @Author: i.mengxh@gmail.com
 * @Date: 2020-08-29 11:40:47
 * @LastEditTime: 2020-08-29 18:03:53
 * @LastEditors: i.mengxh@gmail.com
 */

// 1、你手上有2个玻璃珠，有一栋楼有10层，你有2次机会可以随机选择楼层抛下玻璃珠（玻璃珠为一次性，
// 不论是否摔碎，都只能抛一次），可以下楼观察玻璃珠的落地情况。你怎么判断，从哪个楼层抛下来，玻璃珠刚好不碎？

/*
* 分析问题：利用动态规划（Dynamic Programming）的思想，假设我们选择在第 i 层楼扔了玻璃珠之后，可能出现两种情况：玻璃珠碎了，玻璃珠没碎：
玻璃珠碎了: 那么玻璃珠的个数 K 应该减一，搜索的楼层区间应该从 [1..N] 变为 [1..i-1] 共 i-1 层楼；
玻璃珠没碎: 那么玻璃珠的个数 K 不变，搜索的楼层区间应该从 [1..N] 变为 [i+1..N] 共 N-i 层楼。此时状态转移方程为：

dp(k,n) = Math.min(res, Math.max(dp(K-1, i - 1), dp(K, N - i))
有了状态转移方程开始计算楼层数、参考代码如下
*/

/**
 * @param {number} K 玻璃珠个数
 * @param {number} N 楼层数
 * @return {number}
 */

const superGqDrop = function (K, N) {
    let memo = Array.from({ length: K + 1 }, () => new Array(N + 1).fill(0)); // 构造二维数组
    const dp = (K, N) => {
        // 避免重复计算
        if (memo[K][N]) return memo[K][N];
        if (K === 1) return N;
        if (N === 0) return 0;
        let res = Infinity;
        // 1、普通递归(会超时)因为有计算N+1次
        // for(let i = 1; i < N+1;i++) {
        //     res = Math.min(res,Math.max(dp(K,N-i),dp(K-1,i-1))+1)
        // }

        // 2、二分搜索 + 递归
        let left = 1;
        let right = N;
        while (left <= right) {
            let mid = Math.floor((left + right) / 2);
            let broken = dp(K - 1, mid - 1); // 摔碎
            let notBroken = dp(K, N - mid); // 未摔碎
            if (broken > notBroken) {
                right = mid - 1;
                res = Math.min(res, broken + 1);
            } else {
                left = mid + 1;
                res = Math.min(res, notBroken + 1);
            }
        }
        memo[K][N] = res;
        return res;
    };
    return dp(K, N);
};

console.log(superGqDrop(2, 10)); // 4


/**
 * 有两个班级AB班的班主任，准备各自挑选一名学生来进行语数混考的比赛，
 * 语数题目比例不确定。A班主任让学生分别进行了语数的测试，最后把语数成绩相加，
 * 总分第一名的作为比赛选手。B班主任也让学生进行语数分别考试，把语数成绩相乘，
 * 最后总分第一名的作为比赛选手。最后你预估AB班谁会胜出
 */

/**
 * 假设:
1.比赛比较的条件是语数混考分数，总分100分，总分更高的获胜。
2.AB两个班级学生的水平相等，测试成绩分布两班无太大差异。
3.预估哪个班胜出，比较的是谁的概率更大，而不是确定性的结果。
4.测试成绩能代表学生水平，且可以等比例换算到比赛的表现。
5.测试语文满分100分，测试数学满分100分。

注解:
1.水平相等是为了保证不出现A班学生语文数学测试成绩最高都是10分，B班最高都是100分的情况，对调也亦然。为的是排除极端情况。
A可能出现占优势的极端情况，同样B也可能出现，所以讨论没有意义，所以假设水平相等。
2.测试成绩分布无差异，是为了保证同样的语数测试学生获得150分，A班存在100分数学50分语文的情况，同等的B班也会有偏科情况。
如果一个班级偏科严重，另一个语数成绩均匀同样也没有讨论的意义。所以假设分布无差异。

下面我们来分析比赛题目的比例，题目比例不确定，可以等同于语文数学分数占比不确定。
无非以下三种情况:
1.语文数学占比相等。
2.语文比数学占比高。
3.数学比语文占比高。

情况1.语文数学各50%。这样的情况下，不论a和b班学生偏不偏科，哪个学生测试总分高，哪个比赛总分就高。
举例，如果A班学生测试成绩是20分数学100语文，B班是60数学60语文。按照比例计算。
A班学生比赛成绩是50*0.2+50*1=60。B班是50*0.6+50*0.6=60。所以谁测试成绩高谁获胜。

情况2和3，题目比例不相等。比如数学比语文分数占比多，比如数学满分60，语文满分40，总分设置100分。这种情况下，谁分数大的那门课成绩更好，谁更能获胜。AB班都有可能，机会均等。

分析了这么多情况，我们发现A和B都有可能比对方强，机会也都均等。
那是否有一种情况让两班不一样，我们来看一下。
举个例子，A班第一名测试总分140，语文40，数学100。第二名总分130，语文65，数学65。
B班也一样。
此时按照A班的规则是派第一名参赛。
B班按照规则，65的平方大于40*100，派水平低的第二名去参赛。
如此条件下，因为测试水平代表比赛水平，且成绩可以等比例换算。
所以A的比赛成绩＞B。

结论
因为乘积的标准会出现选择出总分为第二名的情况，而加和不会。
其他任何情况A和B都有可能发生，超过对方。
所以A班选人规则获胜几率比较大。
 */