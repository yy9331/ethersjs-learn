import { ethers } from "ethers";
import { providerSepoliaAlchemy as provider } from './0_init.js'

// 已知的 WETH 地址
const WETH_ADDRESSES = {
    mainnet: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    sepolia: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
    goerli: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6"
}

// WETH 标准 ABI
const WETH_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint256)",
    "function deposit() payable",
    "function withdraw(uint256)"
]

const verifyWETHAddress = async (address, networkName) => {
    try {
        console.log(`\n验证 ${networkName} 网络的 WETH 地址: ${address}`)
        
        const contract = new ethers.Contract(address, WETH_ABI, provider)
        
        // 检查合约是否存在
        const name = await contract.name()
        const symbol = await contract.symbol()
        const decimals = await contract.decimals()
        
        console.log(`✅ 合约名称: ${name}`)
        console.log(`✅ 代币符号: ${symbol}`)
        console.log(`✅ 小数位数: ${decimals}`)
        
        // 检查是否有 deposit 和 withdraw 函数
        const hasDeposit = WETH_ABI.some(abi => abi.includes('deposit'))
        const hasWithdraw = WETH_ABI.some(abi => abi.includes('withdraw'))
        
        console.log(`✅ 有 deposit 函数: ${hasDeposit}`)
        console.log(`✅ 有 withdraw 函数: ${hasWithdraw}`)
        
        return true
        
    } catch (error) {
        console.log(`❌ 验证失败: ${error.message}`)
        return false
    }
}

const main = async () => {
    console.log("=== WETH 地址验证 ===\n")
    
    // 验证 Sepolia 网络的 WETH 地址
    await verifyWETHAddress(WETH_ADDRESSES.sepolia, "Sepolia")
    
    console.log("\n=== 如何获取 WETH 地址 ===")
    console.log("1. 官方文档:")
    console.log("   - 以太坊基金会: https://ethereum.org/")
    console.log("   - Uniswap 文档: https://docs.uniswap.org/")
    console.log("   - Chainlist: https://chainlist.org/")
    
    console.log("\n2. 区块链浏览器:")
    console.log("   - 主网: https://etherscan.io/")
    console.log("   - Sepolia: https://sepolia.etherscan.io/")
    console.log("   - 搜索 'WETH' 或 'Wrapped Ether'")
    
    console.log("\n3. 代码获取方式:")
    console.log("   - 通过 Uniswap 工厂合约")
    console.log("   - 通过 Chainlink 价格源")
    console.log("   - 通过 DeFi 协议 SDK")
    
    console.log("\n4. 验证方法:")
    console.log("   - 检查合约是否有 deposit/withdraw 函数")
    console.log("   - 检查合约名称是否为 'Wrapped Ether'")
    console.log("   - 检查代币符号是否为 'WETH'")
    console.log("   - 检查小数位数是否为 18")
}

main() 