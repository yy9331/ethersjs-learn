# Ethers.js vs Viem 学习项目

这个项目包含了使用 **ethers.js** 和 **viem** 两个主流 Web3 库的对比学习示例。

## 📁 项目结构

```
etherjs-viem-learn/
├── 0_init_ethersjs.js                          # 初始化配置
├── 0_test_rpc.js                               # RPC 测试
├── 0_test_viem_rpc.js                          # viem RPC 测试
├── 1_HelloVitalik_ethersjs.js                  # ethers.js 示例
├── 1_HelloVitalik_viem.js                      # viem 示例
├── 2_provider_ethersjs.js                      # Provider 模式
├── 3_contract_ethersjs.js                      # 合约交互
├── 3_contract_viem.js                          # 合约交互 (viem)
├── 3_contract_abiERC20_viem.js                 # 合约 ABI 处理 (viem)
├── 4_sendEth_ethersjs.js                       # 发送 ETH
├── 4_sendEth_viem.js                           # 发送 ETH (viem)
├── 5_writeContract_ethersjs.js                 # 写入合约
├── 5_writeContract_viem.js                     # 写入合约 (viem)
├── 6_deploy_ethersjs.js                        # 部署合约
├── 6_deploy_viem.js                            # 部署合约 (viem)
├── 6_abi_source_ethersjs.js                    # ABI 源码解析
├── 6_abi_human_readable_ethersjs.js            # 人类可读 ABI
├── 6_bytecode_ethersjs.js                      # 字节码处理
├── 7_events_ethersjs.js                        # 事件监听
├── 7_events_viem.js                            # 事件监听 (viem)
├── 8_events_listener_ethersjs.js               # 事件监听器
├── 8_events_listener_viem.js                   # 事件监听器 (viem)
├── 9_events_filter_ethersjs.js                 # 事件过滤
├── 9_events_filter_viem.js                     # 事件过滤 (viem)
├── 10_bignumber_ethersjs.js                    # 大数处理
├── 10_bignumber_viem.js                        # 大数处理 (viem)
├── 11_static_call_ethersjs.js                  # 静态调用
├── 11_static_call_viem.js                      # 静态调用 (viem)
├── 12_ERC721Check_ethersjs.js                  # ERC721 检查
├── 12_ERC721Check_viem.js                      # ERC721 检查 (viem)
├── 13_calldata_ethersjs.js                     # Calldata 处理
├── 13_calldata_viem.js                         # Calldata 处理 (viem)
├── 14_HDWallet_ethersjs.js                     # HD 钱包 (ethers.js)
├── 14_HDWallet_viem.js                         # HD 钱包 (viem)
├── 15_batchTransfer_ethersjs.js                # 批量转账 (ethers.js)
├── 15_batchTransfer_viem.js                    # 批量转账 (viem) - HD钱包派生20个地址并转账
├── 16_batchCollect_ethersjs.js                 # 批量收集 (ethers.js)
├── 16_batchCollect_viem.js                     # 批量收集 (viem) - 检查子钱包余额并归集到主钱包
├── 17_MerkleTree_ethersjs.js                   # Merkle 树 (ethers.js)
├── 17_MerkleTree_viem.js                       # Merkle 树 (viem)
├── 18_signature_ethersjs.js                    # 签名验证
├── 19_mempool_ethersjs.js                      # 内存池
├── 20_decodePendingTx_ethersjs.js              # 解码待处理交易
├── 21_VanityAddr_ethersjs.js                   # 靓号地址
├── 22_provider_wallet_connector_read_only_ethersjs.html      # Provider 钱包连接器
├── 22_signer_wallet_connector_can_send_receive_ethersjs.html # Signer 钱包连接器
├── 23_signer_wallet_connector_react_ethersjs.html           # React 钱包连接器
├── convert_abi.js                               # ABI 转换工具
├── extra_VerifyWETHAddress.js                   # WETH 地址验证
├── extra_WETHCompleteDemo.js                    # WETH 完整演示
├── 5_abiWETH.json                               # WETH ABI 文件
├── 17_contract.json                             # 合约 JSON 文件
├── 18_contract.json                             # 合约 JSON 文件
├── ERC20/                                       # ERC20 合约目录
├── ERC721withMercleTreeProof/                   # ERC721 Merkle 树证明目录
└── package.json                                 # 项目配置
```

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 运行 ethers.js 示例
```bash
node 1_HelloVitalik_ethersjs.js
```

### 运行 viem 示例
```bash
node 1_HelloVitalik_viem.js
```

## 📊 Viem vs Ethers.js 对比

### 1. **性能对比**

| 特性 | Ethers.js | Viem |
|------|-----------|------|
| 包体积 (gzipped) | ~88KB | ~45KB |
| 加载速度 | 较慢 | 更快 |
| 执行速度 | 中等 | 更快 |

### 2. **API 设计对比**

#### **Ethers.js 方式**
```javascript
import { ethers } from "ethers";

// 面向对象设计
const provider = new ethers.JsonRpcProvider(url);
const signer = await provider.getSigner();
const balance = await provider.getBalance(signer.getAddress());
const formattedBalance = ethers.formatEther(balance);
```

#### **Viem 方式**
```javascript
import { createPublicClient, http, getBalance, formatEther } from "viem";

// 函数式编程设计
const client = createPublicClient({ chain, transport });
const balance = await getBalance(client, { address });
const formattedBalance = formatEther(balance);
```

### 3. **RPC 配置对比**

#### **Ethers.js - 需要手动配置**
```javascript
// 需要申请 API key 和配置 RPC URL
const provider = new ethers.JsonRpcProvider("https://mainnet.infura.io/v3/YOUR_KEY");
```

#### **Viem - 自动选择最佳 RPC**
```javascript
// 自动选择免费的公共 RPC 服务
const client = createPublicClient({
    chain: mainnet,
    transport: http() // 无需指定 URL
});
```

## ⭐ Viem 的主要优势

### 1. **性能优势**

