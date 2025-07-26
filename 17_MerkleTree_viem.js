import { createPublicClient, createWalletClient, http, formatEther, keccak256 } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { MerkleTree } from "merkletreejs";
import contractJson from './17_contract.json' assert { type: 'json' };
import dotenv from "dotenv";
dotenv.config();

console.log("=== 默克尔树NFT铸造系统 (Viem) ===");

// 1. 生成默克尔树
console.log("1. 生成默克尔树");
// 白名单地址
const whitelistAddresses = [
    "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", 
    "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
    "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
    "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB"
];

// 生成叶子节点（地址的哈希）
const leaves = whitelistAddresses.map(x => keccak256(x));
const merkletree = new MerkleTree(leaves, keccak256, { sortPairs: true });
const root = merkletree.getHexRoot();

console.log("白名单地址:");
console.log(whitelistAddresses);
console.log("默克尔根:", root);

// 2. 验证地址是否在白名单中
function verifyWhitelist(address) {
    const leaf = keccak256(address);
    const proof = merkletree.getHexProof(leaf);
    // * 关键 merkle tree 验证步骤, .verify API, 传入的参数:
    // * 1. 该地址的验证证明, .getHexProof(keccak256(addr)) , 该地址必须经keccak256编码后, 再用 merkletree 的getHexProof 16进制的编码 
    // * 2. 叶子节点经过 keccak256 编码的hash值
    // * 3. 根节点哈希值, 由 .getHexRoot() 生成
    const isValid = merkletree.verify(proof, leaf, root); 
    
    console.log(`验证地址: ${address}`);
    console.log(`叶子节点: ${leaf}`);
    console.log(`默克尔证明: ${JSON.stringify(proof)}`);
    console.log(`是否在白名单中: ${isValid}`);
    
    return { isValid, proof };
}

// 3. 测试验证功能
console.log("2. 测试白名单验证");
const testAddresses = [
    "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", // 在白名单中
    "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", // 在白名单中
    "0x1234567890123456789012345678901234567890"   // 不在白名单中
];

testAddresses.forEach(address => {
    verifyWhitelist(address);
});

// 4. 从JSON文件获取合约信息
const bytecodeNFT = contractJson.data.bytecode.object;
const abiNFT = contractJson.abi;

console.log("3. 合约信息");
console.log("字节码长度:", bytecodeNFT.length);
console.log("字节码是否以0x开头:", bytecodeNFT.startsWith("0x"));
console.log("ABI函数数量:", abiNFT.length);

// 5. 主要功能
const main = async () => {
    try {
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

        console.log("4. 检查钱包余额");
        const balanceETH = await publicClient.getBalance({ address: account.address });
        console.log("钱包余额:", formatEther(balanceETH), "ETH");
        
        if (bytecodeNFT.length === 0) {
            console.log("⚠️  字节码为空，请检查JSON文件");
            return;
        }
        
        console.log("5. 部署NFT合约");
        
        // 部署参数：合约名称、符号、默克尔根
        const contractName = "MerkleNFT";
        const contractSymbol = "MNFT";
        
        console.log("部署参数:");
        console.log("- 名称:", contractName);
        console.log("- 符号:", contractSymbol);
        console.log("- 默克尔根:", root);
        
        const hash = await walletClient.deployContract({
            abi: abiNFT,
            bytecode: bytecodeNFT,
            args: [contractName, contractSymbol, root]
        });
        
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        const contractAddress = receipt.contractAddress;
        console.log("✅ 合约部署成功！地址:", contractAddress);
        
        console.log("6. 铸造NFT");
        const tokenId = 1;
        const mintToAddress = whitelistAddresses[0]; // 使用白名单中的第一个地址
        
        // 获取该地址的默克尔证明
        const { isValid, proof } = verifyWhitelist(mintToAddress);
        
        if (!isValid) {
            console.log("❌ 地址不在白名单中，无法铸造");
            return;
        }
        
        console.log("铸造参数:");
        console.log("- 接收地址:", mintToAddress);
        console.log("- Token ID:", tokenId);
        console.log("- 默克尔证明:", proof);
        
        const mintHash = await walletClient.writeContract({
            address: contractAddress,
            abi: abiNFT,
            functionName: "mint",
            args: [mintToAddress, tokenId, proof]
        });
        
        await publicClient.waitForTransactionReceipt({ hash: mintHash });
        console.log("✅ NFT铸造成功！");
        
        // 验证铸造结果
        const owner = await publicClient.readContract({
            address: contractAddress,
            abi: abiNFT,
            functionName: "ownerOf",
            args: [tokenId]
        });
        console.log("Token", tokenId, "的所有者:", owner);
        
        const balance = await publicClient.readContract({
            address: contractAddress,
            abi: abiNFT,
            functionName: "balanceOf",
            args: [mintToAddress]
        });
        console.log("地址", mintToAddress, "的NFT余额:", balance.toString());
        
        // 7. 测试非白名单地址铸造（应该失败）
        console.log("7. 测试非白名单地址铸造");
        const nonWhitelistAddress = "0x1234567890123456789012345678901234567890";
        const { proof: invalidProof } = verifyWhitelist(nonWhitelistAddress);
        
        try {
            const invalidMintHash = await walletClient.writeContract({
                address: contractAddress,
                abi: abiNFT,
                functionName: "mint",
                args: [nonWhitelistAddress, 2, invalidProof]
            });
            await publicClient.waitForTransactionReceipt({ hash: invalidMintHash });
            console.log("❌ 非白名单地址铸造成功（不应该发生）");
        } catch (error) {
            console.log("✅ 非白名单地址铸造失败（符合预期）");
            console.log("错误信息:", error.message);
        }
        
    } catch (error) {
        console.error("❌ 错误:", error);
    }
}

