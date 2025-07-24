import { ethers } from "ethers";
import { providerSepoliaAlchemy } from './0_init.js';

import dotenv from "dotenv";
dotenv.config();

const privateKey = process.env.WALLET_PRIVATE_KEY
const wallet = new ethers.Wallet(privateKey, providerSepoliaAlchemy)

const abiWETH = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint)",
    "function deposit() payable",
    "function transfer(address to, uint256 amount) returns (bool)"
]
// Sepolia 测试网上的 WETH 合约地址
const addressWETH = '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9'

// 1. 声明可写合约:
//      可写合约第三个参数为 wallet 对象
// const contractWETH = new ethers.Contract(addressWETH, abiWETH, wallet)
// 2. 声明可读合约, 可读合约不需要用 Gas, 再用connect(wallet)函数转换为可写合约
//      可读合约第三个参数为 provider
const contractWETH = new ethers.Contract(addressWETH, abiWETH, providerSepoliaAlchemy)
// 将合约连接到钱包以支持交易
const contractWETHWithSigner = contractWETH.connect(wallet)

const main = async () => {
    const address = await wallet.getAddress();
    // 1. 读取 WETH合约的链上信息 (WETH abi)
    console.log("1. 读取WETH余额")
    const balanceWETH = await contractWETH.balanceOf(address)
    console.log(`存款前WETH持仓: ${ethers.formatEther(balanceWETH)}`)
    // 读取钱包内 ETH 余额
    const balanceETH = await providerSepoliaAlchemy.getBalance(wallet)

    if (ethers.formatEther(balanceETH) > 0.0015) {
        // 2. 调用deposit()函数，将0.001 ETH转为WETH
        console.log("\n2. 调用deposit()函数，存入0.001 ETH")
        // 发起交易 - 使用连接到钱包的合约实例
        const tx = await contractWETHWithSigner.deposit({value: ethers.parseEther("0.001")})
        // 等待交易上链
        await tx.wait()
        console.log(`交易详情：`)
        console.log(tx)
        const balanceWETH_deposit = await contractWETH.balanceOf(address)
        console.log(`存款后WETH持仓: ${ethers.formatEther(balanceWETH_deposit)}\n`)

        // 3. 调用transfer()函数，将0.001 WETH转账给 vitalik
        console.log("3. 调用transfer()函数，给vitalik转账0.001 WETH")
        // 发起交易 - 使用连接到钱包的合约实例 !!!!!
        const tx2 = await contractWETHWithSigner.transfer("vitalik.eth", ethers.parseEther("0.001"))
        // 等待交易上链
        await tx2.wait()
        const balanceWETH_transfer = await contractWETH.balanceOf(address)
        console.log(`转账后WETH持仓: ${ethers.formatEther(balanceWETH_transfer)}\n`)
    }else{
        // 如果ETH不足
        console.log("ETH不足，去水龙头领一些Sepolia ETH")
        console.log("1. chainlink水龙头: https://faucets.chain.link/goerli")
        console.log("2. paradigm水龙头: https://faucet.paradigm.xyz/")
    }
}

// 调用主函数
main().catch((error) => {
    console.error(error);
    process.exit(1);
});
