import { ethers } from "ethers";

// 1. BigNumber
console.group('1. BigNumber类');

const oneGwei = ethers.getBigInt("1000000000"); // 从十进制字符串生成
console.log(oneGwei) // 1000000000n

// 从hex字符串生成:
console.log(ethers.getBigInt("0x3b9aca00")) // 1000000000n
console.log(ethers.getBigInt(1000000000)) // 1000000000n

// 不能从js最大的安全整数之外的数字生成BigNumber，下面代码会报错
// ethers.getBigInt(Number.MAX_SAFE_INTEGER);
console.log("js中最大安全整数：", Number.MAX_SAFE_INTEGER)

// 运算
console.log("加法：", oneGwei + 1n) // 加法： 1000000001n
console.log("减法：", oneGwei - 1n) // 减法： 999999999n
console.log("乘法：", oneGwei * 2n) // 乘法： 2000000000n
console.log("除法：", oneGwei / 2n) // 除法： 500000000n
// 比较
console.log("是否相等：", oneGwei == 1000000000n) // true


// 2. 格式化：小单位转大单位
// 例如将wei转换为ether：formatUnits(变量, 单位)：单位填位数（数字）或指定的单位（字符串）
console.group('2. 格式化：小单位转大单位，formatUnits');
console.log(ethers.formatUnits(oneGwei, 0));
// '1000000000'
console.log(ethers.formatUnits(oneGwei, "gwei"));
// '1.0'
console.log(ethers.formatUnits(oneGwei, 9));
// '1.0'
console.log(ethers.formatUnits(oneGwei, "ether"));
// `0.000000001`
console.log(ethers.formatUnits(1000000000, "gwei"));
// '1.0'
console.log(ethers.formatEther(oneGwei));
// `0.000000001` 等同于formatUnits(value, "ether")
console.groupEnd();


// 3. 解析：大单位转小单位
// 例如将ether转换为wei：parseUnits(变量, 单位),parseUnits默认单位是 ether
console.group('3. 解析：大单位转小单位，parseUnits');
console.log(ethers.parseUnits("1.0").toString());
// 1000000000000000000
console.log(ethers.parseUnits("1.0", "ether").toString());
// 1000000000000000000
console.log(ethers.parseUnits("0.898", 18).toString());
// 898000000000000000
console.log(ethers.parseUnits("31313.0", "gwei").toString());
// 31313000000000
console.log(ethers.parseUnits("86", 9).toString());
// 86000000000
console.log(ethers.parseEther("1.0").toString());
// 1000000000000000000 等同于parseUnits(value, "ether")