import { generateMnemonic, mnemonicToAccount, hdKeyToAccount, generatePrivateKey } from "viem/accounts";
import { createWalletClient, http } from "viem";
import { sepolia } from "viem/chains";
import { HDKey } from "@scure/bip32";
import { mnemonicToSeed } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";
import dotenv from "dotenv";
dotenv.config();

// HD钱包（Hierarchical Deterministic Wallet，多层确定性钱包）
const main = async () => {
  // 1. 创建HD钱包 (viem)
  console.log("\n1. 创建HD钱包");
  // 生成随机助记词
  const mnemonic = generateMnemonic(wordlist);
  console.log("生成的助记词：", mnemonic);
  
  // 创建HD基钱包
  // 基路径："m / purpose' / coin_type' / account' / change"
  const basePath = "m/44'/60'/0'/0";
  const seed = await mnemonicToSeed(mnemonic);
  const hdKey = HDKey.fromMasterSeed(seed);
  const baseWallet = hdKeyToAccount(hdKey, { path: basePath });
  console.log("基钱包：", baseWallet);

  // 2. 通过HD钱包派生20个钱包
  console.log("\n2. 通过HD钱包派生20个钱包");
  const numWallet = 20;
  // 派生路径：基路径 + "/ address_index"
  let wallets = [];
  for (let i = 0; i < numWallet; i++) {
    const derivePath = `${basePath}/${i}`;
    const derivedWallet = hdKeyToAccount(hdKey, { path: derivePath });
    console.log(`第${i + 1}个钱包地址： ${derivedWallet.address}`);
    wallets.push(derivedWallet);
  }

  // 3. 从助记词创建钱包
  console.log("\n3. 从助记词创建钱包");
  const wallet = mnemonicToAccount(mnemonic);
  console.log("通过助记词创建钱包：");
  console.log(wallet);

  // 4. 创建钱包客户端
  const walletClient = createWalletClient({
    account: wallet,
    chain: sepolia,
    transport: http()
  });
  console.log("钱包客户端：", walletClient);

  // 5. 生成随机私钥
  console.log("\n4. 生成随机私钥");
  const privateKey = generatePrivateKey();
  const randomWallet = mnemonicToAccount(mnemonic, { accountIndex: 0 });
  console.log("随机私钥钱包：", randomWallet);

  // 6. 演示不同路径的钱包派生
  console.log("\n5. 演示不同路径的钱包派生");
  const paths = [
    "m/44'/60'/0'/0/0",  // 第一个外部地址
    "m/44'/60'/0'/0/1",  // 第二个外部地址
    "m/44'/60'/0'/1/0",  // 第一个内部地址（找零地址）
    "m/44'/60'/1'/0/0",  // 第二个账户
  ];

  paths.forEach((path, index) => {
    const derivedAccount = hdKeyToAccount(hdKey, { path });
    console.log(`路径 ${path}: ${derivedAccount.address}`);
  });
};

main().catch(console.error); 
// 1. 创建HD钱包
// 生成的助记词： render canoe banana cruel render hurdle tenant elephant artist loud danger until
// 基钱包： {
//   address: '0x68B052D37D36fCB34CA7aD0477cB844c492a763B',
//   nonceManager: undefined,
//   sign: [AsyncFunction: sign],
//   signAuthorization: [AsyncFunction: signAuthorization],
//   signMessage: [AsyncFunction: signMessage],
//   signTransaction: [AsyncFunction: signTransaction],
//   signTypedData: [AsyncFunction: signTypedData],
//   source: 'hd',
//   type: 'local',
//   publicKey: '0x04c5ab1c9193ae7b04f252383605de3842fee1f031a3b49119c46680c474cc1979272872ab28a0720895e7949b8c65f3de0cd74a65d1e686a86472d9771cfe6561',
//   getHdKey: [Function: getHdKey]
// }

