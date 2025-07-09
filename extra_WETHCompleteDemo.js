import { ethers } from "ethers";
import { providerSepoliaAlchemy as provider, walletSepoliaAlchemy as wallet, wethSepolia } from './0_init.js'

// 完整的 WETH ABI
const WETH_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint256)",
    "function deposit() payable",
    "function withdraw(uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "event Transfer(address indexed from, address indexed to, uint256 value)",
    "event Deposit(address indexed dst, uint256 wad)",
    "event Withdrawal(address indexed src, uint256 wad)"
]

// 创建 WETH 合约实例
const wethContract = new ethers.Contract(wethSepolia, WETH_ABI, wallet)

const main = async () => {
    try {
        console.log("=== WETH 完整演示 (Sepolia 测试网) ===\n")

        const walletAddress = await wallet.getAddress()
        console.log(`钱包地址: ${walletAddress}`)

        // 1. 读取当前余额
        console.log("\n1. 读取当前余额:")
        const ethBalance = await provider.getBalance(walletAddress)
        const wethBalance = await wethContract.balanceOf(walletAddress)
        
        console.log(`ETH 余额: ${ethers.formatEther(ethBalance)} ETH`)
        console.log(`WETH 余额: ${ethers.formatEther(wethBalance)} WETH`)

        // 2. 演示 calldata 编码
        console.log("\n2. Calldata 编码演示:")
        
        // balanceOf 函数的 calldata
        const balanceOfCalldata = wethContract.interface.encodeFunctionData(
            "balanceOf",
            [walletAddress]
        )
        console.log(`balanceOf calldata: ${balanceOfCalldata}`)
        
        // deposit 函数的 calldata
        const depositCalldata = wethContract.interface.encodeFunctionData("deposit")
        console.log(`deposit calldata: ${depositCalldata}`)
        
        // withdraw 函数的 calldata
        const withdrawCalldata = wethContract.interface.encodeFunctionData(
            "withdraw",
            [ethers.parseEther("0.001")]
        )
        console.log(`withdraw calldata: ${withdrawCalldata}`)

        // 3. 检查是否有足够的 ETH 进行测试
        const ethBalanceNum = parseFloat(ethers.formatEther(ethBalance))
        console.log(`\n3. 余额检查:`)
        console.log(`当前 ETH 余额: ${ethBalanceNum} ETH`)
        
        if (ethBalanceNum < 0.01) {
            console.log("⚠️  ETH 余额不足，无法进行 deposit 测试")
            console.log("建议: 从 Sepolia 水龙头获取测试 ETH")
            console.log("水龙头地址: https://sepoliafaucet.com/")
            return
        }

        // 4. 演示 deposit 操作 (如果余额足够)
        if (ethBalanceNum >= 0.01) {
            console.log("\n4. 演示 deposit 操作:")
            console.log("准备存入 0.001 ETH 转换为 WETH...")
            
            try {
                // 估算 gas
                const gasEstimate = await wethContract.deposit.estimateGas({
                    value: ethers.parseEther("0.001")
                })
                console.log(`预估 gas: ${gasEstimate.toString()}`)
                
                // 执行 deposit
                const tx = await wethContract.deposit({
                    value: ethers.parseEther("0.001")
                })
                console.log(`交易哈希: ${tx.hash}`)
                console.log("等待交易确认...")
                
                const receipt = await tx.wait()
                console.log(`交易确认! 区块号: ${receipt.blockNumber}`)
                
                // 检查新的余额
                const newWethBalance = await wethContract.balanceOf(walletAddress)
                console.log(`新的 WETH 余额: ${ethers.formatEther(newWethBalance)} WETH`)
                
            } catch (error) {
                console.log("❌ deposit 操作失败:")
                console.log(error.message)
            }
        }

        // 5. 演示 withdraw 操作 (如果有 WETH)
        const currentWethBalance = await wethContract.balanceOf(walletAddress)
        if (currentWethBalance > 0) {
            console.log("\n5. 演示 withdraw 操作:")
            console.log("准备将 WETH 转换回 ETH...")
            
            try {
                const withdrawAmount = currentWethBalance > ethers.parseEther("0.001") 
                    ? ethers.parseEther("0.001") 
                    : currentWethBalance
                
                const tx = await wethContract.withdraw(withdrawAmount)
                console.log(`交易哈希: ${tx.hash}`)
                console.log("等待交易确认...")
                
                const receipt = await tx.wait()
                console.log(`交易确认! 区块号: ${receipt.blockNumber}`)
                
                // 检查新的余额
                const newEthBalance = await provider.getBalance(walletAddress)
                const newWethBalance = await wethContract.balanceOf(walletAddress)
                console.log(`新的 ETH 余额: ${ethers.formatEther(newEthBalance)} ETH`)
                console.log(`新的 WETH 余额: ${ethers.formatEther(newWethBalance)} WETH`)
                
            } catch (error) {
                console.log("❌ withdraw 操作失败:")
                console.log(error.message)
            }
        }

        // 6. 总结
        console.log("\n6. 总结:")
        console.log("✅ WETH 是 ETH 的包装版本")
        console.log("✅ 1 WETH = 1 ETH (1:1 锚定)")
        console.log("✅ 可以在 DeFi 协议中作为标准 ERC-20 代币使用")
        console.log("✅ 随时可以转换回 ETH")

    } catch (error) {
        console.error("错误:", error.message)
    }
}

main() 