#### **更小的包体积**
- **Ethers.js**: ~88KB (gzipped)
- **Viem**: ~45KB (gzipped)
- Viem 体积更小，加载更快

#### **更快的执行速度**
```javascript
// Viem 更直接的 API，减少网络请求
const balance = await getBalance(client, { address });

// 合约交互无需创建实例
const name = await readContract(client, {
    address: contractAddress,
    abi: contractABI,
    functionName: 'name'
});
```

### 2. **开发体验优势**

#### **更现代的 API 设计**
- 函数式编程风格
- 更好的类型安全
- 更清晰的错误信息

#### **更好的 TypeScript 支持**
```javascript
// Viem 提供完整的类型检查
const balance = await getBalance(client, {
    address: "0x...", // 类型检查
    blockNumber: 12345n // BigInt 支持
});

// 合约交互的类型安全
const result = await readContract(client, {
    address: "0x...",
    abi: contractABI,
    functionName: 'balanceOf',
    args: ['0x...'] // 参数类型检查
});
```

### 3. **RPC 配置优势**

#### **无需手动配置 RPC**
```javascript
// Viem 自动选择最佳 RPC
const client = createPublicClient({
    chain: mainnet,
    transport: http() // 自动选择免费 RPC
});
```

#### **自动故障转移**
- 自动选择最快的 RPC 端点
- 失败时自动切换到备用端点
- 内置多个免费公共 RPC 服务

### 4. **合约交互优势**

#### **无需创建合约实例**
```javascript
// Ethers.js 需要创建实例
const contract = new ethers.Contract(address, abi, provider);
const name = await contract.name();

// Viem 直接调用函数
const name = await readContract(client, {
    address: address,
    abi: abi,
    functionName: 'name'
});
```

#### **更好的 ABI 处理**
- 支持完整的 ABI 对象格式
- 更好的类型推断
- 更安全的参数传递

### 5. **生态系统优势**

#### **与 Wagmi 完美集成**
```javascript
// Viem + Wagmi 组合
import { useAccount, useBalance } from "wagmi";
```

#### **更好的 React 支持**
- 内置 React hooks
- 更好的状态管理
- 自动缓存和重新验证

### 6. **安全性优势**

#### **更好的类型检查**
- 编译时错误检查
- 运行时类型验证
- 更安全的参数传递

#### **更少的运行时错误**
- 更好的错误处理
- 更清晰的错误信息
- 更安全的默认值

### 7. **维护性优势**

#### **更活跃的维护**
- 更频繁的更新
- 更好的社区支持
- 更快的 bug 修复

#### **更好的文档**
- 更清晰的 API 文档
- 更多的示例代码
- 更好的教程

## 🔧 实际使用对比

### **1. 查询 Vitalik 余额**

#### **Ethers.js 版本**
```javascript
import { ethers } from "ethers";

const provider = ethers.getDefaultProvider();
const balance = await provider.getBalance(`vitalik.eth`);
console.log(`ETH Balance: ${ethers.formatEther(balance)} ETH`);
```

#### **Viem 版本**
```javascript
import { createPublicClient, http, getBalance, getEnsAddress } from "viem";
import { mainnet } from "viem/chains";

const client = createPublicClient({
    chain: mainnet,
    transport: http()
});

const address = await getEnsAddress(client, { name: "vitalik.eth" });
const balance = await getBalance(client, { address });
console.log(`ETH Balance: ${Number(balance) / 10**18} ETH`);
```

### **2. 合约交互对比**

#### **Ethers.js 版本**
```javascript
import { ethers } from 'ethers';

// 创建合约实例
const contractWETH = new ethers.Contract(addressWETH, abiWETH, providerETH);
const contractDAI = new ethers.Contract(addressDAI, abiERC20, providerETH);

// 调用合约方法
const nameWETH = await contractWETH.name();
const symbolWETH = await contractWETH.symbol();
const totalSupply = await contractWETH.totalSupply();

// 支持人类可读的 ABI
const abiERC20 = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint)",
];
```

#### **Viem 版本**
```javascript
import { createPublicClient, http } from "viem";
import { readContract } from "viem/actions";
import { mainnet } from "viem/chains";

// 直接调用函数，无需创建合约实例
const nameWETH = await readContract(client, {
    address: addressWETH,
    abi: JSON.parse(abiWETH),
    functionName: 'name'
});

const symbolWETH = await readContract(client, {
    address: addressWETH,
    abi: JSON.parse(abiWETH),
    functionName: 'symbol'
});

// 方法1: 使用完整的 ABI 对象格式
const abiERC20 = [
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [{"name": "", "type": "string"}],
        "stateMutability": "view",
        "type": "function"
    },
    // ... 更多 ABI 定义
];

// 方法2: 使用 parseAbiItem 解析人类可读的 ABI 字符串
import { parseAbiItem } from "viem";
const transferEvent = parseAbiItem("event Transfer(address indexed from, address indexed to, uint256 amount)");
```

### **3. 发送 ETH 对比**

#### **Ethers.js 版本**
```javascript
import { ethers } from 'ethers';
const wallet2 = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, providerSepoliaAlchemy);
const ex = { to: address1, value: ethers.parseEther("0.001") };
const receipt = await wallet2.sendTransaction(ex);
await receipt.wait();
```

#### **Viem 版本**
```javascript
import { createWalletClient, createPublicClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
const account2 = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY);
const walletClient = createWalletClient({ account: account2, chain: sepolia, transport: http() });
const tx = { to: address1, value: parseEther("0.001") };
const hash = await walletClient.sendTransaction(tx);
const receipt = await publicClient.waitForTransactionReceipt({ hash });
```

#### **主要区别说明**
- **钱包创建**：ethers.js 支持助记词和私钥，viem 目前仅支持私钥（助记词需第三方库）。
- **API 风格**：ethers.js 用 Wallet 实例，viem 用 account + client 分离。
- **交易发送**：ethers.js 直接 `wallet.sendTransaction`，viem 需先用 `walletClient.sendTransaction` 获取 hash，再用 `publicClient.waitForTransactionReceipt` 等待确认。
- **单位处理**：ethers.js 用 `ethers.parseEther`，viem 用 `parseEther`。
- **余额查询**：ethers.js 用 `provider.getBalance(wallet)`，viem 用 `publicClient.getBalance({ address })`。

