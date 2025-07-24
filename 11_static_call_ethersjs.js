// contract.函数名.staticCall(参数, {override})
import { ethers } from "ethers";
import { providerEthByAlchemy as provider, walletMainNetByAlchemy as wallet } from './0_init_ethersjs.js';

// DAI的ABI
const abiDAI = [
    "function balanceOf(address) public view returns(uint)",
    "function transfer(address, uint) public returns (bool)",
];
// DAI合约地址（主网）
const addressDAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F' // DAI Contract

// 创建DAI合约实例
const contractDAI = new ethers.Contract(addressDAI, abiDAI, provider)

// 辅助函数：使用 Promise.resolve().then() 处理异步操作
const tryStaticCall = async (description, callFn) => {
    console.log(description)
    return Promise.resolve()
        .then(async () => {
            const result = await callFn()
            console.log(`交易会成功吗？：`, result)
            return result
        })
        .catch(error => {
            console.log(`交易失败：`, error.reason || error.message)
            return null
        })
}

const main = async () => {
    try {
        const address = await wallet.getAddress() // 我自己钱包的地址
        const zoodAddress = "0x5A7157d6Fd2aD4A9Edc4686758bE77aE480bfe6A"
        
        // 1. 读取DAI合约的链上信息
        console.log("\n1. 读取测试钱包的DAI余额")
        const balanceDAI = await contractDAI.balanceOf(address)
        const balanceDAIVitalik = await contractDAI.balanceOf("vitalik.eth")
        const balanceDAIZood = await contractDAI.balanceOf(zoodAddress)

        console.log(`测试钱包 DAI持仓: ${ethers.formatEther(balanceDAI)}`)
        console.log(`vitalik DAI持仓: ${ethers.formatEther(balanceDAIVitalik)}`)
        console.log(`Zood DAI持仓: ${ethers.formatEther(balanceDAIZood)}`)

        // 2. 用staticCall尝试调用transfer转账1 DAI，msg.sender为Vitalik，交易将成功
        await tryStaticCall(
            "\n2. 用staticCall尝试调用transfer转账1 DAI，msg.sender为Vitalik地址",
            async () => {
                const vitalikAddress = await provider.resolveName("vitalik.eth")
                console.log(`Vitalik的地址: ${vitalikAddress}`)
                
                return await contractDAI.transfer.staticCall(
                    address, // 转账给测试钱包
                    ethers.parseEther("1"), 
                    {from: vitalikAddress} // Vitalik作为发送方
                )
            }
        )

        // 3. 用staticCall尝试调用transfer转账10000 DAI，msg.sender为测试钱包地址，交易将失败
        await tryStaticCall(
            "\n3. 用staticCall尝试调用transfer转账10000 DAI，msg.sender为测试钱包地址",
            async () => {
                return await contractDAI.transfer.staticCall(
                    "vitalik.eth", // 转账给Vitalik
                    ethers.parseEther("10000"), 
                    {from: address} // 测试钱包作为发送方
                )
            }
        )

        // 4. 用staticCall尝试调用transfer转账1 DAI，msg.sender为Zood地址（直接地址示例）
        await tryStaticCall(
            "\n4. 用staticCall尝试调用transfer转账1 DAI，msg.sender为Zood地址（直接地址示例）",
            async () => {
                console.log(`Zood的地址: ${zoodAddress}`)
                
                return await contractDAI.transfer.staticCall(
                    address, // 转账给测试钱包
                    ethers.parseEther("1"), 
                    {from: zoodAddress} // Zood作为发送方
                )
            }
        )

        // 5. 用staticCall尝试调用transfer转账10000 DAI，msg.sender为测试钱包地址，转账给Zood
        await tryStaticCall(
            "\n5. 用staticCall尝试调用transfer转账10000 DAI，msg.sender为测试钱包地址，转账给Zood",
            async () => {
                return await contractDAI.transfer.staticCall(
                    zoodAddress, // 转账给Zood
                    ethers.parseEther("10000"), 
                    {from: address} // 测试钱包作为发送方
                )
            }
        )

    } catch (e) {
        console.log(e);
    }
}

main()
