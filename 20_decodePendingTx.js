import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

// 1. 创建provider和wallet，监听事件时候推荐用wss连接而不是http
console.log("\n1. 连接 wss RPC")
const provider = new ethers.WebSocketProvider(process.env.SEPOLIA_WSSURL);
let network = provider.getNetwork()
network.then(res => console.log(`[${(new Date).toLocaleTimeString()}]连接到chain-id:${res.chainId}`))

// 2. 创建interface对象，用于解码交易详情。
const contractABI = [
    "function transfer(address, uint) public returns (bool)",
]
const iface = new ethers.Interface(contractABI)

// 3. 获取函数选择器。
const selector = iface.getFunction("transfer").selector
console.log(`函数选择器是${selector}`)

// 4. 监听pending的erc20 transfer交易，获取交易详情，然后解码。
// 处理bigInt
function handleBigInt(key, value) {
    if (typeof value === "bigint") {
        return value.toString() + "n"; // or simply return value.toString();
    }
    return value;
}

let j = 0
provider.on('pending', async (txHash) => {
    if (txHash) {
        console.log(`Etherscan链接: https://sepolia.etherscan.io/tx/${txHash}`);
        try {
            const tx = await provider.getTransaction(txHash)
            j++
            if (tx !== null && tx.data.indexOf(selector) !== -1) {
                console.log(`[${(new Date).toLocaleTimeString()}]监听到第${j + 1}个pending交易:${txHash}`)
                console.log(`打印解码交易详情:${JSON.stringify(iface.parseTransaction(tx), handleBigInt, 2)}`)
                console.log(`转账目标地址:${iface.parseTransaction(tx).args[0]}`)
                console.log(`转账金额:${ethers.formatEther(iface.parseTransaction(tx).args[1])}`)
                provider.removeListener('pending', this)
            }
        } catch (err) {
            // 查不到详情时静默跳过
        }
    }
});