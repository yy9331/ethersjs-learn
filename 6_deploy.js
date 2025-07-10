import { ethers } from "ethers"
import bytecodeERC20 from "./6_byteCode.js"
import abiERC20 from "./6_abi_human_readable.js"
import { walletSepoliaInfura as wallet, providerSepoliaAlchemy as provider } from "./0_initProviderAndWallet.js"

const factoryERC20 = new ethers.ContractFactory(abiERC20, bytecodeERC20, wallet)

const main = async () => {
    const balanceETH = await provider.getBalance(wallet)

    if(ethers.formatEther(balanceETH) > 0.002){
        // 1. 利用contractFactory部署ERC20代币合约
        console.log("1. 利用contractFactory部署ERC20代币合约")

        // 部署合约，填入constructor的参数
        const contractERC20 = await factoryERC20.deploy('CM2 Token', 'CM2')
        console.log(`合约地址: ${contractERC20.target}`);
        console.log("部署合约的交易详情")
        console.log(contractERC20.deploymentTransaction())
        console.log("等待合约部署上链")
        await contractERC20.waitForDeployment()
        console.log("合约已上链")
        
        // 2. 打印合约的name()和symbol()，然后调用mint()函数，给自己地址mint 10,000代币
        console.log("2. 调用mint()函数，给自己地址mint 86,768代币")
        console.log(`合约名称: ${await contractERC20.name()}`)
        console.log(`合约代号: ${await contractERC20.symbol()}`)
        let tx = await contractERC20.mint("86768")
        console.log("等待交易上链")
        await tx.wait()
        console.log(`mint后地址中代币余额: ${await contractERC20.balanceOf(wallet)}`)
        console.log(`代币总供给: ${await contractERC20.totalSupply()}`)

        // 3. 调用transfer()函数，给Vitalik转账1000代币
        console.log("3. 调用transfer()函数，给Vitalik转账1,000代币")
        tx = await contractERC20.transfer("vitalik.eth", "1000")
        console.log("等待交易上链")
        await tx.wait()
        console.log(`Vitalik钱包中的代币余额: ${await contractERC20.balanceOf("vitalik.eth")}`)
    }else{
        // 如果ETH不足
        console.log("ETH不足，去水龙头领一些Sepolia ETH")
        console.log("1. chainlink水龙头: https://sepolia-faucet.pk910.de/")
        console.log("2. paradigm水龙头: https://cloud.google.com/application/web3/faucet/ethereum/sepolia")
    }

}

main();