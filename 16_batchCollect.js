import { ethers } from "ethers";
import { providerSepoliaAlchemy as provider, walletSepoliaAlchemy as wallet } from "./0_init.js";

// 1. 创建HD钱包
console.log("1. 创建HD钱包")
// 通过助记词生成HD钱包
const mnemonic = `air organ twist rule prison symptom jazz cheap rather dizzy verb glare jeans orbit weapon universe require tired sing casino business anxiety seminar hunt`
const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic)
console.log("主HD钱包地址:", hdNode.address);

// 2. 派生20个子钱包地址
console.log("2. 通过HD钱包派生20个子钱包")
const numWallet = 20
// 派生路径：m / purpose' / coin_type' / account' / change / address_index
// 使用标准BIP44路径派生子钱包
let addresses = [];
let childWallets = []; // 存储子钱包对象
for (let i = 0; i < numWallet; i++) {
    // 使用deriveChild方法，从当前HD节点派生子钱包
    const childNode = hdNode.deriveChild(i);
    addresses.push(childNode.address);
    // 创建子钱包对象，用于签名交易
    const childWallet = new ethers.Wallet(childNode.privateKey, provider);
    childWallets.push(childWallet);
    console.log(`子钱包 ${i}: ${childNode.address}`);
}
console.log("所有派生地址:", addresses);

// 3. 创建provider和主钱包，用于接收ETH
console.log("3. 创建provider和主钱包")
console.log("主钱包地址:", wallet.address);

// 4. 批量归集ETH
const main = async () => {
    try {
        console.log("4. 检查各子钱包ETH余额")
        let totalBalance = ethers.parseEther("0");
        let walletsWithBalance = [];
        
        // 检查每个子钱包的余额
        for (let i = 0; i < addresses.length; i++) {
            const balance = await provider.getBalance(addresses[i]);
            console.log(`子钱包 ${i} 余额: ${ethers.formatEther(balance)} ETH`);
            
            if (balance > ethers.parseEther("0.0001")) { // 只归集有足够余额的钱包
                walletsWithBalance.push({
                    index: i,
                    address: addresses[i],
                    wallet: childWallets[i],
                    balance: balance
                });
                totalBalance += balance;
            }
        }
        
        console.log(`总可归集余额: ${ethers.formatEther(totalBalance)} ETH`);
        console.log(`有余额的钱包数量: ${walletsWithBalance.length}`);
        
        if (walletsWithBalance.length === 0) {
            console.log("没有找到有足够余额的钱包进行归集");
            return;
        }
        
        console.log("5. 开始批量归集ETH")
        
        for (let i = 0; i < walletsWithBalance.length; i++) {
            const walletInfo = walletsWithBalance[i];
            const childWallet = walletInfo.wallet;
            const balance = walletInfo.balance;
            
            // 计算转账金额（保留一些ETH作为gas费用）
            const gasEstimate = ethers.parseEther("0.001"); // 预估gas费用
            const transferAmount = balance - gasEstimate;
            
            if (transferAmount <= 0) {
                console.log(`子钱包 ${walletInfo.index} 余额不足支付gas费用，跳过`);
                continue;
            }
            
            console.log(`正在归集子钱包 ${walletInfo.index}: ${walletInfo.address}`);
            console.log(`转账金额: ${ethers.formatEther(transferAmount)} ETH`);
            
            try {
                const tx = await childWallet.sendTransaction({
                    to: wallet.address,
                    value: transferAmount
                });
                
                console.log(`交易已发送，哈希: ${tx.hash}`);
                await tx.wait(); // 等待交易上链
                console.log(`交易已确认！`);
                
            } catch (error) {
                console.error(`子钱包 ${walletInfo.index} 归集失败:`, error.message);
            }
        }
        
        // 检查归集后的主钱包余额
        const finalBalance = await provider.getBalance(wallet.address);
        console.log(`✅ 批量归集完成！`);
        console.log(`主钱包最终余额: ${ethers.formatEther(finalBalance)} ETH`);
        
    } catch (error) {
        console.error("归集过程中出现错误:", error.message);
        if (error.message.includes("insufficient funds")) {
            console.log("某些钱包余额不足支付gas费用");
        } else if (error.message.includes("network")) {
            console.log("网络连接问题，请检查API Key和网络设置");
        }
    }
}

main()