// 8. 离线验证功能（不依赖网络）
function offlineVerification() {
    console.log("8. 离线验证功能");
    
    // 验证所有白名单地址
    whitelistAddresses.forEach((address, index) => {
        const { isValid, proof } = verifyWhitelist(address);
        console.log(`地址 ${index + 1}: ${isValid ? '✅' : '❌'} ${address}`);
    });
    
    // 验证非白名单地址
    const nonWhitelistAddress = "0x1234567890123456789012345678901234567890";
    const { isValid } = verifyWhitelist(nonWhitelistAddress);
    console.log(`非白名单地址: ${isValid ? '❌' : '✅'} ${nonWhitelistAddress}`);
}

// 运行离线验证
offlineVerification();

// 运行主程序
main(); 


// 1. 创建HD钱包
// 生成的助记词： select snow wrap vote huge grief trip slim guitar law sheriff forget
// 基钱包： {
//   address: '0x51C7E19125a908c0b2f3Dd3EF049D671Fdb31951',
//   nonceManager: undefined,
//   sign: [AsyncFunction: sign],
//   signAuthorization: [AsyncFunction: signAuthorization],
//   signMessage: [AsyncFunction: signMessage],
//   signTransaction: [AsyncFunction: signTransaction],
//   signTypedData: [AsyncFunction: signTypedData],
//   source: 'hd',
//   type: 'local',
//   publicKey: '0x047bb3183863f62781bcaa982192a75eaf44a628bb60fc54c051b5589958d392f6889568ed193821dd6ebabf99f8771382a42b63c8e3b013550f4d4cba94f7fc4b',
//   getHdKey: [Function: getHdKey]
// }

// 2. 通过HD钱包派生20个钱包
// 第1个钱包地址： 0xd8c0ac12EFF23A0B608cc309e823Dc3E9207d067
// 第2个钱包地址： 0x59D154220ba9BF9323620c74cE801E73102822AA
// 第3个钱包地址： 0x7b8ED7fd49251F0A37948d0c9072AC8D3B5609e5
// 第4个钱包地址： 0x26932189F67E9735C05eB6a439b2dB54010fac3c
// 第5个钱包地址： 0x02ECcB2B321eCE2b144103e5D64FfFABfaF2f712
// 第6个钱包地址： 0xf925B2a432365a0e8BC54A13987eA66755AD6dAb
// 第7个钱包地址： 0xb14D11837d6846Bd624ee75e4a40282c82a51b5a
// 第8个钱包地址： 0xBEf0bc9C5C44717E32c343FFA5D413992b6365BA
// 第9个钱包地址： 0x7d67bf091129B7ced0e28e1c47866024b7D2f359
// 第10个钱包地址： 0xB5fd1CB08964A4d69ec3dc3853F5E2E7077DC20d
// 第11个钱包地址： 0x7DAAd60875fc5F0C2c26110EE1AE5a1634b561D1
// 第12个钱包地址： 0xD06fa97DB44c38359fFF4546Ea549c3b9D7C30B4
// 第13个钱包地址： 0x9B42Dd2749b7c1d1ba7d6Fe2DDA132e64676C023
// 第14个钱包地址： 0x8F16789DFF9835c789dD6d9bcbE64Ff8c17367ac
// 第15个钱包地址： 0xaa14D0D4C26cf222c11c09940407A741489F03DB
// 第16个钱包地址： 0xF0A0E3002A00de8E63399536932FfDbB4269EEA0
// 第17个钱包地址： 0x28478D4950E5222C2c2FBe68Fa7c156cCdDDeE89
// 第18个钱包地址： 0xa4fBb8DC34455019f2Ed1A391B926ff636389730
// 第19个钱包地址： 0xa557Cf041D541e5Bc185830b288BAcf028E853Ac
// 第20个钱包地址： 0xdb64a2d6E56E61B3920d6Ed4fefF3c98a90A3Ca9

