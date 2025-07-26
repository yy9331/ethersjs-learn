import { createPublicClient, createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import dotenv from "dotenv";
dotenv.config();

// 创建客户端
const publicClient = createPublicClient({
    chain: sepolia,
    transport: http()
});

const walletClient = createWalletClient({
    account: privateKeyToAccount(process.env.WALLET_PRIVATE_KEY),
    chain: sepolia,
    transport: http()
});

// 测试 ERC20 代币地址 (USDC on Sepolia)
const USDC_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";

// ERC20 transfer 函数 ABI
const transferAbi = {
    name: "transfer",
    type: "function",
    inputs: [
        { type: "address" },
        { type: "uint256" }
    ],
    outputs: [{ type: "bool" }]
};

async function testERC20Transfer() {
    try {
        console.log("开始测试 ERC20 transfer 交易...");
        
        // 发送一个 ERC20 transfer 交易
        const hash = await walletClient.writeContract({
            address: USDC_ADDRESS,
            abi: [transferAbi],
            functionName: "transfer",
            args: ["0xbd61c00E4B7C2a77Cd660304ddd852379F705ED6", 1000n]
        });
        
        console.log(`ERC20 transfer 交易已发送: ${hash}`);
        console.log(`Etherscan链接: https://sepolia.etherscan.io/tx/${hash}`);
        
        // 等待交易确认
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        console.log("交易已确认！");
        
    } catch (error) {
        console.error("测试失败:", error.message);
    }
}

testERC20Transfer(); 