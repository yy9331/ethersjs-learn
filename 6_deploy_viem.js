import 'dotenv/config';
import { createWalletClient, createPublicClient, http, parseEther, formatEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import abiERC20 from "./6_abi_human_readable.json" assert { type: "json" };
import bytecodeERC20 from "./6_bytecode_ethersjs.js";

// 用私钥创建钱包对象
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
  const balanceETH = await publicClient.getBalance({ address });
  console.log(`钱包ETH余额: ${formatEther(balanceETH)}`);

  if (Number(formatEther(balanceETH)) > 0.002) {
    // 1. 部署ERC20合约
    console.log("1. 利用walletClient部署ERC20代币合约");
    const hash = await walletClient.deployContract({
      abi: abiERC20,
      bytecode: bytecodeERC20,
      args: ['CM2 Token', 'CM2']
    });
    console.log(`部署交易hash: ${hash}`);
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    const contractAddress = receipt.contractAddress;
    console.log(`合约地址: ${contractAddress}`);
    console.log("部署合约的交易详情：", receipt);

    // 2. 调用mint()函数，给自己地址mint 86768代币
    console.log("2. 调用mint()函数，给自己地址mint 86768代币");
    const hashMint = await walletClient.writeContract({
      address: contractAddress,
      abi: abiERC20,
      functionName: "mint",
      args: ["86768"]
    });
    console.log(`等待mint交易上链: ${hashMint}`);
    await publicClient.waitForTransactionReceipt({ hash: hashMint });

    // 查询合约信息
    const name = await publicClient.readContract({
      address: contractAddress,
      abi: abiERC20,
      functionName: "name"
    });
    const symbol = await publicClient.readContract({
      address: contractAddress,
      abi: abiERC20,
      functionName: "symbol"
    });
    const balance = await publicClient.readContract({
      address: contractAddress,
      abi: abiERC20,
      functionName: "balanceOf",
      args: [address]
    });
    const totalSupply = await publicClient.readContract({
      address: contractAddress,
      abi: abiERC20,
      functionName: "totalSupply"
    });
    console.log(`合约名称: ${name}`);
    console.log(`合约代号: ${symbol}`);
    console.log(`mint后地址中代币余额: ${balance}`);
    console.log(`代币总供给: ${totalSupply}`);

    // 3. 调用transfer()函数，给Vitalik转账1000代币
    console.log("3. 调用transfer()函数，给Vitalik转账1,000代币");
    const vitalik = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
    const hashTransfer = await walletClient.writeContract({
      address: contractAddress,
      abi: abiERC20,
      functionName: "transfer",
      args: [vitalik, "1000"]
    });
    console.log(`等待transfer交易上链: ${hashTransfer}`);
    await publicClient.waitForTransactionReceipt({ hash: hashTransfer });
    const vitalikBalance = await publicClient.readContract({
      address: contractAddress,
      abi: abiERC20,
      functionName: "balanceOf",
      args: [vitalik]
    });
    console.log(`Vitalik钱包中的代币余额: ${vitalikBalance}`);
  } else {
    // 如果ETH不足
    console.log("ETH不足，去水龙头领一些Sepolia ETH");
    console.log("1. chainlink水龙头: https://sepolia-faucet.pk910.de/");
    console.log("2. paradigm水龙头: https://cloud.google.com/application/web3/faucet/ethereum/sepolia");
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});