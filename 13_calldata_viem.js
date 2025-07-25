import { createPublicClient, createWalletClient, http, encodeFunctionData, parseEther, formatEther, parseAbiItem } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import dotenv from "dotenv";
dotenv.config();

import {
  wethSepolia as addressWETH
} from './0_init_ethersjs.js';

const account = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY);

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http()
});
const walletClient = createWalletClient({
  account,
  chain: sepolia,
  transport: http()
});

const main = async () => {
  const address = account.address;
  console.log(address);

  // 1. 读取WETH合约的链上信息（WETH abi）
  console.log("\n1. 读取WETH余额");

  // 使用 parseAbiItem 解析 ABI
  const balanceOfAbi = parseAbiItem("function balanceOf(address) public view returns(uint)");
  const depositAbi = parseAbiItem("function deposit() payable");
  
  // 编码calldata
  const param1 = encodeFunctionData({
    abi: [balanceOfAbi],
    functionName: "balanceOf",
    args: [address]
  });
  console.log(`编码结果： ${param1}`); // 0x70a08231000000000000000000000000bd61c00e4b7c2a77cd660304ddd852379f705ed6

  // 直接使用 readContract 读取余额
  const balanceWETH = await publicClient.readContract({
    address: addressWETH,
    abi: [balanceOfAbi],
    functionName: "balanceOf",
    args: [address]
  });
  console.log(`存款前WETH持仓: ${formatEther(balanceWETH)}`); // 存款前WETH持仓: 757000.123456123456123456

  // 读取钱包内ETH余额
  const balanceETH = await publicClient.getBalance({ address });
  console.log(balanceETH); // 280848791740553837n

  if (Number(formatEther(balanceETH)) > 0.0015) {
    // 2. 调用deposit()函数，将0.001 ETH转为WETH
    console.log("\n2. 调用deposit()函数，存入0.001 ETH");

    const param2 = encodeFunctionData({
      abi: [depositAbi],
      functionName: "deposit"
    });
    console.log(`编码结果： ${param2}`); // 编码结果： 0xd0e30db0

    // 创建交易
    const tx2 = {
      to: addressWETH,
      data: param2,
      value: parseEther("0.001")
    };
    const receipt1 = await walletClient.sendTransaction(tx2);
    // 等待交易上链
    const receipt = await publicClient.waitForTransactionReceipt({ hash: receipt1 });
    console.log(`交易详情：`);
    console.log(receipt);

    const balanceETH_deposit = await publicClient.readContract({
      address: addressWETH,
      abi: [balanceOfAbi],
      functionName: "balanceOf",
      args: [address]
    });
    console.log(`存款后WETH持仓: ${formatEther(balanceETH_deposit)}`); // 0.001
  }
};

main();
// 0xbd61c00E4B7C2a77Cd660304ddd852379F705ED6

// 1. 读取WETH余额
// 编码结果： 0x70a08231000000000000000000000000bd61c00e4b7c2a77cd660304ddd852379f705ed6
// 存款前WETH持仓: 0.003
// 1294351036985290080n

// 2. 调用deposit()函数，存入0.001 ETH
// 编码结果： 0xd0e30db0
// 交易详情：
// {
//   type: 'eip1559',
//   status: 'success',
//   cumulativeGasUsed: 31255377n,
//   logs: [
//     {
//       address: '0xfff9976782d46cc05630d1f6ebab18b2324d6b14',
//       topics: [Array],
//       data: '0x00000000000000000000000000000000000000000000000000038d7ea4c68000',
//       blockHash: '0x6d77ba6b0bb674602a8e5e0f83c49ff5497523d4f68ad10fff27b8de374e846c',
//       blockNumber: 8838277n,
//       blockTimestamp: '0x688347fc',
//       transactionHash: '0x2357ca4d6a6df2c3cbf97446b5ea97941f0f427bb1a28e1dce0ee0c25b6873c5',
//       transactionIndex: 297,
//       logIndex: 709,
//       removed: false
//     }
//   ],
//   logsBloom: '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080
// 00000000000000000000000080000010000000000000000000000000000000000000000040000000000000000000000000000
// 00000000100000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000
// 00000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 00000400008000000000000',
//   transactionHash: '0x2357ca4d6a6df2c3cbf97446b5ea97941f0f427bb1a28e1dce0ee0c25b6873c5',
//   transactionIndex: 297,
//   blockHash: '0x6d77ba6b0bb674602a8e5e0f83c49ff5497523d4f68ad10fff27b8de374e846c',
//   blockNumber: 8838277n,
//   gasUsed: 27938n,
//   effectiveGasPrice: 236138430n,
//   from: '0xbd61c00e4b7c2a77cd660304ddd852379f705ed6',
//   to: '0xfff9976782d46cc05630d1f6ebab18b2324d6b14',
//   contractAddress: null
// }
// 存款后WETH持仓: 0.004