### **4. 合约写操作（存入WETH并转账）对比**

#### **Ethers.js 版本**
```javascript
const contractWETH = new ethers.Contract(addressWETH, abiWETH, providerSepoliaAlchemy);
const contractWETHWithSigner = contractWETH.connect(wallet);
const tx = await contractWETHWithSigner.deposit({value: ethers.parseEther("0.001")});
await tx.wait();
const tx2 = await contractWETHWithSigner.transfer("vitalik.eth", ethers.parseEther("0.001"));
await tx2.wait();
```

#### **Viem 版本**
```javascript
const hash = await walletClient.writeContract({
  address: addressWETH,
  abi: abiWETH,
  functionName: "deposit",
  value: parseEther("0.001")
});
await publicClient.waitForTransactionReceipt({ hash });

const hash2 = await walletClient.writeContract({
  address: addressWETH,
  abi: abiWETH,
  functionName: "transfer",
  args: [vitalik, parseEther("0.001")]
});
await publicClient.waitForTransactionReceipt({ hash: hash2 });
```

#### **主要区别说明**
- **合约实例**：ethers.js 需要实例化合约，viem 直接用 `writeContract`/`readContract`。
- **写操作**：ethers.js 用 `connect(wallet)` 绑定签名者，viem 用 `walletClient` 直接发起写操作。
- **ENS 支持**：ethers.js 支持直接用 ENS 地址，viem 需先解析 ENS 得到地址。
- **交易确认**：ethers.js 用 `tx.wait()`，viem 用 `waitForTransactionReceipt`。
- **ABI 支持**：ethers.js 支持人类可读 ABI，viem 支持完整 ABI 对象，也可用 `parseAbiItem` 解析人类可读 ABI 字符串。
- **关键步骤打印**：viem 版本同样建议在每一步加详细 console.log，便于调试和学习。

### **5. Static Call 对比**

#### **Ethers.js 版本**
```javascript
// staticCall 模拟转账（不会真正执行）
try {
    await contractDAI.transfer.staticCall(
        address, // 转账给测试钱包
        ethers.parseEther("1"),
        {from: vitalikAddress} // Vitalik作为发送方
    );
    console.log("交易会成功吗？：成功");
} catch (error) {
    console.log(`交易失败：${error.reason}`);
}
```

#### **Viem 版本**
```javascript
// simulateContract 模拟转账（不会真正执行）
try {
    const transferAbi = parseAbiItem("function transfer(address to, uint256 amount) returns (bool)");
    await publicClient.simulateContract({
        address: addressDAI,
        abi: [transferAbi],
        functionName: 'transfer',
        args: [address, parseEther("1")],
        account: vitalikAddress // Vitalik作为发送方
    });
    console.log("交易会成功吗？：成功");
} catch (error) {
    console.log(`交易失败：${error.message}`);
}
```

#### **主要区别说明**
- **API 名称**：ethers.js 用 `staticCall`，viem 用 `simulateContract`。
- **参数传递**：ethers.js 直接传递参数，viem 用对象参数。
- **身份模拟**：ethers.js 用 `{from: ...}`，viem 用 `account: ...`。
- **错误信息**：viem 的错误信息更详细，包含合约 revert 的具体原因。
- **ABI 处理**：ethers.js 支持人类可读 ABI，viem 可用 `parseAbiItem` 解析。
- **返回值**：ethers.js 直接返回函数结果，viem 返回模拟结果对象。

#### **使用场景与心得**
- **本质作用一致**：都是"链上模拟"，不会真正发起交易，适合前端/后端/批量校验。
- **API 风格不同**：ethers.js 偏向面向对象，viem 偏向函数式和对象参数。
- **错误信息**：viem 的错误信息更详细，能直接看到合约 revert 的原因，非常适合调试和前端提示。
- **身份模拟**：两者都支持模拟任意地址发起交易（msg.sender），但 viem 用 `account` 字段更直观。
- **依赖 RPC 质量**：无论哪种方式，主网大合约建议用 Alchemy/Infura/QuickNode 等主流服务，免费节点极易超时。
- **最佳实践**：建议在 DApp 前端、批量脚本、合约测试等场景优先用 static call/simulateContract 预演，避免无谓的链上失败和 gas 损失。

### **6. ERC721 接口检查对比**

#### **Ethers.js 版本**
```javascript
// 检查是否为ERC721标准
const isERC721 = await contractERC721.supportsInterface(selectorERC721);
console.log(`合约是否为ERC721标准: ${isERC721}`);
```

#### **Viem 版本**
```javascript
// 使用 parseAbiItem 解析 ABI
const supportsInterfaceAbi = parseAbiItem("function supportsInterface(bytes4 interfaceId) view returns (bool)");

// 检查是否为ERC721标准
const isERC721 = await publicClient.readContract({
    address: addressBAYC,
    abi: [supportsInterfaceAbi],
    functionName: 'supportsInterface',
    args: [selectorERC721]
});
console.log(`合约是否为ERC721标准: ${isERC721}`);
```

#### **主要区别说明**
- **ABI 处理**：ethers.js 用预定义 ABI 数组，viem 用 `parseAbiItem` 解析人类可读 ABI 字符串。
- **合约实例**：ethers.js 需要创建合约实例，viem 直接用 `readContract`。
- **函数调用**：ethers.js 用 `contract.function()`，viem 用 `publicClient.readContract()`。
- **参数传递**：ethers.js 直接传递参数，viem 用 `args` 数组。
- **错误处理**：ethers.js 抛出异常，viem 返回详细错误信息。