// 3. 从助记词创建钱包
// 通过助记词创建钱包：
// {
//   address: '0xd8c0ac12EFF23A0B608cc309e823Dc3E9207d067',
//   nonceManager: undefined,
//   sign: [AsyncFunction: sign],
//   signAuthorization: [AsyncFunction: signAuthorization],
//   signMessage: [AsyncFunction: signMessage],
//   signTransaction: [AsyncFunction: signTransaction],
//   signTypedData: [AsyncFunction: signTypedData],
//   source: 'hd',
//   type: 'local',
//   publicKey: '0x045ffdc701186e220312a2da0c87500fc5498027636ed073877babb8bb6c90337a90f897fb09562c25616558fed6ac8c0095e9688775aaeeeb9d38579c16a00734',
//   getHdKey: [Function: getHdKey]
// }
// 钱包客户端： {
//   account: {
//     address: '0xd8c0ac12EFF23A0B608cc309e823Dc3E9207d067',
//     nonceManager: undefined,
//     sign: [AsyncFunction: sign],
//     signAuthorization: [AsyncFunction: signAuthorization],
//     signMessage: [AsyncFunction: signMessage],
//     signTransaction: [AsyncFunction: signTransaction],
//     signTypedData: [AsyncFunction: signTypedData],
//     source: 'hd',
//     type: 'local',
//     publicKey: '0x045ffdc701186e220312a2da0c87500fc5498027636ed073877babb8bb6c90337a90f897fb09562c25616558fed6ac8c0095e9688775aaeeeb9d38579c16a00734',
//     getHdKey: [Function: getHdKey]
//   },
//   batch: undefined,
//   cacheTime: 4000,
//   ccipRead: undefined,
//   chain: {
//     formatters: undefined,
//     fees: undefined,
//     serializers: undefined,
//     id: 11155111,
//     name: 'Sepolia',
//     nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
//     rpcUrls: { default: [Object] },
//     blockExplorers: { default: [Object] },
//     contracts: {
//       multicall3: [Object],
//       ensRegistry: [Object],
//       ensUniversalResolver: [Object]
//     },
//     testnet: true
//   },
//   key: 'wallet',
//   name: 'Wallet Client',
//   pollingInterval: 4000,
//   request: [AsyncFunction (anonymous)],
//   transport: {
//     key: 'http',
//     methods: undefined,
//     name: 'HTTP JSON-RPC',
//     request: [AsyncFunction: request],
//     retryCount: 3,
//     retryDelay: 150,
//     timeout: 10000,
//     type: 'http',
//     fetchOptions: undefined,
//     url: 'https://sepolia.drpc.org'
//   },
//   type: 'walletClient',
//   uid: 'e7cc63844b9',
//   extend: [Function (anonymous)],
//   addChain: [Function: addChain],
//   deployContract: [Function: deployContract],
//   getAddresses: [Function: getAddresses],
//   getCallsStatus: [Function: getCallsStatus],
//   getCapabilities: [Function: getCapabilities],
//   getChainId: [Function: getChainId],
//   getPermissions: [Function: getPermissions],
//   prepareAuthorization: [Function: prepareAuthorization],
//   prepareTransactionRequest: [Function: prepareTransactionRequest],
//   requestAddresses: [Function: requestAddresses],
//   requestPermissions: [Function: requestPermissions],
//   sendCalls: [Function: sendCalls],
//   sendRawTransaction: [Function: sendRawTransaction],
//   sendTransaction: [Function: sendTransaction],
//   showCallsStatus: [Function: showCallsStatus],
//   signAuthorization: [Function: signAuthorization],
//   signMessage: [Function: signMessage],
//   signTransaction: [Function: signTransaction],
//   signTypedData: [Function: signTypedData],
//   switchChain: [Function: switchChain],
//   waitForCallsStatus: [Function: waitForCallsStatus],
//   watchAsset: [Function: watchAsset],
//   writeContract: [Function: writeContract]
// }

