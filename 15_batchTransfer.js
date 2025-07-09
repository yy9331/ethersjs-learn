import { ethers } from "ethers";
import { providerSepoliaAlchemy as provider, walletSepoliaAlchemy as wallet } from "./0_init.js";

// 1. 创建HD钱包
console.log("\n1. 创建HD钱包")
// 通过助记词生成HD钱包
const mnemonic = `air organ twist rule prison symptom jazz cheap rather dizzy verb glare jeans orbit weapon universe require tired sing casino business anxiety seminar hunt`
const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic)
console.log("主HD钱包地址:", hdNode.address);

// 2. 派生20个子钱包地址
console.log("\n2. 通过HD钱包派生20个子钱包")
const numWallet = 20
// 派生路径：m / purpose' / coin_type' / account' / change / address_index
// 使用标准BIP44路径派生子钱包
let addresses = [];
for (let i = 0; i < numWallet; i++) {
    // 使用deriveChild方法，从当前HD节点派生子钱包
    const childNode = hdNode.deriveChild(i);
    addresses.push(childNode.address);
    console.log(`子钱包 ${i}: ${childNode.address}`);
}
console.log("所有派生地址:", addresses);

// 3. 创建provider和主钱包，用于发送ETH
console.log("3. 创建provider和主钱包")
console.log(provider)

// 利用私钥和provider创建wallet对象
console.log("主钱包地址:", wallet.address);

// 4. 批量转账ETH
const main = async () => {
    try {
        console.log("\n4. 检查主钱包ETH余额")
        const balance = await provider.getBalance(wallet.address);
        console.log(`主钱包ETH余额: ${ethers.formatEther(balance)} ETH`);
        
        // 计算需要的总ETH（20个地址 * 0.0001 ETH + gas费用）
        const transferAmount = ethers.parseEther("0.0001");
        const totalNeeded = transferAmount * BigInt(numWallet) + ethers.parseEther("0.001"); // 额外0.001作为gas
        
        if (balance < totalNeeded) {
            console.log("ETH余额不足，无法进行批量转账");
            console.log("请使用水龙头获取测试ETH:");
            console.log("1. Sepolia水龙头: https://sepoliafaucet.com/");
            console.log("2. Alchemy水龙头: https://sepoliafaucet.com/");
            return;
        }
        
        console.log("\n5. 开始批量转账ETH")
        const amount = ethers.parseEther("0.0001");
        
        for (let i = 0; i < addresses.length; i++) {
            console.log(`正在转账给地址 ${i + 1}/${numWallet}: ${addresses[i]}`);
            
            const tx = await wallet.sendTransaction({
                to: addresses[i],
                value: amount
            });
            
            console.log(`交易已发送，哈希: ${tx.hash}`);
            await tx.wait(); // 等待交易上链
            console.log(`交易已确认！`);
        }
        
        console.log("\n✅ 批量转账完成！");
        console.log(`已成功给 ${numWallet} 个地址各转账 0.0001 ETH`);
        
    } catch (error) {
        console.error("转账过程中出现错误:", error.message);
        if (error.message.includes("insufficient funds")) {
            console.log("ETH余额不足，请检查钱包余额");
        } else if (error.message.includes("network")) {
            console.log("网络连接问题，请检查API Key和网络设置");
        }
    }
}

main()