#### **ERC721 接口检查的用途与心得**
- **合约类型识别**：通过 ERC165 的 `supportsInterface` 可以准确判断合约是否符合 ERC721 标准。
- **前端兼容性**：DApp 前端可以根据接口支持情况显示不同的交互界面。
- **批量验证**：可以批量检查多个合约地址，筛选出真正的 NFT 合约。
- **接口扩展性**：除了 ERC721，还可以检查 ERC1155、ERC2981 等其他接口支持。
- **安全验证**：避免与不符合标准的合约交互，减少错误和风险。
- **市场应用**：NFT 市场、钱包等应用需要准确识别合约类型来提供相应功能。

### **7. Calldata 处理对比**

#### **Ethers.js 版本**
```javascript
// 编码 calldata
const param1 = contractWETH.interface.encodeFunctionData("balanceOf", [address]);

// 创建交易并调用
const tx1 = { to: addressWETH, data: param1 };
const balanceWETH = await provider.call(tx1);

// 编码 deposit 函数
const param2 = contractWETH.interface.encodeFunctionData("deposit");
const tx2 = { to: addressWETH, data: param2, value: ethers.parseEther("0.001") };
const receipt1 = await wallet.sendTransaction(tx2);
await receipt1.wait();
```

#### **Viem 版本**
```javascript
// 使用 parseAbiItem 解析 ABI
const balanceOfAbi = parseAbiItem("function balanceOf(address) public view returns(uint)");
const depositAbi = parseAbiItem("function deposit() payable");

// 编码 calldata
const param1 = encodeFunctionData({
    abi: [balanceOfAbi],
    functionName: "balanceOf",
    args: [address]
});

// 直接使用 readContract 读取余额
const balanceWETH = await publicClient.readContract({
    address: addressWETH,
    abi: [balanceOfAbi],
    functionName: "balanceOf",
    args: [address]
});

// 编码 deposit 函数并发送交易
const param2 = encodeFunctionData({
    abi: [depositAbi],
    functionName: "deposit"
});
const tx2 = { to: addressWETH, data: param2, value: parseEther("0.001") };
const hash = await walletClient.sendTransaction(tx2);
const receipt = await publicClient.waitForTransactionReceipt({ hash });
```

#### **主要区别说明**
- **ABI 处理**：ethers.js 用合约实例的 `interface.encodeFunctionData`，viem 用 `encodeFunctionData` + `parseAbiItem`。
- **合约实例**：ethers.js 需要创建合约实例，viem 无需实例化。
- **函数调用**：ethers.js 用 `provider.call(tx)`，viem 用 `publicClient.readContract`。
- **交易发送**：ethers.js 用 `wallet.sendTransaction`，viem 用 `walletClient.sendTransaction`。
- **交易等待**：ethers.js 用 `receipt.wait()`，viem 用 `waitForTransactionReceipt`。
- **ABI 格式**：ethers.js 支持人类可读 ABI 字符串，viem 用 `parseAbiItem` 解析。

#### **Calldata 处理的用途与心得**
- **底层交互**：calldata 是合约交互的底层机制，理解它有助于深入理解 Web3。
- **编码解码**：可以手动编码函数调用，也可以解码交易数据。
- **批量操作**：可以预先编码多个函数调用，然后批量执行。
- **调试工具**：通过 calldata 可以分析交易的具体内容。
- **Gas 优化**：手动编码可以优化 gas 使用。
- **跨链兼容**：calldata 格式在不同链上是通用的。

### **8. HD Wallet 对比**

#### **Ethers.js 版本**
```javascript
import { ethers } from "ethers";

// 生成随机助记词
const mnemonic = ethers.Mnemonic.entropyToPhrase(ethers.randomBytes(32));

// 创建HD基钱包
const basePath = "44'/60'/0'/0";
const baseWallet = ethers.HDNodeWallet.fromPhrase(mnemonic, basePath);

// 派生20个钱包
for (let i = 0; i < 20; i++) {
    let derivedWallet = baseWallet.derivePath(i.toString());
    console.log(`第${i+1}个钱包地址： ${derivedWallet.address}`);
}

// 保存钱包（加密json）
const wallet = ethers.Wallet.fromPhrase(mnemonic);
const json = await wallet.encrypt("password");
```

#### **Viem 版本**
```javascript
import { generateMnemonic, mnemonicToAccount, hdKeyToAccount } from "viem/accounts";
import { HDKey } from "@scure/bip32";
import { mnemonicToSeed } from "@scure/bip39";

// 生成随机助记词
const mnemonic = generateMnemonic(wordlist);

// 创建HD基钱包
const basePath = "m/44'/60'/0'/0";
const seed = await mnemonicToSeed(mnemonic);
const hdKey = HDKey.fromMasterSeed(seed);

// 派生20个钱包
for (let i = 0; i < 20; i++) {
    const derivePath = `${basePath}/${i}`;
    const derivedWallet = hdKeyToAccount(hdKey, { path: derivePath });
    console.log(`第${i+1}个钱包地址： ${derivedWallet.address}`);
}

// 从助记词创建钱包
const wallet = mnemonicToAccount(mnemonic);
```

#### **主要区别说明**
- **助记词生成**：ethers.js 用 `Mnemonic.entropyToPhrase()`，viem 用 `generateMnemonic()`。
- **HD 钱包创建**：ethers.js 用 `HDNodeWallet.fromPhrase()`，viem 用 `HDKey.fromMasterSeed()` + `hdKeyToAccount()`。
- **路径格式**：ethers.js 用 `44'/60'/0'/0`，viem 用 `m/44'/60'/0'/0`。
- **钱包派生**：ethers.js 用 `derivePath()`，viem 用 `hdKeyToAccount()` + 路径参数。
- **加密存储**：ethers.js 内置 `encrypt()` 方法，viem 需要第三方库。
- **依赖库**：viem 需要额外的 `@scure/bip32` 和 `@scure/bip39` 库。

#### **HD Wallet 的用途与心得**

##### **分层结构说明**
```
m / 44' / 60' / 0' / 0 / 0
│   │    │    │   │  │  └── 地址索引 (0, 1, 2, ...)
│   │    │    │   │  └───── 外部/内部链 (0=外部, 1=内部)
│   │    │    │   └──────── 账户索引 (0, 1, 2, ...)
│   │    │    └──────────── 币种类型 (60=ETH, 0=BTC, ...)
│   │    └───────────────── 用途 (44=BIP44, 49=BIP49, ...)
│   └────────────────────── 主密钥
```

