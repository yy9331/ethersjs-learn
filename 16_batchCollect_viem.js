import { createPublicClient, createWalletClient, http, parseEther, formatEther } from "viem";
import { privateKeyToAccount, hdKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { HDKey } from "@scure/bip32";
import { mnemonicToSeed } from "@scure/bip39";
import dotenv from "dotenv";
dotenv.config();

// 1. 创建HD钱包
console.log("1. 创建HD钱包");
// 通过助记词生成HD钱包
const mnemonic = `air organ twist rule prison symptom jazz cheap rather dizzy verb glare jeans orbit weapon universe require tired sing casino business anxiety seminar hunt`;
const seed = await mnemonicToSeed(mnemonic);
const hdKey = HDKey.fromMasterSeed(seed);
const hdNode = hdKeyToAccount(hdKey, { path: "m/44'/60'/0'/0" });
console.log("主HD钱包地址:", hdNode.address);

// 2. 派生20个子钱包地址
console.log("2. 通过HD钱包派生20个子钱包");
const numWallet = 20;
// 派生路径：m / purpose' / coin_type' / account' / change / address_index
// 使用标准BIP44路径派生子钱包
let addresses = [];
let childWallets = []; // 存储子钱包对象
for (let i = 0; i < numWallet; i++) {
    const derivePath = `m/44'/60'/0'/0/${i}`;
    const childWallet = hdKeyToAccount(hdKey, { path: derivePath });
    addresses.push(childWallet.address);
    childWallets.push(childWallet);
    console.log(`子钱包 ${i}: ${childWallet.address}`);
}
console.log("所有派生地址:", addresses);

// 3. 创建客户端和主钱包，用于接收ETH
console.log("3. 创建客户端和主钱包");
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

console.log("主钱包地址:", account.address);

// 4. 批量归集ETH
const main = async () => {
    try {
        console.log("4. 检查各子钱包ETH余额");
        let totalBalance = parseEther("0");
        let walletsWithBalance = [];
        
        // 检查每个子钱包的余额
        for (let i = 0; i < addresses.length; i++) {
            const balance = await publicClient.getBalance({ address: addresses[i] });
            console.log(`子钱包 ${i} 余额: ${formatEther(balance)} ETH`);
            
            if (balance > parseEther("0.0001")) { // 只归集有足够余额的钱包
                walletsWithBalance.push({
                    index: i,
                    address: addresses[i],
                    wallet: childWallets[i],
                    balance: balance
                });
                totalBalance += balance;
            }
        }
        
        console.log(`总可归集余额: ${formatEther(totalBalance)} ETH`);
        console.log(`有余额的钱包数量: ${walletsWithBalance.length}`);
        
        if (walletsWithBalance.length === 0) {
            console.log("没有找到有足够余额的钱包进行归集");
            return;
        }
        
        console.log("5. 开始批量归集ETH");
        
        for (let i = 0; i < walletsWithBalance.length; i++) {
            const walletInfo = walletsWithBalance[i];
            const childWallet = walletInfo.wallet;
            const balance = walletInfo.balance;
            
            // 计算转账金额（保留一些ETH作为gas费用）
            const gasEstimate = parseEther("0.001"); // 预估gas费用
            const transferAmount = balance - gasEstimate;
            
            if (transferAmount <= 0) {
                console.log(`子钱包 ${walletInfo.index} 余额不足支付gas费用，跳过`);
                continue;
            }
            
            console.log(`正在归集子钱包 ${walletInfo.index}: ${walletInfo.address}`);
            console.log(`转账金额: ${formatEther(transferAmount)} ETH`);
            
            try {
                // 为子钱包创建钱包客户端
                const childWalletClient = createWalletClient({
                    account: childWallet,
                    chain: sepolia,
                    transport: http()
                });
                
                const hash = await childWalletClient.sendTransaction({
                    to: account.address,
                    value: transferAmount
                });
                
                console.log(`交易已发送，哈希: ${hash}`);
                const receipt = await publicClient.waitForTransactionReceipt({ hash });
                console.log(`交易已确认！区块号: ${receipt.blockNumber}`);
                
            } catch (error) {
                console.error(`子钱包 ${walletInfo.index} 归集失败:`, error.message);
            }
        }
        
        // 检查归集后的主钱包余额
        const finalBalance = await publicClient.getBalance({ address: account.address });
        console.log(`✅ 批量归集完成！`);
        console.log(`主钱包最终余额: ${formatEther(finalBalance)} ETH`);
        
    } catch (error) {
        console.error("归集过程中出现错误:", error.message);
        if (error.message.includes("insufficient funds")) {
            console.log("某些钱包余额不足支付gas费用");
        } else if (error.message.includes("network")) {
            console.log("网络连接问题，请检查API Key和网络设置");
        }
    }
};

main();
// 1. 创建HD钱包
// 主HD钱包地址: 0x70D236C8Ea6f4DCF7a02cd888c55FDDFdf7420f0
// 2. 通过HD钱包派生20个子钱包
// 子钱包 0: 0x83E5B09c54C4EB904B9bC842Acab9218c2297d6d
// 子钱包 1: 0xF44F814ABa3e6BC091487Cf313B49F109550d086
// 子钱包 2: 0xC08A302438EaA60adE93196A527A837AA1CA5A3f
// 子钱包 3: 0x57171534c9616bB635351deB9d4AA009Fc0d6931
// 子钱包 4: 0xFECb70fD6b9414ff7B58C6989D44AFA4a0511D6d
// 子钱包 5: 0x897366fBfD8505dE0D772e2F34CF99ac692a9B15
// 子钱包 6: 0x5412DD89dD6B707fA816a3b8E0BDFe44A46CA152
// 子钱包 7: 0x9c85ee2fFB694A161b59D697ca560Aa2e1a98E6E
// 子钱包 8: 0xaBEC7899686e8FE4658bcce8391Fb4e3A70C8868
// 子钱包 9: 0x7610CfA2931e9D36CD1aF96599a5ed7886561147
// 子钱包 10: 0x74777aa4D53DEA221d77227d11dbBAF04d5459bd
// 子钱包 11: 0xAd95229F0698A25F82A84d357Fd8Ec92933B9A81
// 子钱包 12: 0x49337ecB753e6a3D978Da1201A79700b6a821b2f
// 子钱包 13: 0xb251d26E28440c3de341c034b1328BC59cD289aB
// 子钱包 14: 0xE51D657853b01C0fb38c592582592Ac7673C5408
// 子钱包 15: 0xf1444E7cF5562494ac4950296B47984609920ad2
// 子钱包 16: 0xb5E174a5A2daa4fE7457dfe5b7a3c80eD6c594eF
// 子钱包 17: 0x8d63756989286D017C54799A02A1A7E8664C9bfC
// 子钱包 18: 0xB97416ea3178980585456DF861263a31d5DD8EB9
// 子钱包 19: 0xD16a44745C18e493c10f79147EA5dDb54a083062
// 所有派生地址: [
//   '0x83E5B09c54C4EB904B9bC842Acab9218c2297d6d',
//   '0xF44F814ABa3e6BC091487Cf313B49F109550d086',
//   '0xC08A302438EaA60adE93196A527A837AA1CA5A3f',
//   '0x57171534c9616bB635351deB9d4AA009Fc0d6931',
//   '0xFECb70fD6b9414ff7B58C6989D44AFA4a0511D6d',
//   '0x897366fBfD8505dE0D772e2F34CF99ac692a9B15',
//   '0x5412DD89dD6B707fA816a3b8E0BDFe44A46CA152',
//   '0x9c85ee2fFB694A161b59D697ca560Aa2e1a98E6E',
//   '0xaBEC7899686e8FE4658bcce8391Fb4e3A70C8868',
//   '0x7610CfA2931e9D36CD1aF96599a5ed7886561147',
//   '0x74777aa4D53DEA221d77227d11dbBAF04d5459bd',
//   '0xAd95229F0698A25F82A84d357Fd8Ec92933B9A81',
//   '0x49337ecB753e6a3D978Da1201A79700b6a821b2f',
//   '0xb251d26E28440c3de341c034b1328BC59cD289aB',
//   '0xE51D657853b01C0fb38c592582592Ac7673C5408',
//   '0xf1444E7cF5562494ac4950296B47984609920ad2',
//   '0xb5E174a5A2daa4fE7457dfe5b7a3c80eD6c594eF',
//   '0x8d63756989286D017C54799A02A1A7E8664C9bfC',
//   '0xB97416ea3178980585456DF861263a31d5DD8EB9',
//   '0xD16a44745C18e493c10f79147EA5dDb54a083062'
// ]
// 3. 创建客户端和主钱包
// 主钱包地址: 0xbd61c00E4B7C2a77Cd660304ddd852379F705ED6
// 4. 检查各子钱包ETH余额
// 子钱包 0 余额: 0.0001 ETH
// 子钱包 1 余额: 0.0001 ETH
// 子钱包 2 余额: 0.0001 ETH
// 子钱包 3 余额: 0.0001 ETH
// 子钱包 4 余额: 0.0001 ETH
// 子钱包 5 余额: 0.0001 ETH
// 子钱包 6 余额: 0.0001 ETH
// 子钱包 7 余额: 0.0001 ETH
// 子钱包 8 余额: 0.0001 ETH
// 子钱包 9 余额: 0.0001 ETH
// 子钱包 10 余额: 0.0001 ETH
// 子钱包 11 余额: 0.0001 ETH
// 子钱包 12 余额: 0.0001 ETH
// 子钱包 13 余额: 0.0001 ETH
// 子钱包 14 余额: 0.0001 ETH
// 子钱包 15 余额: 0.0001 ETH
// 子钱包 16 余额: 0.0001 ETH
// 子钱包 17 余额: 0.0001 ETH
// 子钱包 18 余额: 0.0001 ETH
// 子钱包 19 余额: 0.0001 ETH
// 总可归集余额: 0 ETH
// 有余额的钱包数量: 0
// 没有找到有足够余额的钱包进行归集