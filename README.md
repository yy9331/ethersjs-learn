# Ethers.js vs Viem 学习项目

这个项目包含了使用 **ethers.js** 和 **viem** 两个主流 Web3 库的对比学习示例。

## 📁 项目结构

```
etherjs-viem-learn/
├── 0_init.js                                    # 初始化配置
├── 1_HelloVitalik_ethersjs.js                  # ethers.js 示例
├── 1_HelloVitalik_viem.js                      # viem 示例
├── 2_provider_ethersjs.js                      # Provider 模式
├── 3_contract_ethersjs.js                      # 合约交互
├── 4_sendEth_ethersjs.js                       # 发送 ETH
├── 5_writeContract_ethersjs.js                 # 写入合约
├── 6_deploy_ethersjs.js                        # 部署合约
├── 7_events_ethersjs.js                        # 事件监听
├── 8_events_listener_ethersjs.js               # 事件监听器
├── 9_events_filter_ethersjs.js                 # 事件过滤
├── 10_bignumber_ethersjs.js                    # 大数处理
├── 10_bignumber_viem.js                        # 大数处理 (viem)
├── 11_static_call_ethersjs.js                  # 静态调用
├── 11_static_call_viem.js                      # 静态调用 (viem)
├── 12_ERC721Check_ethersjs.js                  # ERC721 检查
├── 13_calldata_ethersjs.js                     # Calldata 处理
├── 14_HDWallet_ethersjs.js                     # HD 钱包
├── 15_batchTransfer_ethersjs.js                # 批量转账
├── 16_batchCollect_ethersjs.js                 # 批量收集
├── 17_MerkleTree_ethersjs.js                   # Merkle 树
├── 18_signature_ethersjs.js                    # 签名验证
├── 19_mempool_ethersjs.js                      # 内存池
├── 20_decodePendingTx_ethersjs.js              # 解码待处理交易
├── 21_VanityAddr_ethersjs.js                   # 靓号地址
├── 22_provider_wallet_connector_read_only_ethersjs.html      # Provider 钱包连接器
├── 22_signer_wallet_connector_can_send_receive_ethersjs.html # Signer 钱包连接器
├── 23_signer_wallet_connector_react_ethersjs.html           # React 钱包连接器
└── test_viem_rpc.js                            # viem RPC 测试
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
import { ethers } from "ethers";
import { providerEthByAlchemy as provider, walletMainNetByAlchemy as wallet } from './0_init_ethersjs.js';

const addressDAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
const contractDAI = new ethers.Contract(addressDAI, [
    "function balanceOf(address owner) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)"
], provider);

const main = async () => {
    const address = await wallet.getAddress();
    const vitalikAddress = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
    
    // 1. 读取余额
    const balanceDAI = await contractDAI.balanceOf(address);
    console.log(`测试钱包 DAI持仓: ${ethers.formatEther(balanceDAI)}`);
    
    // 2. staticCall 模拟转账（不会真正执行）
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
};

main();
```

#### **Viem 版本**
```javascript
import { createPublicClient, http, formatEther, parseEther, parseAbiItem } from "viem";
import { mainnet } from "viem/chains";
import { walletMainNetByAlchemy as wallet } from './0_init_ethersjs.js';
import dotenv from "dotenv";
dotenv.config();

const publicClient = createPublicClient({
    chain: mainnet,
    transport: http(process.env.MAINNET_RPC_URL_ALCHEMY)
});

const addressDAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F';

const main = async () => {
    const address = await wallet.getAddress();
    const vitalikAddress = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
    
    // 1. 读取余额
    const balanceOfAbi = parseAbiItem("function balanceOf(address owner) view returns (uint256)");
    const balanceDAI = await publicClient.readContract({
        address: addressDAI,
        abi: [balanceOfAbi],
        functionName: 'balanceOf',
        args: [address]
    });
    console.log(`测试钱包 DAI持仓: ${formatEther(balanceDAI)}`);
    
    // 2. simulateContract 模拟转账（不会真正执行）
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
};

main();
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

### **6. 合约部署对比**

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

### **7. 事件查询对比**

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

### 8. **事件监听器对比**

#### **Ethers.js 版本**
```javascript
import { ethers } from "ethers";
import { contractAddressUSDT } from "./0_init.js";