##### **多账户管理示例**
```javascript
// 为不同用途创建不同路径的钱包
const tradingWallet = hdKeyToAccount(hdKey, { path: "m/44'/60'/0'/0/0" });    // 交易钱包
const savingsWallet = hdKeyToAccount(hdKey, { path: "m/44'/60'/1'/0/0" });     // 储蓄钱包
const stakingWallet = hdKeyToAccount(hdKey, { path: "m/44'/60'/2'/0/0" });     // 质押钱包
const defiWallet = hdKeyToAccount(hdKey, { path: "m/44'/60'/3'/0/0" });        // DeFi 钱包

// 批量生成同一账户下的多个地址
for (let i = 0; i < 5; i++) {
    const address = hdKeyToAccount(hdKey, { path: `m/44'/60'/0'/0/${i}` });
    console.log(`交易地址 ${i}: ${address.address}`);
}
```

##### **路径详解**
| 路径组件 | 说明 | 示例值 |
|---------|------|--------|
| `m` | 主密钥标识符 | 固定值 |
| `44'` | BIP44 用途 | 44 (BIP44), 49 (BIP49), 84 (BIP84) |
| `60'` | 币种类型 | 60 (ETH), 0 (BTC), 3 (LTC) |
| `0'` | 账户索引 | 0 (第一个账户), 1 (第二个账户) |
| `0` | 外部/内部链 | 0 (外部地址), 1 (内部地址) |
| `0` | 地址索引 | 0, 1, 2, ... (同一链下的地址) |

##### **实际应用场景**

###### **1. 多用途钱包管理**
```javascript
// 不同用途的钱包路径
const wallets = {
    trading: "m/44'/60'/0'/0/0",      // 日常交易
    savings: "m/44'/60'/1'/0/0",      // 长期储蓄
    staking: "m/44'/60'/2'/0/0",      // 质押收益
    defi: "m/44'/60'/3'/0/0",         // DeFi 操作
    nft: "m/44'/60'/4'/0/0",          // NFT 收藏
    gaming: "m/44'/60'/5'/0/0"        // 游戏资产
};
```

###### **2. 批量地址生成**
```javascript
// 为交易所生成多个充值地址
const exchangeAddresses = [];
for (let i = 0; i < 10; i++) {
    const wallet = hdKeyToAccount(hdKey, { path: `m/44'/60'/0'/0/${i}` });
    exchangeAddresses.push(wallet.address);
}
```

###### **3. 钱包恢复流程**
```javascript
// 从助记词恢复所有钱包
const mnemonic = "your twelve word seed phrase here";
const seed = await mnemonicToSeed(mnemonic);
const hdKey = HDKey.fromMasterSeed(seed);

// 恢复特定路径的钱包
const recoveredWallet = hdKeyToAccount(hdKey, { path: "m/44'/60'/0'/0/0" });
```

###### **4. 安全最佳实践**
- **确定性钱包**：从一个种子（助记词）可以生成无限个钱包地址。
- **安全备份**：只需要备份一个助记词，就能恢复所有钱包。
- **分层结构**：使用路径系统组织钱包，如 `m/44'/60'/0'/0/0`。
- **多账户管理**：可以为不同用途创建不同的钱包路径。
- **钱包恢复**：通过助记词和路径可以恢复任意派生钱包。
- **BIP 标准**：遵循 BIP-32、BIP-39、BIP-44 等标准。

### **9. 批量转账对比**

#### **Ethers.js 版本**
```javascript
import { ethers } from "ethers";

// 创建HD钱包
const mnemonic = `air organ twist rule prison symptom jazz cheap rather dizzy verb glare jeans orbit weapon universe require tired sing casino business anxiety seminar hunt`;
const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic);

// 派生20个子钱包
for (let i = 0; i < 20; i++) {
    const childNode = hdNode.deriveChild(i);
    addresses.push(childNode.address);
}

// 批量转账
for (let i = 0; i < addresses.length; i++) {
    const tx = await wallet.sendTransaction({
        to: addresses[i],
        value: ethers.parseEther("0.0001")
    });
    await tx.wait();
}
```

#### **Viem 版本**
```javascript
import { createPublicClient, createWalletClient, http, parseEther } from "viem";
import { hdKeyToAccount } from "viem/accounts";
import { HDKey } from "@scure/bip32";

// 创建HD钱包
const seed = await mnemonicToSeed(mnemonic);
const hdKey = HDKey.fromMasterSeed(seed);

// 派生20个子钱包
for (let i = 0; i < 20; i++) {
    const derivePath = `m/44'/60'/0'/0/${i}`;
    const childWallet = hdKeyToAccount(hdKey, { path: derivePath });
    addresses.push(childWallet.address);
}

// 批量转账
for (let i = 0; i < addresses.length; i++) {
    const hash = await walletClient.sendTransaction({
        to: addresses[i],
        value: parseEther("0.0001")
    });
    await publicClient.waitForTransactionReceipt({ hash });
}
```

#### **主要区别说明**
- **HD 钱包创建**：ethers.js 用 `HDNodeWallet.fromPhrase()`，viem 用 `HDKey.fromMasterSeed()` + `hdKeyToAccount()`。
- **路径格式**：ethers.js 用 `deriveChild(i)`，viem 用完整路径字符串。
- **交易发送**：ethers.js 用 `wallet.sendTransaction()`，viem 用 `walletClient.sendTransaction()`。
- **交易等待**：ethers.js 用 `tx.wait()`，viem 用 `waitForTransactionReceipt()`。
- **依赖库**：viem 需要额外的 `@scure/bip32` 和 `@scure/bip39` 库。

### **10. 批量归集对比**

#### **Ethers.js 版本**
```javascript
// 检查子钱包余额
for (let i = 0; i < addresses.length; i++) {
    const balance = await provider.getBalance(addresses[i]);
    if (balance > ethers.parseEther("0.0001")) {
        walletsWithBalance.push({
            index: i,
            address: addresses[i],
            wallet: childWallets[i],
            balance: balance
        });
    }
}

