import { createWalletClient, createPublicClient, http, parseEther, formatEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

import dotenv from 'dotenv';
dotenv.config();

// 1. 创建随机钱包对象
const account1 = privateKeyToAccount('0x' + crypto.randomUUID().replace(/-/g, '').padEnd(64, '0')); // 随机私钥


// 2. 用私钥创建钱包对象（真实使用时请用你的私钥）
const account2 = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY);

console.log('私钥环境变量:', process.env.WALLET_PRIVATE_KEY);

// 3. 创建客户端
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http()
});
const walletClient = createWalletClient({
  account: account2,
  chain: sepolia,
  transport: http()
});

const main = async () => {
  // 1. 获取钱包地址
  const address1 = account1.address;
  const address2 = account2.address;
  console.log(`1. 获取钱包地址`);
  console.log(`钱包1地址: ${address1}`);
  console.log(`钱包2地址: ${address2}`);

  // 4. 获取链上发送交易次数
  console.log(`4. 获取链上交易次数`);
  const exCount1 = await publicClient.getTransactionCount({ address: address1 });
  const exCount2 = await publicClient.getTransactionCount({ address: address2 });
  console.log('钱包1交易次数', exCount1);
  console.log('钱包2交易次数', exCount2);

  // 5. 发送ETH
  // i. 打印交易前余额
  console.log(`i. 发送前余额`);
  console.log(`钱包1: ${formatEther(await publicClient.getBalance({ address: address1 }))} ETH`);
  console.log(`钱包2: ${formatEther(await publicClient.getBalance({ address: address2 }))} ETH`);

  // ii. 构造交易请求
  const tx = {
    to: address1,
    value: parseEther("0.001")
  };

  // iii. 发送交易
  console.log(`\nii. 等待交易在区块链确认（需要几分钟）`);
  const hash = await walletClient.sendTransaction(tx);
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log(receipt);

  // iv. 打印交易后余额
  console.log(`\niii. 发送后余额`);
  console.log(`钱包1: ${formatEther(await publicClient.getBalance({ address: address1 }))} ETH`);
  console.log(`钱包2: ${formatEther(await publicClient.getBalance({ address: address2 }))} ETH`);
};

main();
// [dotenv@17.0.1] injecting env (8) from .env – [tip] encrypt with dotenvx: https://dotenvx.com
// 私钥环境变量: 0x599cdde4ca340c67fcdec819d3946001abb37a1426d0e071ab434b71881db9f3
// 1. 获取钱包地址
// 钱包1地址: 0xCad92131f695b957a910Eb51CBdC73a71465DA93
// 钱包2地址: 0xbd61c00E4B7C2a77Cd660304ddd852379F705ED6
// 4. 获取链上交易次数
// 钱包1交易次数 0
// 钱包2交易次数 149
// i. 发送前余额
// 钱包1: 0 ETH
// 钱包2: 1.29835337962981205 ETH

// ii. 等待交易在区块链确认（需要几分钟）
// {
//   type: 'eip1559',
//   status: 'success',
//   cumulativeGasUsed: 40406216n,
//   logs: [],
//   logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
//   transactionHash: '0x7a59760ada4dfbb85771a649fa8a14324bf8d2acf52bdf1b00c66e959061df3f',
//   transactionIndex: 177,
//   blockHash: '0xbe128a73ce484aee501865dd0d329b6aa6d10985af67a858a21edc7652343aa3',
//   blockNumber: 8830638n,
//   gasUsed: 21000n,
//   effectiveGasPrice: 1350100n,
//   from: '0xbd61c00e4b7c2a77cd660304ddd852379f705ed6',
//   to: '0xcad92131f695b957a910eb51cbdc73a71465da93',
//   contractAddress: null
// }

// iii. 发送后余额
// 钱包1: 0.001 ETH
// 钱包2: 1.29735335127771205 ETH