// 2. 通过HD钱包派生20个钱包
// 第1个钱包地址： 0xf899eDa3799f22d1D9910Ebac5aDD9909Df33F50
// 第2个钱包地址： 0xc0697Bd458584f50FF8ba67eDC97f908e980173a
// 第3个钱包地址： 0x43793c60F8B778713fA7C7aD2A41D54D72732538
// 第4个钱包地址： 0xdEE48c5883A7C2a02fC2fCE41518FA59E2CeC749
// 第5个钱包地址： 0xB0e629816dA357FfbFce1e7393b19a964482A328
// 第6个钱包地址： 0xc10F4070F23e50797f67d1b970Ea7a561B30Ee76
// 第7个钱包地址： 0xe40427De47B1101119270473BcFAA9f757E08541
// 第8个钱包地址： 0x7b741fcFe16588c7D871b6d4885A422213710F2C
// 第9个钱包地址： 0x9c05F1Bbf0bfE2a1a4F8896de533722b73ff94b8
// 第10个钱包地址： 0x380f4c2F160aaeD8FbD37dcAb95Ad0ECCD23b0fE
// 第11个钱包地址： 0x6704141A29FBe29BDa816AC933D76E7E507Ed381
// 第12个钱包地址： 0xe974Ac83276d84ac9F8A399e48943348e0Ed3689
// 第13个钱包地址： 0xbcDBBABE82Dbce81c438ad1D6A11e1948da77E29
// 第14个钱包地址： 0x97a2483C7c276aD1Cd8c2CaFcd5765790fe0b195
// 第15个钱包地址： 0x9D537344a7A8055Ab05d0581CF23510988B3140f
// 第16个钱包地址： 0x511f910E11Bd2429FeE8f493B879e0F94C770a7F
// 第17个钱包地址： 0xE3E4eaC08fd62bB9b7A859B06D90a3f851232511
// 第18个钱包地址： 0x477D72DE41666B490B180c39E1cFC6A779B2DB5D
// 第19个钱包地址： 0x6D8f50c0b23217cCa8c030Fd7066869D64DA0c3F
// 第20个钱包地址： 0x678b8B5cF0052Aa6220F0cD09584B4e6a5B9566A

// 3. 从助记词创建钱包
// 通过助记词创建钱包：
// {
//   address: '0xf899eDa3799f22d1D9910Ebac5aDD9909Df33F50',
//   nonceManager: undefined,
//   sign: [AsyncFunction: sign],
//   signAuthorization: [AsyncFunction: signAuthorization],
//   signMessage: [AsyncFunction: signMessage],
//   signTransaction: [AsyncFunction: signTransaction],
//   signTypedData: [AsyncFunction: signTypedData],
//   source: 'hd',
//   type: 'local',
//   publicKey: '0x045ec90fe6bd36bbc699e6300ea13fcc242af002bd1a9095ce871c7cb637298bf2f9ee518b838563d5e5f74b774bf1dec4add0509d014e961bdf054d3d2ef96918',
//   getHdKey: [Function: getHdKey]
// }
// 钱包客户端： {
//   account: {
//     address: '0xf899eDa3799f22d1D9910Ebac5aDD9909Df33F50',
//     nonceManager: undefined,
//     sign: [AsyncFunction: sign],
//     signAuthorization: [AsyncFunction: signAuthorization],
//     signMessage: [AsyncFunction: signMessage],
//     signTransaction: [AsyncFunction: signTransaction],
//     signTypedData: [AsyncFunction: signTypedData],
//     source: 'hd',
//     type: 'local',
//     publicKey: '0x045ec90fe6bd36bbc699e6300ea13fcc242af002bd1a9095ce871c7cb637298bf2f9ee518b838563d5e5f74b774bf1dec4add0509d014e961bdf054d3d2ef96918',
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
//   uid: 'c9fa6a48643',
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
//   address: '0xf899eDa3799f22d1D9910Ebac5aDD9909Df33F50',
//   nonceManager: undefined,
//   sign: [AsyncFunction: sign],
//   signAuthorization: [AsyncFunction: signAuthorization],
//   signMessage: [AsyncFunction: signMessage],
//   signTransaction: [AsyncFunction: signTransaction],
//   signTypedData: [AsyncFunction: signTypedData],
//   source: 'hd',
//   type: 'local',
//   publicKey: '0x045ec90fe6bd36bbc699e6300ea13fcc242af002bd1a9095ce871c7cb637298bf2f9ee518b838563d5e5f74b774bf1dec4add0509d014e961bdf054d3d2ef96918',
//   getHdKey: [Function: getHdKey]
// }

// 5. 演示不同路径的钱包派生
// 路径 m/44'/60'/0'/0/0: 0xf899eDa3799f22d1D9910Ebac5aDD9909Df33F50
// 路径 m/44'/60'/0'/0/1: 0xc0697Bd458584f50FF8ba67eDC97f908e980173a
// 路径 m/44'/60'/0'/1/0: 0x64989D9e0c68cAd57B52A9f718FA60a81bb270d8
// 路径 m/44'/60'/1'/0/0: 0x65D33897E37b82F6944E234070fe23af2cd696E9