// 批量归集
for (let i = 0; i < walletsWithBalance.length; i++) {
    const childWallet = new ethers.Wallet(childWallets[i].privateKey, provider);
    const tx = await childWallet.sendTransaction({
        to: wallet.address,
        value: transferAmount
    });
    await tx.wait();
}
```

#### **Viem 版本**
```javascript
// 检查子钱包余额
for (let i = 0; i < addresses.length; i++) {
    const balance = await publicClient.getBalance({ address: addresses[i] });
    if (balance > parseEther("0.0001")) {
        walletsWithBalance.push({
            index: i,
            address: addresses[i],
            wallet: childWallets[i],
            balance: balance
        });
    }
}

// 批量归集
for (let i = 0; i < walletsWithBalance.length; i++) {
    const childWalletClient = createWalletClient({
        account: childWallet,
        chain: sepolia,
        transport: http()
    });
    const hash = await childWalletClient.sendTransaction({
        to: account.address,
        value: transferAmount
    });
    await publicClient.waitForTransactionReceipt({ hash });
}
```

#### **主要区别说明**
- **余额查询**：ethers.js 用 `provider.getBalance(address)`，viem 用 `publicClient.getBalance({ address })`。
- **子钱包创建**：ethers.js 用 `new ethers.Wallet(privateKey, provider)`，viem 用 `createWalletClient()`。
- **交易发送**：ethers.js 用 `childWallet.sendTransaction()`，viem 用 `childWalletClient.sendTransaction()`。
- **错误处理**：viem 提供更详细的错误信息和类型安全。

#### **批量操作的用途与心得**

##### **批量转账应用场景**
- **空投活动**：向大量用户地址发送代币或 NFT
- **奖励分发**：向参与者分发奖励
- **测试网络**：向测试地址分发测试币
- **多签钱包**：向多个签名者分发资金

##### **批量归集应用场景**
- **资金整合**：将分散的资金集中到主钱包
- **账户清理**：清理不再使用的子钱包
- **安全转移**：将资金从多个地址转移到安全钱包
- **税务处理**：归集收入用于税务申报

##### **技术要点**
- **HD 钱包管理**：通过 HD 钱包可以管理多个子钱包，便于批量操作
- **资金分散**：可以将资金分散到多个地址，提高安全性
- **Gas 优化**：批量操作可以优化 gas 使用，但需要注意网络拥堵
- **错误处理**：批量操作需要完善的错误处理机制
- **余额检查**：归集前需要检查每个钱包的余额和 gas 费用
- **交易确认**：每个交易都需要等待确认后再进行下一个

### **11. 批量操作功能总结**

#### **15_batchTransfer_viem.js - 批量转账功能**
**核心功能：** 使用 HD 钱包派生 20 个子钱包，然后从主钱包向每个子钱包转账 0.0001 ETH

**关键步骤：**
1. 通过助记词创建 HD 钱包
2. 派生 20 个子钱包地址
3. 检查主钱包余额是否足够
4. 循环向每个子钱包转账
5. 等待每个交易确认

**实际运行结果：**
- 成功向 20 个地址各转账 0.0001 ETH
- 所有交易都成功上链确认
- 总消耗约 0.002 ETH（转账金额 + gas 费用）

#### **16_batchCollect_viem.js - 批量归集功能**
**核心功能：** 检查所有子钱包余额，将有余额的钱包中的 ETH 归集到主钱包

**关键步骤：**
1. 通过助记词创建 HD 钱包
2. 派生 20 个子钱包地址
3. 检查每个子钱包的余额
4. 筛选出有足够余额的钱包（> 0.0001 ETH）
5. 计算转账金额（余额 - gas 费用）
6. 从子钱包向主钱包转账

**实际运行结果：**
- 检测到所有子钱包都有 0.0001 ETH
- 但由于余额等于最小归集阈值，没有进行归集
- 这是正常行为，因为需要保留 gas 费用

#### **两个版本的主要区别**
| 功能 | Ethers.js 版本 | Viem 版本 |
|------|----------------|-----------|
| **HD 钱包创建** | `HDNodeWallet.fromPhrase()` | `HDKey.fromMasterSeed()` + `hdKeyToAccount()` |
| **路径格式** | `deriveChild(i)` | 完整路径字符串 |
| **交易发送** | `wallet.sendTransaction()` | `walletClient.sendTransaction()` |
| **交易等待** | `tx.wait()` | `waitForTransactionReceipt()` |
| **余额查询** | `provider.getBalance()` | `publicClient.getBalance()` |
| **子钱包创建** | `new ethers.Wallet()` | `createWalletClient()` |

### **12. Merkle Tree 对比**

#### **Ethers.js 版本**
```javascript
// 生成默克尔树
const leaves = whitelistAddresses.map(x => ethers.keccak256(x));
const merkletree = new MerkleTree(leaves, ethers.keccak256, { sortPairs: true });
const root = merkletree.getHexRoot();

// 验证白名单
function verifyWhitelist(address) {
    const leaf = ethers.keccak256(address);
    const proof = merkletree.getHexProof(leaf);
    const isValid = merkletree.verify(proof, leaf, root);
    return { isValid, proof };
}

// 部署合约
const factoryNFT = new ethers.ContractFactory(abiNFT, bytecodeNFT, wallet);
const nftContract = await factoryNFT.deploy(contractName, contractSymbol, root);
await nftContract.waitForDeployment();

// 铸造NFT
const mintTx = await nftContract.mint(mintToAddress, tokenId, proof);
await mintTx.wait();
```

#### **Viem 版本**
```javascript
// 生成默克尔树
const leaves = whitelistAddresses.map(x => keccak256(x));
const merkletree = new MerkleTree(leaves, keccak256, { sortPairs: true });
const root = merkletree.getHexRoot();

