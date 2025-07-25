// contract.函数名.staticCall(参数, {override})
import { createPublicClient, http, formatEther, parseEther, parseAbiItem } from "viem";
import { mainnet } from "viem/chains";
import { walletMainNetByAlchemy as wallet } from './0_init_ethersjs.js';
import dotenv from "dotenv";
dotenv.config();

// 创建公共客户端
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(process.env.MAINNET_RPC_URL_ALCHEMY)
});

// DAI合约地址（主网）
const addressDAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F' // DAI Contract

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
    
    // 定义 balanceOf 函数
    const balanceOfAbi = parseAbiItem("function balanceOf(address owner) view returns (uint256)");
    
    const balanceDAI = await publicClient.readContract({
      address: addressDAI,
      abi: [balanceOfAbi],
      functionName: 'balanceOf',
      args: [address]
    });
    
    const balanceDAIVitalik = await publicClient.readContract({
      address: addressDAI,
      abi: [balanceOfAbi],
      functionName: 'balanceOf',
      args: ["0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"] // vitalik.eth 的地址
    });
    
    const balanceDAIZood = await publicClient.readContract({
      address: addressDAI,
      abi: [balanceOfAbi],
      functionName: 'balanceOf',
      args: [zoodAddress]
    });

    console.log(`测试钱包 DAI持仓: ${formatEther(balanceDAI)}`)
    console.log(`vitalik DAI持仓: ${formatEther(balanceDAIVitalik)}`)
    console.log(`Zood DAI持仓: ${formatEther(balanceDAIZood)}`)

    // 2. 用simulateContract尝试调用transfer转账1 DAI，msg.sender为Vitalik，交易将成功
    await tryStaticCall(
      "\n2. 用simulateContract尝试调用transfer转账1 DAI，msg.sender为Vitalik地址",
      async () => {
        const vitalikAddress = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" // vitalik.eth 的地址
        console.log(`Vitalik的地址: ${vitalikAddress}`)
        
        // 定义 transfer 函数
        const transferAbi = parseAbiItem("function transfer(address to, uint256 amount) returns (bool)");
        
        return await publicClient.simulateContract({
          address: addressDAI,
          abi: [transferAbi],
          functionName: 'transfer',
          args: [address, parseEther("1")],
          account: vitalikAddress // Vitalik作为发送方
        })
      }
    )

    // 3. 用simulateContract尝试调用transfer转账10000 DAI，msg.sender为测试钱包地址，交易将失败
    await tryStaticCall(
      "\n3. 用simulateContract尝试调用transfer转账10000 DAI，msg.sender为测试钱包地址",
      async () => {
        // 定义 transfer 函数
        const transferAbi = parseAbiItem("function transfer(address to, uint256 amount) returns (bool)");
        
        return await publicClient.simulateContract({
          address: addressDAI,
          abi: [transferAbi],
          functionName: 'transfer',
          args: ["0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", parseEther("10000")], // 转账给Vitalik
          account: address // 测试钱包作为发送方
        })
      }
    )

    // 4. 用simulateContract尝试调用transfer转账1 DAI，msg.sender为Zood地址（直接地址示例）
    await tryStaticCall(
      "\n4. 用simulateContract尝试调用transfer转账1 DAI，msg.sender为Zood地址（直接地址示例）",
      async () => {
        console.log(`Zood的地址: ${zoodAddress}`)
        
        // 定义 transfer 函数
        const transferAbi = parseAbiItem("function transfer(address to, uint256 amount) returns (bool)");
        
        return await publicClient.simulateContract({
          address: addressDAI,
          abi: [transferAbi],
          functionName: 'transfer',
          args: [address, parseEther("1")], // 转账给测试钱包
          account: zoodAddress // Zood作为发送方
        })
      }
    )

    // 5. 用simulateContract尝试调用transfer转账10000 DAI，msg.sender为测试钱包地址，转账给Zood
    await tryStaticCall(
      "\n5. 用simulateContract尝试调用transfer转账10000 DAI，msg.sender为测试钱包地址，转账给Zood",
      async () => {
        // 定义 transfer 函数
        const transferAbi = parseAbiItem("function transfer(address to, uint256 amount) returns (bool)");
        
        return await publicClient.simulateContract({
          address: addressDAI,
          abi: [transferAbi],
          functionName: 'transfer',
          args: [zoodAddress, parseEther("10000")], // 转账给Zood
          account: address // 测试钱包作为发送方
        })
      }
    )

  } catch (e) {
    console.log(e);
  }
}

main()
// 1. 读取测试钱包的DAI余额
// 测试钱包 DAI持仓: 0
// vitalik DAI持仓: 0
// Zood DAI持仓: 0

// 2. 用simulateContract尝试调用transfer转账1 DAI，msg.sender为Vitalik地址
// Vitalik的地址: 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
// 交易失败： The contract function "transfer" reverted with the following reason:
// Dai/insufficient-balance

// Contract Call:
//   address:   0x6B175474E89094C44Da98b954EedeAC495271d0F
//   function:  transfer(address to, uint256 amount)
//   args:              (0xbd61c00E4B7C2a77Cd660304ddd852379F705ED6, 1000000000000000000)
//   sender:    0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045

// Docs: https://viem.sh/docs/contract/simulateContract
// Version: viem@2.33.0

// 3. 用simulateContract尝试调用transfer转账10000 DAI，msg.sender为测试钱包地址
// 交易失败： The contract function "transfer" reverted with the following reason:
// Dai/insufficient-balance

// Contract Call:
//   address:   0x6B175474E89094C44Da98b954EedeAC495271d0F
//   function:  transfer(address to, uint256 amount)
//   args:              (0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045, 10000000000000000000000)
//   sender:    0xbd61c00E4B7C2a77Cd660304ddd852379F705ED6

// Docs: https://viem.sh/docs/contract/simulateContract
// Version: viem@2.33.0

// 4. 用simulateContract尝试调用transfer转账1 DAI，msg.sender为Zood地址（直接地址示例）
// Zood的地址: 0x5A7157d6Fd2aD4A9Edc4686758bE77aE480bfe6A
// 交易失败： The contract function "transfer" reverted with the following reason:
// Dai/insufficient-balance

// Contract Call:
//   address:   0x6B175474E89094C44Da98b954EedeAC495271d0F
//   function:  transfer(address to, uint256 amount)
//   args:              (0xbd61c00E4B7C2a77Cd660304ddd852379F705ED6, 1000000000000000000)
//   sender:    0x5A7157d6Fd2aD4A9Edc4686758bE77aE480bfe6A

// Docs: https://viem.sh/docs/contract/simulateContract
// Version: viem@2.33.0

// 5. 用simulateContract尝试调用transfer转账10000 DAI，msg.sender为测试钱包地址，转账给Zood
// 交易失败： The contract function "transfer" reverted with the following reason:
// Dai/insufficient-balance

// Contract Call:
//   address:   0x6B175474E89094C44Da98b954EedeAC495271d0F
//   function:  transfer(address to, uint256 amount)
//   args:              (0x5A7157d6Fd2aD4A9Edc4686758bE77aE480bfe6A, 10000000000000000000000)
//   sender:    0xbd61c00E4B7C2a77Cd660304ddd852379F705ED6

// Docs: https://viem.sh/docs/contract/simulateContract
// Version: viem@2.33.0