// 4. 生成随机私钥
// 随机私钥钱包： {
//   address: '0xd8c0ac12EFF23A0B608cc309e823Dc3E9207d067',
//   nonceManager: undefined,
//   sign: [AsyncFunction: sign],
//   signAuthorization: [AsyncFunction: signAuthorization],
//   signMessage: [AsyncFunction: signMessage],
//   signTransaction: [AsyncFunction: signTransaction],
//   signTypedData: [AsyncFunction: signTypedData],
//   source: 'hd',
//   type: 'local',
//   publicKey: '0x045ffdc701186e220312a2da0c87500fc5498027636ed073877babb8bb6c90337a90f897fb09562c25616558fed6ac8c0095e9688775aaeeeb9d38579c16a00734',
//   getHdKey: [Function: getHdKey]
// }

// 5. 演示不同路径的钱包派生
// 路径 m/44'/60'/0'/0/0: 0xd8c0ac12EFF23A0B608cc309e823Dc3E9207d067
// 路径 m/44'/60'/0'/0/1: 0x59D154220ba9BF9323620c74cE801E73102822AA
// 路径 m/44'/60'/0'/1/0: 0xDAFA122215f6b4D5fcAdeB7BB919F7A2852B588D
// 路径 m/44'/60'/1'/0/0: 0x7EEE43aDdEA58C6659614EdE5692e121CE19BB8c
// (base) ➜  etherjs-viem-learn git:(main) ✗ node 15_batchTransfer_viem.js
// [dotenv@17.0.1] injecting env (8) from .env – [tip] encrypt with dotenvx: https://dotenvx.com
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
// (base) ➜  etherjs-viem-learn git:(main) ✗ node 16_batchCollect_viem.js
// [dotenv@17.0.1] injecting env (8) from .env – [tip] encrypt with dotenvx: https://dotenvx.com
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
// (base) ➜  etherjs-viem-learn git:(main) ✗ node 17_MerkleTree_viem.js
// (node:65510) ExperimentalWarning: Importing JSON modules is an experimental feature and might change at any time
// (Use `node --trace-warnings ...` to show where the warning was created)
// [dotenv@17.0.1] injecting env (8) from .env – [tip] encrypt with dotenvx: https://dotenvx.com
// === 默克尔树NFT铸造系统 (Viem) ===
// 1. 生成默克尔树
// 白名单地址:
// [
//   '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4',
//   '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2',
//   '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db',
//   '0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB'
// ]
// 默克尔根: 0xeeefd63003e0e702cb41cd0043015a6e26ddb38073cc6ffeb0ba3e808ba8c097
// 2. 测试白名单验证
// 验证地址: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
// 叶子节点: 0x5931b4ed56ace4c46b68524cb5bcbf4195f1bbaacbe5228fbd090546c88dd229
// 默克尔证明: ["0x999bf57501565dbd2fdcea36efa2b9aef8340a8901e3459f4a4c926275d36cdb","0x4726e4102af77216b09ccd94f40daa10531c87c4d60bba7f3b3faf5ff9f19b3c"]
// 是否在白名单中: true
// 验证地址: 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2
// 叶子节点: 0x999bf57501565dbd2fdcea36efa2b9aef8340a8901e3459f4a4c926275d36cdb
// 默克尔证明: ["0x5931b4ed56ace4c46b68524cb5bcbf4195f1bbaacbe5228fbd090546c88dd229","0x4726e4102af77216b09ccd94f40daa10531c87c4d60bba7f3b3faf5ff9f19b3c"]
// 是否在白名单中: true
// 验证地址: 0x1234567890123456789012345678901234567890
// 叶子节点: 0xb6979620706f8c652cfb6bf6e923f5156eadd5abaf4022a0b19d52ada089475f
// 默克尔证明: []
// 是否在白名单中: false
// 3. 合约信息
// 字节码长度: 19606
// 字节码是否以0x开头: false
// ABI函数数量: 21
// 8. 离线验证功能
// 验证地址: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
// 叶子节点: 0x5931b4ed56ace4c46b68524cb5bcbf4195f1bbaacbe5228fbd090546c88dd229
// 默克尔证明: ["0x999bf57501565dbd2fdcea36efa2b9aef8340a8901e3459f4a4c926275d36cdb","0x4726e4102af77216b09ccd94f40daa10531c87c4d60bba7f3b3faf5ff9f19b3c"]
// 是否在白名单中: true
// 地址 1: ✅ 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
// 验证地址: 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2
// 叶子节点: 0x999bf57501565dbd2fdcea36efa2b9aef8340a8901e3459f4a4c926275d36cdb
// 默克尔证明: ["0x5931b4ed56ace4c46b68524cb5bcbf4195f1bbaacbe5228fbd090546c88dd229","0x4726e4102af77216b09ccd94f40daa10531c87c4d60bba7f3b3faf5ff9f19b3c"]
// 是否在白名单中: true
// 地址 2: ✅ 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2
// 验证地址: 0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db
// 叶子节点: 0x04a10bfd00977f54cc3450c9b25c9b3a502a089eba0097ba35fc33c4ea5fcb54
// 默克尔证明: ["0xdfbe3e504ac4e35541bebad4d0e7574668e16fefa26cd4172f93e18b59ce9486","0x9d997719c0a5b5f6db9b8ac69a988be57cf324cb9fffd51dc2c37544bb520d65"]
// 是否在白名单中: true
// 地址 3: ✅ 0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db
// 验证地址: 0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB
// 叶子节点: 0xdfbe3e504ac4e35541bebad4d0e7574668e16fefa26cd4172f93e18b59ce9486
// 默克尔证明: ["0x04a10bfd00977f54cc3450c9b25c9b3a502a089eba0097ba35fc33c4ea5fcb54","0x9d997719c0a5b5f6db9b8ac69a988be57cf324cb9fffd51dc2c37544bb520d65"]
// 是否在白名单中: true
// 地址 4: ✅ 0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB
// 验证地址: 0x1234567890123456789012345678901234567890
// 叶子节点: 0xb6979620706f8c652cfb6bf6e923f5156eadd5abaf4022a0b19d52ada089475f
// 默克尔证明: []
// 是否在白名单中: false
// 非白名单地址: ✅ 0x1234567890123456789012345678901234567890
// 4. 检查钱包余额
// 钱包余额: 1.29033747959507273 ETH
// 5. 部署NFT合约
// 部署参数:
// - 名称: MerkleNFT
// - 符号: MNFT
// - 默克尔根: 0xeeefd63003e0e702cb41cd0043015a6e26ddb38073cc6ffeb0ba3e808ba8c097
// ✅ 合约部署成功！地址: 0xb1b2d9c6a5f2a6b904f257126dfe7d875f70cfd4
// 6. 铸造NFT
// 验证地址: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
// 叶子节点: 0x5931b4ed56ace4c46b68524cb5bcbf4195f1bbaacbe5228fbd090546c88dd229
// 默克尔证明: ["0x999bf57501565dbd2fdcea36efa2b9aef8340a8901e3459f4a4c926275d36cdb","0x4726e4102af77216b09ccd94f40daa10531c87c4d60bba7f3b3faf5ff9f19b3c"]
// 是否在白名单中: true
// 铸造参数:
// - 接收地址: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
// - Token ID: 1
// - 默克尔证明: [
//   '0x999bf57501565dbd2fdcea36efa2b9aef8340a8901e3459f4a4c926275d36cdb',
//   '0x4726e4102af77216b09ccd94f40daa10531c87c4d60bba7f3b3faf5ff9f19b3c'
// ]
// ✅ NFT铸造成功！
// Token 1 的所有者: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
// 地址 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4 的NFT余额: 1
// 7. 测试非白名单地址铸造
// 验证地址: 0x1234567890123456789012345678901234567890
// 叶子节点: 0xb6979620706f8c652cfb6bf6e923f5156eadd5abaf4022a0b19d52ada089475f
// 默克尔证明: []
// 是否在白名单中: false
// ✅ 非白名单地址铸造失败（符合预期）
// 错误信息: The contract function "mint" reverted with the following reason:
// Invalid merkle proof

// Contract Call:
//   address:   0xb1b2d9c6a5f2a6b904f257126dfe7d875f70cfd4
//   function:  mint(address to, uint256 tokenId, bytes32[] proof)
//   args:          (0x1234567890123456789012345678901234567890, 2, [])
//   sender:    0xbd61c00E4B7C2a77Cd660304ddd852379F705ED6

// Docs: https://viem.sh/docs/contract/writeContract
// Version: viem@2.33.0