// 验证白名单
function verifyWhitelist(address) {
    const leaf = keccak256(address);
    const proof = merkletree.getHexProof(leaf);
    const isValid = merkletree.verify(proof, leaf, root);
    return { isValid, proof };
}

// 部署合约
const hash = await walletClient.deployContract({
    abi: abiNFT,
    bytecode: bytecodeNFT,
    args: [contractName, contractSymbol, root]
});
const receipt = await publicClient.waitForTransactionReceipt({ hash });

// 铸造NFT
const mintHash = await walletClient.writeContract({
    address: contractAddress,
    abi: abiNFT,
    functionName: "mint",
    args: [mintToAddress, tokenId, proof]
});
await publicClient.waitForTransactionReceipt({ hash: mintHash });
```

#### **主要区别说明**
- **哈希函数**：ethers.js 用 `ethers.keccak256()`，viem 用 `keccak256()`。
- **合约部署**：ethers.js 用 `ContractFactory`，viem 用 `deployContract()`。
- **合约调用**：ethers.js 用合约实例，viem 用 `writeContract()`。
- **交易等待**：ethers.js 用 `tx.wait()`，viem 用 `waitForTransactionReceipt()`。
- **合约读取**：ethers.js 用合约实例，viem 用 `readContract()`。

#### **Merkle Tree 的用途与心得**
- **白名单验证**：通过默克尔树验证地址是否在白名单中。
- **Gas 优化**：只需要提供证明，不需要存储完整白名单。
- **隐私保护**：不需要在链上暴露完整白名单。
- **批量操作**：可以批量验证多个地址。
- **离线验证**：可以在链下验证地址是否在白名单中。
- **NFT 铸造**：常用于 NFT 项目的白名单铸造。

#### **实际运行结果**
- **合约部署**：成功部署到地址 `0xb1b2d9c6a5f2a6b904f257126dfe7d875f70cfd4`
- **白名单验证**：正确验证了 4 个白名单地址和 1 个非白名单地址
- **NFT 铸造**：成功为白名单地址铸造了 Token ID 1
- **安全测试**：非白名单地址铸造失败，返回 "Invalid merkle proof" 错误
- **离线验证**：所有地址的验证结果都正确

#### **技术要点**
- **默克尔根**：`0xeeefd63003e0e702cb41cd0043015a6e26ddb38073cc6ffeb0ba3e808ba8c097`
- **哈希算法**：使用 keccak256 对地址进行哈希
- **证明生成**：每个地址都有唯一的默克尔证明
- **合约验证**：智能合约通过默克尔根验证证明的有效性

### **13. 合约部署对比**

#### **Ethers.js 版本**
```javascript
import { ethers } from "ethers";
import { walletSepoliaInfura, providerSepoliaAlchemy } from "./0_init.js";

const wallet = walletSepoliaInfura;
const provider = providerSepoliaAlchemy;

// 创建合约工厂
const factoryERC20 = new ethers.ContractFactory(abiERC20, bytecodeERC20, wallet);

// 部署合约
const contractERC20 = await factoryERC20.deploy('CM2 Token', 'CM2');
console.log(`合约地址: ${contractERC20.target}`);
await contractERC20.waitForDeployment();

