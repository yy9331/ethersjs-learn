import { ethers } from 'ethers';
import dotenv from 'dotenv';
import { providerSepoliaAlchemy } from './0_initProviderAndWallet.js'

// 加载环境变量
dotenv.config();

// 1. 创建随机wallet 对象
const wallet1 = ethers.Wallet.createRandom()
const walletWithProvider = wallet1.connect(providerSepoliaAlchemy)
const mnemonic = wallet1.mnemonic // 生成助记词

// 利用私钥和provider创建wallet对象
const wallet2 = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, providerSepoliaAlchemy)

// 从助记词创建wallet对象
const wallet3 = ethers.Wallet.fromPhrase(mnemonic.phrase)

const initWallet = async () => {
    // 1. 获取钱包地址
    const address1 = await wallet1.getAddress() // 0x5435d0b22D7b0e7a667373Fecb7b74b84dcb8F3e
    const address2 = await wallet2.getAddress() // 0xbd61c00E4B7C2a77Cd660304ddd852379F705ED6
    const address3 = await wallet3.getAddress() // 0x5435d0b22D7b0e7a667373Fecb7b74b84dcb8F3e
    console.log(`1. 获取钱包地址`);
    console.log(`钱包1地址: ${address1}`);
    console.log(`钱包2地址: ${address2}`);
    console.log(`钱包3地址: ${address3}`);
    console.log(`钱包1和钱包3的地址是否相同: ${address1 === address3}`); // true. 因钱包3为钱包1的助记词生成

    // 2. 获取助记词
    console.log('2.获取助记词', wallet1.mnemonic.phrase); // f...s

    // 3. 获取私钥
    console.log('3. 获取私钥')
    console.log('钱包1私钥', wallet1.privateKey)
    console.log('钱包2私钥', wallet2.privateKey)

    // 4. 获取链上发送交易次数
    console.log(`4. 获取链上交易次数`)
    const exCount1 = await providerSepoliaAlchemy.getTransactionCount(walletWithProvider)
    const exCount2 = await providerSepoliaAlchemy.getTransactionCount(wallet2)
    console.log('钱包1交易次数', exCount1)
    console.log('钱包2交易次数', exCount2)
    
    // 5. 发送ETH
    // 如果这个钱包没goerli测试网ETH了，去水龙头领一些，钱包地址: 0xe16C1623c1AA7D919cd2241d8b36d9E79C1Be2A2
    // 1. chainlink水龙头: https://faucets.chain.link/goerli
    // 2. paradigm水龙头: https://faucet.paradigm.xyz/
    // i. 打印交易前余额
    console.log(`i. 发送前余额`)
    console.log(`钱包1: ${ethers.formatEther(await providerSepoliaAlchemy.getBalance(walletWithProvider))} ETH`) // 钱包1: 0.0 ETH
    console.log(`钱包2: ${ethers.formatEther(await providerSepoliaAlchemy.getBalance(wallet2))} ETH`) // 钱包2: 0.257334298217011922 ETH

    // ii. 构造交易请求，参数：to为接收地址，value为ETH数额
    const ex = {
        to: address1,
        value: ethers.parseEther("0.001")
    }
    // iii. 发送交易, 获得收据
    console.log(`\nii. 等待交易在区块链确认（需要几分钟）`)
    const receipt = await wallet2.sendTransaction(ex)
    await receipt.wait()
    console.log(receipt)
    // TransactionResponse {
    //     provider: JsonRpcProvider {},
    //     blockNumber: null,
    //     blockHash: null,
    //     index: undefined,
    //     hash: '0x63ef8d57e62f418cbefb33619e29379b50d6f4438d31c4ddc8eaf0f9d7f5fe4e',
    //     type: 2,
    //     to: '0x5435d0b22D7b0e7a667373Fecb7b74b84dcb8F3e',
    //     from: '0xbd61c00E4B7C2a77Cd660304ddd852379F705ED6',
    //     nonce: 9,
    //     gasLimit: 21000n,
    //     gasPrice: undefined,
    //     maxPriorityFeePerGas: 1000000n,
    //     maxFeePerGas: 7978234824n,
    //     maxFeePerBlobGas: null,
    //     data: '0x',
    //     value: 1000000000000000n,
    //     chainId: 11155111n,
    //     signature: Signature { r: "0x3bcf19acd3769f61b4b59387a42177172f661239b98a709e2cb8dfafb3f1c0ff", s: "0x4c1cb2638376745ae398571347b750519646d7525e6893c93d3b7ff82341d4c5", yParity: 0, networkV: null },
    //     accessList: [],
    //     blobVersionedHashes: null,
    //     authorizationList: null
    //   }
    // iv. 打印交易后余额
    console.log(`\niii. 发送后余额`)
    console.log(`钱包1: ${ethers.formatEther(await providerSepoliaAlchemy.getBalance(walletWithProvider))} ETH`) // 钱包1: 0.001 ETH
    console.log(`钱包2: ${ethers.formatEther(await providerSepoliaAlchemy.getBalance(wallet2))} ETH`) // 钱包2: 0.256250020962306922 ETH

}

initWallet();