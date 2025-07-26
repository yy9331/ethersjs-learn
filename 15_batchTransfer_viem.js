import { createPublicClient, createWalletClient, http, parseEther, formatEther } from "viem";
import { privateKeyToAccount, mnemonicToAccount, hdKeyToAccount } from "viem/accounts";
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
const baseWallet = hdKeyToAccount(hdKey, { path: "m/44'/60'/0'/0" });
console.log("主HD钱包地址:", baseWallet.address);

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

// 3. 创建客户端和主钱包，用于发送ETH
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

// 4. 批量转账ETH
const main = async () => {
    try {
        console.log("4. 检查主钱包ETH余额");
        const balance = await publicClient.getBalance({ address: account.address });
        console.log(`主钱包ETH余额: ${formatEther(balance)} ETH`);
        
        // 计算需要的总ETH（20个地址 * 0.0001 ETH + gas费用）
        const transferAmount = parseEther("0.0001");
        const totalNeeded = transferAmount * BigInt(numWallet) + parseEther("0.001"); // 额外0.001作为gas
        
        if (balance < totalNeeded) {
            console.log("ETH余额不足，无法进行批量转账");
            console.log("请使用水龙头获取测试ETH:");
            console.log("1. Sepolia水龙头: https://sepoliafaucet.com/");
            console.log("2. Alchemy水龙头: https://sepoliafaucet.com/");
            return;
        }
        
        console.log("5. 开始批量转账ETH");
        const amount = parseEther("0.0001");
        
        for (let i = 0; i < addresses.length; i++) {
            console.log(`正在转账给地址 ${i + 1}/${numWallet}: ${addresses[i]}`);
            
            const hash = await walletClient.sendTransaction({
                to: addresses[i],
                value: amount
            });
            
            console.log(`交易已发送，哈希: ${hash}`);
            const receipt = await publicClient.waitForTransactionReceipt({ hash });
            console.log(`交易已确认！区块号: ${receipt.blockNumber}`);
        }
        
        console.log("✅ 批量转账完成！");
        console.log(`已成功给 ${numWallet} 个地址各转账 0.0001 ETH`);
        
    } catch (error) {
        console.error("转账过程中出现错误:", error.message);
        if (error.message.includes("insufficient funds")) {
            console.log("ETH余额不足，请检查钱包余额");
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
// 4. 检查主钱包ETH余额
// 主钱包ETH余额: 1.29233789959967173 ETH
// 5. 开始批量转账ETH
// 正在转账给地址 1/20: 0x83E5B09c54C4EB904B9bC842Acab9218c2297d6d
// 交易已发送，哈希: 0xfe456fd281e9080d25d1382c054729f23ffb810d01bb2751b05c2bf779252a68
// 交易已确认！区块号: 8843551
// 正在转账给地址 2/20: 0xF44F814ABa3e6BC091487Cf313B49F109550d086
// 交易已发送，哈希: 0xc361fd4ad379bd293e822e9f3582b27ec3cc39b66291ec17aad323dc0ade90aa
// 交易已确认！区块号: 8843552
// 正在转账给地址 3/20: 0xC08A302438EaA60adE93196A527A837AA1CA5A3f
// 交易已发送，哈希: 0xa2ff225ef702603beb012229e1057e2e3d21adc3738a35a14f205eb37f794513
// 交易已确认！区块号: 8843553
// 正在转账给地址 4/20: 0x57171534c9616bB635351deB9d4AA009Fc0d6931
// 交易已发送，哈希: 0x0e7da99b994fa4c5cb140e22b071c00ae50fca1a57170ad31853139d1f21c837
// 交易已确认！区块号: 8843554
// 正在转账给地址 5/20: 0xFECb70fD6b9414ff7B58C6989D44AFA4a0511D6d
// 交易已发送，哈希: 0x817a2e8f9f6ee986a4c88a6dbf39d3d21bdb8b5e14321999969e55123877c980
// 交易已确认！区块号: 8843555
// 正在转账给地址 6/20: 0x897366fBfD8505dE0D772e2F34CF99ac692a9B15
// 交易已发送，哈希: 0x0378ef3522bcaf44090e281fccdd0ee6c30ee67f52117dd7130e70583ea3951e
// 交易已确认！区块号: 8843556
// 正在转账给地址 7/20: 0x5412DD89dD6B707fA816a3b8E0BDFe44A46CA152
// 交易已发送，哈希: 0x122826e288fb59dcc8e8972aca19661f8b4b12d8f1c2ede33681614d8e93f7a3
// 交易已确认！区块号: 8843557
// 正在转账给地址 8/20: 0x9c85ee2fFB694A161b59D697ca560Aa2e1a98E6E
// 交易已发送，哈希: 0x236d213ffec6dca2ae573d058d86df4c480e1272b60c31378357f2795a27c239
// 交易已确认！区块号: 8843558
// 正在转账给地址 9/20: 0xaBEC7899686e8FE4658bcce8391Fb4e3A70C8868
// 交易已发送，哈希: 0xeb408e300721356d57c58fbf9d5760e1627dc8a3db6e61bbc8a58a6953baac9a
// 交易已确认！区块号: 8843559
// 正在转账给地址 10/20: 0x7610CfA2931e9D36CD1aF96599a5ed7886561147
// 交易已发送，哈希: 0x423565129582713f6a1714170613cd152033d8adf6771e1a779877d4d59d8b13
// 交易已确认！区块号: 8843560
// 正在转账给地址 11/20: 0x74777aa4D53DEA221d77227d11dbBAF04d5459bd
// 交易已发送，哈希: 0x7ef695148342690b172765da621e240c9441325e8ae8c168e590f21ba61292cc
// 交易已确认！区块号: 8843561
// 正在转账给地址 12/20: 0xAd95229F0698A25F82A84d357Fd8Ec92933B9A81
// 交易已发送，哈希: 0xccd80ba9e9dc221ff004779a409e347f06cb1d76c22f61111aaafc7cc01326a8
// 交易已确认！区块号: 8843562
// 正在转账给地址 13/20: 0x49337ecB753e6a3D978Da1201A79700b6a821b2f
// 交易已发送，哈希: 0xd54e3ba397fd0c59c7b94db9eafb55cd90f68cc38779a61f5aba6ad0bc3426d6
// 交易已确认！区块号: 8843563
// 正在转账给地址 14/20: 0xb251d26E28440c3de341c034b1328BC59cD289aB
// 交易已发送，哈希: 0xf47d672ba84937fe40675ccdbbf11af523067d8073a59104edc1ca8ee1bef5a4
// 交易已确认！区块号: 8843564
// 正在转账给地址 15/20: 0xE51D657853b01C0fb38c592582592Ac7673C5408
// 交易已发送，哈希: 0x7c06ed193169263d41191bc17ec43f0797d9eb6a2b9ebddad2e870ecc90f5cf7
// 交易已确认！区块号: 8843565
// 正在转账给地址 16/20: 0xf1444E7cF5562494ac4950296B47984609920ad2
// 交易已发送，哈希: 0xc5aa06e674a38f79d82e2052d3de8fc6ba2a4ef85c7c0e1d0319c981c6c8d21d
// 交易已确认！区块号: 8843566
// 正在转账给地址 17/20: 0xb5E174a5A2daa4fE7457dfe5b7a3c80eD6c594eF
// 交易已发送，哈希: 0x65827a1b9724c68ecf97fbdbd0453a2015a2bb9133489ffb20fa097dcdf55d74
// 交易已确认！区块号: 8843567
// 正在转账给地址 18/20: 0x8d63756989286D017C54799A02A1A7E8664C9bfC
// 交易已发送，哈希: 0x9d55b630b1441c0844c8fb97de9f93e93dcf91cf71cab725986f0f077248d97f
// 交易已确认！区块号: 8843568
// 正在转账给地址 19/20: 0xB97416ea3178980585456DF861263a31d5DD8EB9
// 交易已发送，哈希: 0x13fb5b4ac548e0cf37c6c3f065a1d449f467a84a9f8feaafa7ee337b4b526009
// 交易已确认！区块号: 8843570
// 正在转账给地址 20/20: 0xD16a44745C18e493c10f79147EA5dDb54a083062
// 交易已发送，哈希: 0xaf19891801b73690973f4aa288f6c381b758edc01cda4b332507617123bbddc4
// 交易已确认！区块号: 8843571
// ✅ 批量转账完成！
// 已成功给 20 个地址各转账 0.0001 ETH