// 调用mint函数
let tx = await contractERC20.mint("86768");
await tx.wait();
```

#### **Viem 版本**
```javascript
import { createWalletClient, createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

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

// 部署合约
const hash = await walletClient.deployContract({
    abi: abiERC20,
    bytecode: bytecodeERC20,
    args: ['CM2 Token', 'CM2']
});
const receipt = await publicClient.waitForTransactionReceipt({ hash });
const contractAddress = receipt.contractAddress;

// 调用mint函数
const hashMint = await walletClient.writeContract({
    address: contractAddress,
    abi: abiERC20,
    functionName: "mint",
    args: ["86768"]
});
await publicClient.waitForTransactionReceipt({ hash: hashMint });
```

#### **主要区别说明**
- **合约工厂**：ethers.js 用 `ContractFactory`，viem 直接用 `deployContract`。
- **部署方式**：ethers.js 返回合约实例，viem 返回交易哈希。
- **合约地址**：ethers.js 用 `contract.target`，viem 从交易收据中获取。
- **函数调用**：ethers.js 用合约实例调用，viem 用 `writeContract`。
- **交易等待**：ethers.js 用 `tx.wait()`，viem 用 `waitForTransactionReceipt`。

### **14. 事件查询对比**

#### **Ethers.js 版本**
```javascript
import { ethers } from "ethers";

// 创建合约实例
const contract = new ethers.Contract(addressWETH, abiWETH, provider);

// 查询事件
const events = await contract.queryFilter('Transfer', fromBlock, toBlock);

// 解析事件
const amount = ethers.formatUnits(ethers.getBigInt(events[0].args["amount"]), "ether");
console.log(`地址 ${events[0].args["from"]} 转账${amount} WETH 到地址 ${events[0].args["to"]}`);
```

#### **Viem 版本**
```javascript
import { createPublicClient, http, formatEther, parseAbiItem } from "viem";

const publicClient = createPublicClient({
    chain: sepolia,
    transport: http()
});

// 方法1: 使用 parseAbiItem 解析人类可读的 ABI 字符串
const transferEvent = parseAbiItem("event Transfer(address indexed from, address indexed to, uint256 amount)");

// 查询事件
const events = await publicClient.getLogs({
    address: addressWETH,
    event: transferEvent,
    fromBlock: BigInt(fromBlock),
    toBlock: BigInt(toBlock)
});

// 方法2: 直接定义事件对象
// const events = await publicClient.getLogs({
//     address: addressWETH,
//     event: {
//         type: 'event',
//         name: 'Transfer',
//         inputs: [
//             { type: 'address', name: 'from', indexed: true },
//             { type: 'address', name: 'to', indexed: true },
//             { type: 'uint256', name: 'amount', indexed: false }
//         ]
//     },
//     fromBlock: BigInt(fromBlock),
//     toBlock: BigInt(toBlock)
// });

// 解析事件
const from = '0x' + events[0].topics[1].slice(26);
const to = '0x' + events[0].topics[2].slice(26);
const amount = formatEther(events[0].data);
console.log(`地址 ${from} 转账${amount} WETH 到地址 ${to}`);
```

#### **主要区别说明**
- **事件查询**：ethers.js 用 `contract.queryFilter()`，viem 用 `publicClient.getLogs()`。
- **事件定义**：ethers.js 用 ABI 字符串，viem 可用事件对象定义或 `parseAbiItem` 解析 ABI 字符串。
- **参数类型**：ethers.js 用数字，viem 用 `BigInt`。
- **事件解析**：ethers.js 自动解析 `args`，viem 需要手动解析 `topics` 和 `data`。
- **格式化**：ethers.js 用 `formatUnits`，viem 用 `formatEther`。

### 10. **事件监听器对比**

#### **Ethers.js 版本**
```javascript
    // 1. 监听一次事件
    contract.once('Transfer', (from, to, value) => {
    console.log(`监听到一次 Transfer 事件: ${from} -> ${to} ${ethers.formatUnits(value, 6)} USDT`);
    });
    
    // 2. 持续监听事件
    contract.on('Transfer', (from, to, value) => {
    console.log(`监听到 Transfer 事件: ${from} -> ${to} ${ethers.formatUnits(value, 6)} USDT`);
    });
```

#### **Viem 版本**
```javascript
// 使用轮询方式模拟实时监听
        const pollEvents = async () => {
                    const events = await publicClient.getLogs({
                        address: contractAddressUSDT,
                        event: transferEvent,
                        fromBlock: BigInt(lastProcessedBlock + 1),
                        toBlock: currentBlock
                    });
                    
    events.forEach((log) => {
                            const from = '0x' + log.topics[1].slice(26);
                            const to = '0x' + log.topics[2].slice(26);
                            const value = formatUnits(log.data, 6);
        console.log(`${from} -> ${to} ${value} USDT`);
                        });
        };
        
        const pollInterval = setInterval(pollEvents, 5000);
```

#### **主要区别说明**
- **实时监听**：ethers.js 支持真正的实时监听，viem 需要轮询模拟。
- **事件处理**：ethers.js 自动解析事件参数，viem 需要手动解析 `topics` 和 `data`。
- **连接方式**：ethers.js 用 `contract.on()` 和 `contract.once()`，viem 用 `setInterval` + `getLogs()`。
- **错误处理**：ethers.js 内置错误处理，viem 需要手动处理轮询错误。
- **RPC 支持**：ethers.js 支持 HTTP 和 WebSocket，viem 主要支持 HTTP。
- **类型安全**：viem 需要明确的 BigInt 类型转换，ethers.js 自动处理。

### **Viem 事件监听限制说明**

#### **Viem 的 WebSocket 限制**

Viem 的 `watchContractEvent` API 需要 WebSocket RPC 支持，但存在以下限制：

1. **免费 RPC 不支持**：大多数免费 RPC 服务只提供 HTTP 接口
2. **需要付费服务**：WebSocket 支持通常需要 Alchemy、Infura 等付费服务
3. **连接不稳定**：免费 WebSocket 服务经常断连
4. **配置复杂**：需要正确的 API Key 和 WebSocket URL

#### **推荐方案**

**开发环境：**
- 使用轮询方案（`9_events_filter_viem.js`）
- 免费 RPC 即可满足需求
- 简单可靠，易于调试

**生产环境：**
- 使用 ethers.js 的 HTTP 监听方案
- 或者使用付费 WebSocket 服务
- 或者继续使用轮询方案

#### **为什么选择轮询方案**

1. **免费 RPC 支持**：所有免费 RPC 都支持 HTTP
2. **简单可靠**：无需复杂的 WebSocket 配置
3. **易于调试**：可以清楚地看到每个请求和响应
4. **兼容性好**：在所有环境下都能工作

## 📈 性能测试结果

### **RPC 配置测试**

运行 `test_viem_rpc.js` 的结果：

```
测试 viem 的 RPC 配置...

1. 测试默认配置（自动选择 RPC）...
✅ 默认配置成功: 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
   余额: 4.7795871263457315 ETH

2. 测试指定公共 RPC...
✅ 公共 RPC 成功: 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
   余额: 4.7795871263457315 ETH
```

### **合约交互测试**

#### **Ethers.js 输出**
```
1. 读取WETH合约信息
合约地址: 0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2
名称: Wrapped Ether
代号: WETH
总供给: 2205394.870341012777290529
Vitalik持仓: 0.0

2. 读取DAI合约信息
合约地址: Dai Stablecoin
名称: DAI
代号: 3712947967862183691309164784
总供给: 3712947967.862183691309164784
Vitalik持仓: 0.0
```

#### **Viem 输出**
```
1. 读取WETH合约信息
合约地址: 0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2
名称: Wrapped Ether
代号: WETH
总供给: 2205394.8703410127
Vitalik持仓: 0

2. 读取DAI合约信息
合约地址: 0x6B175474E89094C44Da98b954EedeAC495271d0F
名称: Dai Stablecoin
代号: DAI
总供给: 3712947967.8621836
Vitalik持仓: 0
```

## 🎯 推荐使用场景

### **选择 Viem 的场景**
- ✅ 新项目开发
- ✅ React 应用
- ✅ TypeScript 项目
- ✅ 需要快速原型开发
- ✅ 对性能要求较高
- ✅ 需要与 Wagmi 集成
- ✅ 函数式编程偏好
- ✅ 需要更好的类型安全

### **选择 Ethers.js 的场景**
- ✅ 现有项目维护
- ✅ 需要向后兼容
- ✅ 团队熟悉 ethers.js
- ✅ 需要特定的 ethers.js 功能
- ✅ 需要更丰富的错误信息
- ✅ 面向对象编程偏好
- ✅ 需要更丰富的错误信息

## 📚 学习资源

- [Viem 官方文档](https://viem.sh/)
- [Ethers.js 官方文档](https://docs.ethers.org/)
- [Wagmi 官方文档](https://wagmi.sh/)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## �� 许可证

MIT License 