// viem 版本的 mempool 监听
import { createPublicClient, webSocket } from "viem";
import { sepolia } from "viem/chains";
import dotenv from "dotenv";
dotenv.config();

// 1. 创建 WebSocket 客户端
console.log("\n1. 连接 wss RPC");
const publicClient = createPublicClient({
    chain: sepolia,
    transport: webSocket(process.env.SEPOLIA_WSSURL)
});

// 获取网络信息
const network = await publicClient.getChainId();
console.log(`[${(new Date).toLocaleTimeString()}] 连接到 chain ID ${network}`);

console.log("\n2. 限制调用rpc接口速率");
// 2. 限制访问rpc速率，不然调用频率会超出限制，报错。
function throttle(fn, delay) {
    let timer;
    return function(){
        if(!timer) {
            fn.apply(this, arguments)
            timer = setTimeout(()=>{
                clearTimeout(timer)
                timer = null
            },delay)
        }
    }
}

const main = async () => {
    let i = 0;
    
    // 3. 监听pending交易，获取txHash
    console.log("\n3. 监听pending交易，打印txHash。");
    publicClient.watchPendingTransactions({
        onTransactions: async (txHashes) => {
            for (const txHash of txHashes) {
                if (txHash && i < 100) {
                    // 打印txHash
                    console.log(`[${(new Date).toLocaleTimeString()}] 监听Pending交易 ${i}: ${txHash} \r`);
                    i++;
                }
            }
        }
    });

    // 4. 监听pending交易，并获取交易详情
    console.log("\n4. 监听pending交易，获取txHash，并输出交易详情。");
    let j = 0;
    
    publicClient.watchPendingTransactions({
        onTransactions: throttle(async (txHashes) => {
            for (const txHash of txHashes) {
                if (txHash && j <= 100) {
                    try {
                        // 获取tx详情
                        let tx = await publicClient.getTransaction({ hash: txHash });
                        console.log(`\n[${(new Date).toLocaleTimeString()}] 监听Pending交易 ${j}: ${txHash} \r`);
                        console.log(tx);
                        j++;
                    } catch (error) {
                        console.log(`获取交易详情失败: ${error.message}`);
                    }
                }
            }
        }, 1000)
    });
};

main().catch(console.error); 