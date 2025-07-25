import { parseUnits, formatUnits, formatEther, parseEther } from "viem";

// 1. BigNumber (在 viem 中直接使用 BigInt)
console.group('1. BigNumber类');

const oneGwei = BigInt("1000000000"); // 从十进制字符串生成
console.log(oneGwei) // 1000000000n

// 从hex字符串生成:
console.log(BigInt("0x3b9aca00")) // 1000000000n
console.log(BigInt(1000000000)) // 1000000000n

// 不能从js最大的安全整数之外的数字生成BigNumber，下面代码会报错
// BigInt(Number.MAX_SAFE_INTEGER);
console.log("js中最大安全整数：", Number.MAX_SAFE_INTEGER)

// 运算
console.log("加法：", oneGwei + 1n) // 加法： 1000000001n
console.log("减法：", oneGwei - 1n) // 减法： 999999999n
console.log("乘法：", oneGwei * 2n) // 乘法： 2000000000n
console.log("除法：", oneGwei / 2n) // 除法： 500000000n
// 比较
console.log("是否相等：", oneGwei == 1000000000n) // true
console.groupEnd();

// 2. 格式化：小单位转大单位
// 例如将wei转换为ether：formatUnits(变量, 单位)：单位填位数（数字）或指定的单位（字符串）
console.group('2. 格式化：小单位转大单位，formatUnits');
console.log(formatUnits(oneGwei, 0));
// '1000000000'
console.log(formatUnits(oneGwei, "gwei"));
// '1.0'
console.log(formatUnits(oneGwei, 9));
// '1.0'
console.log(formatUnits(oneGwei, "ether"));
// `0.000000001`
console.log(formatUnits(1000000000, "gwei"));
// '1.0'
console.log(formatEther(oneGwei));
// `0.000000001` 等同于formatUnits(value, "ether")
console.groupEnd();

// 3. 解析：大单位转小单位
// 例如将ether转换为wei：parseUnits(变量, 单位),parseUnits默认单位是 ether
console.group('3. 解析：大单位转小单位，parseUnits');
console.log(parseUnits("1.0").toString());
// 1000000000000000000
console.log(parseUnits("1.0", "ether").toString());
// 1000000000000000000
console.log(parseUnits("0.898", 18).toString());
// 898000000000000000
console.log(parseUnits("31313.0", "gwei").toString());
// 31313000000000
console.log(parseUnits("86", 9).toString());
// 86000000000
console.log(parseEther("1.0").toString());
// 1000000000000000000 等同于parseUnits(value, "ether")
console.groupEnd();

// 4. viem 特有的功能
console.group('4. viem 特有的 BigNumber 功能');

// 从 hex 字符串解析
console.log("从 hex 解析：", BigInt("0x3b9aca00")); // 1000000000n

// 使用 parseUnits 处理不同单位
console.log("1 ETH =", parseUnits("1", "ether").toString(), "wei");
console.log("1 Gwei =", parseUnits("1", "gwei").toString(), "wei");
console.log("1 Wei =", parseUnits("1", "wei").toString(), "wei");

// 使用 formatUnits 格式化不同单位
const oneEth = parseUnits("1", "ether");
console.log("1 ETH 格式化：");
console.log("  - 以 ETH 为单位:", formatUnits(oneEth, "ether"));
console.log("  - 以 Gwei 为单位:", formatUnits(oneEth, "gwei"));
console.log("  - 以 Wei 为单位:", formatUnits(oneEth, "wei"));

// 处理大数字
const largeNumber = parseUnits("1000000", "ether"); // 100万 ETH
console.log("大数字处理：", formatUnits(largeNumber, "ether"), "ETH");

// 处理小数
const smallNumber = parseUnits("0.000001", "ether"); // 0.000001 ETH
console.log("小数处理：", formatUnits(smallNumber, "ether"), "ETH");

console.groupEnd();

// 5. 实际应用示例
console.group('5. 实际应用示例');

// 模拟 USDT 转账（6位小数）
const usdtAmount = parseUnits("1000", 6); // 1000 USDT
console.log("USDT 转账示例：");
console.log("  - 原始金额:", formatUnits(usdtAmount, 6), "USDT");
console.log("  - 以 wei 表示:", usdtAmount.toString());

// 模拟 ETH 转账
const ethAmount = parseUnits("0.5", "ether"); // 0.5 ETH
console.log("ETH 转账示例：");
console.log("  - 原始金额:", formatUnits(ethAmount, "ether"), "ETH");
console.log("  - 以 wei 表示:", ethAmount.toString());

// 计算 gas 费用
const gasPrice = parseUnits("20", "gwei"); // 20 Gwei
const gasLimit = 21000n;
const gasFee = gasPrice * gasLimit;
console.log("Gas 费用计算：");
console.log("  - Gas 价格:", formatUnits(gasPrice, "gwei"), "Gwei");
console.log("  - Gas 限制:", gasLimit.toString());
console.log("  - 总费用:", formatUnits(gasFee, "ether"), "ETH");

console.groupEnd(); 