const provider = new ethers.JsonRpcProvider("https://eth.merkle.io");
const contract = new ethers.Contract(contractAddressUSDT, [
    "event Transfer(address indexed from, address indexed to, uint256 value)"
], provider);

const main = async () => {
    console.log("正在连接到 USDT 合约:", contractAddressUSDT);
    
    // 1. 监听一次事件
    contract.once('Transfer', (from, to, value) => {
        console.log(`1. 监听到一次 Transfer 事件:`);
        console.log(`   从: ${from}`);
        console.log(`   到: ${to}`);
        console.log(`   金额: ${ethers.formatUnits(value, 6)} USDT`);
    });
    
    // 2. 持续监听事件
    contract.on('Transfer', (from, to, value) => {
        console.log(`2. 监听到 Transfer 事件:`);
        console.log(`   从: ${from}`);
        console.log(`   到: ${to}`);
        console.log(`   金额: ${ethers.formatUnits(value, 6)} USDT`);
    });
    
    console.log("监听器已启动，按 Ctrl+C 停止...");
};

main();
```

#### **Viem 版本**
```javascript
import { createPublicClient, http, formatUnits, parseAbiItem } from "viem";
import { mainnet } from "viem/chains";
import { contractAddressUSDT } from "./0_init_ethersjs.js";

const publicClient = createPublicClient({
    chain: mainnet,
    transport: http('https://eth.merkle.io')
});

const transferEvent = parseAbiItem("event Transfer(address indexed from, address indexed to, uint256 amount)");

const main = async () => {
    try {
        console.log("正在连接到 USDT 合约:", contractAddressUSDT);
        const blockNumber = await publicClient.getBlockNumber();
        console.log("当前区块高度:", blockNumber);
        
        // 由于 viem 的 WebSocket 支持有限，使用轮询方式模拟实时监听
        console.log("1. 使用轮询方式模拟实时监听 Transfer 事件");
        
        let lastProcessedBlock = Number(blockNumber);
        
        const pollEvents = async () => {
            try {
                const currentBlock = await publicClient.getBlockNumber();
                const currentBlockNumber = Number(currentBlock);
                
                if (currentBlockNumber > lastProcessedBlock) {
                    console.log(`检查区块 ${lastProcessedBlock + 1} 到 ${currentBlockNumber} 的事件...`);
                    
                    const events = await publicClient.getLogs({
                        address: contractAddressUSDT,
                        event: transferEvent,
                        fromBlock: BigInt(lastProcessedBlock + 1),
                        toBlock: currentBlock
                    });
                    
                    if (events.length > 0) {
                        console.log(`找到 ${events.length} 个新的 Transfer 事件:`);
                        events.forEach((log, index) => {
                            const from = '0x' + log.topics[1].slice(26);
                            const to = '0x' + log.topics[2].slice(26);
                            const value = formatUnits(log.data, 6);
                            console.log(`${index + 1}. ${from} -> ${to} ${value} USDT`);
                        });
                    }
                    lastProcessedBlock = currentBlockNumber;
                }
            } catch (error) {
                console.error("轮询错误:", error.message);
            }
        };
        
        const pollInterval = setInterval(pollEvents, 5000);
        
        // 查询最近的 Transfer 事件作为示例
        console.log("2. 查询最近10个区块的 Transfer 事件作为示例");
        const recentEvents = await publicClient.getLogs({
            address: contractAddressUSDT,
            event: transferEvent,
            fromBlock: blockNumber - 10n,
            toBlock: blockNumber
        });
        
        console.log(`最近10个区块中找到 ${recentEvents.length} 个 Transfer 事件`);
        
        if (recentEvents.length > 0) {
            console.log("最近的 Transfer 事件示例:");
            recentEvents.slice(0, 3).forEach((log, index) => {
                const from = '0x' + log.topics[1].slice(26);
                const to = '0x' + log.topics[2].slice(26);
                const value = formatUnits(log.data, 6);
                console.log(`${index + 1}. ${from} -> ${to} ${value} USDT`);
            });
        }
        
        console.log("轮询监听器已启动，按 Ctrl+C 停止...");
        
        setTimeout(() => {
            console.log("停止轮询监听...");
            clearInterval(pollInterval);
            process.exit(0);
        }, 20000);
        
    } catch (e) {
        console.log("连接错误:", e);
    }
};

main();
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