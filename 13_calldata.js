import { ethers } from 'ethers'
import {
    providerSepoliaAlchemy as provider,
    walletSepoliaAlchemy as wallet,
    balanceOfAbi,
    depositFunctionAbi,
    wethSepolia as addressWETH
} from './0_init.js'

const contractWETH = new ethers.Contract(addressWETH, [...balanceOfAbi, ...depositFunctionAbi], wallet);

const main = async () => {
    const address = await wallet.getAddress()
    console.log(address)

    // 1. 读取WETH合约的链上信息（WETH abi）
    console.log("\n1. 读取WETH余额")

    // 编码calldata
    const param1 = contractWETH.interface.encodeFunctionData(
        "balanceOf",
        [address]
    );
    console.log(`编码结果： ${param1}`) // 0x70a08231000000000000000000000000bd61c00e4b7c2a77cd660304ddd852379f705ed6

    // 创建交易
    const tx1 = {to: addressWETH, data: param1}
    // 发起交易，可读操作（view/pure）可以用 provider.call(tx)
    const balanceWETH = await provider.call(tx1)
    console.log(`存款前WETH持仓: ${ethers.formatEther(balanceWETH)}`) // 存款前WETH持仓: 757000.123456123456123456

    //读取钱包内ETH余额
    const balanceETH = await provider.getBalance(wallet)
    console.log(balanceETH) // 280848791740553837n

    if (ethers.formatEther(balanceETH) > 0.0015) {
        // 2. 调用deposit()函数，将0.001 ETH转为WETH
        console.log("\n2. 调用deposit()函数，存入0.001 ETH")

        const param2 = contractWETH.interface.encodeFunctionData("deposit")
        console.log(`编码结果： ${param2}`) // 编码结果： 0xd0e30db0
        // 创建交易
        const tx2 = {
            to: addressWETH,
            data: param2,
            value: ethers.parseEther("0.001")
        }
        const receipt1 = await wallet.sendTransaction(tx2) 
        // 等待交易上链
        await receipt1.wait()
        console.log(`交易详情：`)
        console.log(receipt1)
        // TransactionResponse {
        //     provider: JsonRpcProvider {},
        //     blockNumber: null,
        //     blockHash: null,
        //     index: undefined,
        //     hash: '0x2a2ab1559021e91864e84c54e496798ca539941f9c52ccf0a2d1607b0ccea14c',
        //     type: 2,
        //     to: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
        //     from: '0xbd61c00E4B7C2a77Cd660304ddd852379F705ED6',
        //     nonce: 43,
        //     gasLimit: 45418n,
        //     gasPrice: undefined,
        //     maxPriorityFeePerGas: 1000000n,
        //     maxFeePerGas: 17915928n,
        //     maxFeePerBlobGas: null,
        //     data: '0xd0e30db0',
        //     value: 1000000000000000n,
        //     chainId: 11155111n,
        //     signature: Signature { r: "0x9d1a2e0c08c1b18e18d3ef8e59e4060400765532672cd2acd14e8b792fb83806", s: "0x0cdaee88c9e9fed1f392df42ee416eed34b73b48884d2bc3ddcc443b708393ec", yParity: 1, networkV: null },
        //     accessList: [],
        //     blobVersionedHashes: null,
        //     authorizationList: null
        //   }
        const balanceETH_deposit = await contractWETH.balanceOf(address)
        console.log(`存款后WETH持仓: ${ethers.formatEther(balanceETH_deposit)}`) // 0.001
    }
}

main()