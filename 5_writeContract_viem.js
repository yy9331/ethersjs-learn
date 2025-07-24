import 'dotenv/config';
import { createWalletClient, createPublicClient, http, parseEther, formatEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import abiWETH from './5_abiWETH.json' assert { type: "json" };

// 用私钥创建钱包对象（加0x前缀）
const account = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY);

// Sepolia 测试网上的 WETH 合约地址和 ABI
const addressWETH = '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9';

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
  // 1. 读取 WETH 余额
  console.log("1. 读取WETH余额");
  const balanceWETH = await publicClient.readContract({
    address: addressWETH,
    abi: abiWETH,
    functionName: "balanceOf",
    args: [address]
  });
  console.log(`存款前WETH持仓: ${formatEther(balanceWETH)}`);
  // 读取钱包内 ETH 余额
  const balanceETH = await publicClient.getBalance({ address });
  console.log(`钱包ETH余额: ${formatEther(balanceETH)}`);

  if (Number(formatEther(balanceETH)) > 0.0015) {
    // 2. 调用deposit()函数，将0.001 ETH转为WETH
    console.log("\n2. 调用deposit()函数，存入0.001 ETH");
    const hash = await walletClient.writeContract({
      address: addressWETH,
      abi: abiWETH,
      functionName: "deposit",
      value: parseEther("0.001")
    });
    console.log(`等待交易上链: ${hash}`);
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    console.log("交易详情：", receipt);
    const balanceWETH_deposit = await publicClient.readContract({
      address: addressWETH,
      abi: abiWETH,
      functionName: "balanceOf",
      args: [address]
    });
    console.log(`存款后WETH持仓: ${formatEther(balanceWETH_deposit)}\n`);

    // 3. 调用transfer()函数，将0.001 WETH转账给 vitalik
    console.log("3. 调用transfer()函数，给vitalik转账0.001 WETH");
    const vitalik = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
    const hash2 = await walletClient.writeContract({
      address: addressWETH,
      abi: abiWETH,
      functionName: "transfer",
      args: [vitalik, parseEther("0.001")]
    });
    console.log(`等待交易上链: ${hash2}`);
    const receipt2 = await publicClient.waitForTransactionReceipt({ hash: hash2 });
    console.log("交易详情：", receipt2);
    const balanceWETH_transfer = await publicClient.readContract({
      address: addressWETH,
      abi: abiWETH,
      functionName: "balanceOf",
      args: [address]
    });
    console.log(`转账后WETH持仓: ${formatEther(balanceWETH_transfer)}\n`);
  } else {
    // 如果ETH不足
    console.log("ETH不足，去水龙头领一些Sepolia ETH");
    console.log("1. chainlink水龙头: https://faucets.chain.link/goerli");
    console.log("2. paradigm水龙头: https://faucet.paradigm.xyz/");
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

// 1. 读取WETH余额
// 存款前WETH持仓: 0.001
// 钱包ETH余额: 1.29635327077882746

// 2. 调用deposit()函数，存入0.001 ETH
// 等待交易上链: 0xc630efb71eaeacbf104845a3fe0b53e0546f34fe83290e2721514c429419fd9e
// 交易详情： {
//   type: 'eip1559',
//   status: 'success',
//   cumulativeGasUsed: 21406101n,
//   logs: [
//     {
//       address: '0x7b79995e5f793a07bc00c21412e50ecae098e7f9',
//       topics: [Array],
//       data: '0x00000000000000000000000000000000000000000000000000038d7ea4c68000',
//       blockHash: '0x92a8ca3a57c75151942a85e5aea336219360ec2b06faf3c0bdf22ac8e69e6b69',
//       blockNumber: 8830832n,
//       blockTimestamp: '0x6881ea7c',
//       transactionHash: '0xc630efb71eaeacbf104845a3fe0b53e0546f34fe83290e2721514c429419fd9e',
//       transactionIndex: 177,
//       logIndex: 294,
//       removed: false
//     }
//   ],
//   logsBloom: '0x00000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000080000010000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400008000000000000',
//   transactionHash: '0xc630efb71eaeacbf104845a3fe0b53e0546f34fe83290e2721514c429419fd9e',
//   transactionIndex: 177,
//   blockHash: '0x92a8ca3a57c75151942a85e5aea336219360ec2b06faf3c0bdf22ac8e69e6b69',
//   blockNumber: 8830832n,
//   gasUsed: 27810n,
//   effectiveGasPrice: 1620599n,
//   from: '0xbd61c00e4b7c2a77cd660304ddd852379f705ed6',
//   to: '0x7b79995e5f793a07bc00c21412e50ecae098e7f9',
//   contractAddress: null
// }
// 存款后WETH持仓: 0.002

// 3. 调用transfer()函数，给vitalik转账0.001 WETH
// 等待交易上链: 0x5fc3c1f58398d2701630698197adf85f82dc343cde122eac2fe00fa77a29c047
// 交易详情： {
//   type: 'eip1559',
//   status: 'success',
//   cumulativeGasUsed: 15599587n,
//   logs: [
//     {
//       address: '0x7b79995e5f793a07bc00c21412e50ecae098e7f9',
//       topics: [Array],
//       data: '0x00000000000000000000000000000000000000000000000000038d7ea4c68000',
//       blockHash: '0xcd052a21fbc366ec026dd21abff61eca9adc9ce42582b26a458a9062225c1a50',
//       blockNumber: 8830833n,
//       blockTimestamp: '0x6881ea88',
//       transactionHash: '0x5fc3c1f58398d2701630698197adf85f82dc343cde122eac2fe00fa77a29c047',
//       transactionIndex: 172,
//       logIndex: 276,
//       removed: false
//     }
//   ],
//   logsBloom: '0x00000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000080000010000000000000000000000000000010000000000000004000000000000000000000000080000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000008000000000000',
//   transactionHash: '0x5fc3c1f58398d2701630698197adf85f82dc343cde122eac2fe00fa77a29c047',
//   transactionIndex: 172,
//   blockHash: '0xcd052a21fbc366ec026dd21abff61eca9adc9ce42582b26a458a9062225c1a50',
//   blockNumber: 8830833n,
//   gasUsed: 34325n,
//   effectiveGasPrice: 1610256n,
//   from: '0xbd61c00e4b7c2a77cd660304ddd852379f705ed6',
//   to: '0x7b79995e5f793a07bc00c21412e50ecae098e7f9',
//   contractAddress: null
// }
// 转账后WETH持仓: 0.001
