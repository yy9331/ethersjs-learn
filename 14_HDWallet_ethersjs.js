import { ethers } from "ethers";

// HD钱包（Hierarchical Deterministic Wallet，多层确定性钱包）
// 1. 创建HD钱包 (ethers V6)
console.log("\n1. 创建HD钱包")
// 生成随机助记词
const mnemonic = ethers.Mnemonic.entropyToPhrase(ethers.randomBytes(32))
// 创建HD基钱包
// 基路径："m / purpose' / coin_type' / account' / change"
const basePath = "44'/60'/0'/0"
const baseWallet = ethers.HDNodeWallet.fromPhrase(mnemonic, basePath)
console.log(baseWallet);

// 2. 通过HD钱包派生20个钱包
console.log("\n2. 通过HD钱包派生20个钱包")
const numWallet = 20
// 派生路径：基路径 + "/ address_index"
// 我们只需要提供最后一位address_index的字符串格式，就可以从baseWallet派生出新钱包。V6中不需要重复提供基路径！
let wallets = [];
for (let i = 0; i < numWallet; i++) {

    let baseWalletNew = baseWallet.derivePath(i.toString());
    console.log(`第${i+1}个钱包地址： ${baseWalletNew.address}`)
    wallets.push(baseWalletNew);
}

// 3. 保存钱包（加密json）
console.log("\n3. 保存钱包（加密json）")
const wallet = ethers.Wallet.fromPhrase(mnemonic)
console.log("通过助记词创建钱包：")
console.log(wallet)
// 加密json用的密码，可以更改成别的
const pwd = "password"
const json = await wallet.encrypt(pwd)
console.log("钱包的加密json：")
console.log(json)

// 4. 从加密json读取钱包
const wallet2 = await ethers.Wallet.fromEncryptedJson(json, pwd);
console.log("\n4. 从加密json读取钱包：")
console.log(wallet2)

/**
1. 创建HD钱包
HDNodeWallet {
  provider: null,
  address: '0x9E6B4Fa831e6e38Ac7Ac497E7fc6D65A85BbAD89',
  publicKey: '0x030b2c4bdb27bd3693e67cc3242188c96f69d3b63164046e9357e437b0c9fd6521',
  fingerprint: '0x4d5ef013',
  parentFingerprint: '0x9007376a',
  mnemonic: Mnemonic {
    phrase: 'please fury push puppy estate smart pull primary blood ready royal traffic author panel lizard session will sight large lab physical clown visit sorry',
    password: "44'/60'/0'/0",
    wordlist: LangEn { locale: 'en' },
    entropy: '0xa66bcebad704d7992b555517f65af2f360f73f20b622fb3905f4be0a3e583d36'
  },
  chainCode: '0xd5d775eb679a37871a4b4b35cc36a1f83b0f1008eb7f36ca2f720a968f01d0ba',
  path: "m/44'/60'/0'/0/0",
  index: 0,
  depth: 5
}

2. 通过HD钱包派生20个钱包
第1个钱包地址： 0xcf6F038785A80c11d58A15185C85b767F7819261
第2个钱包地址： 0x47dD55D0c59A93EC739B6C7aFAD74E0BBa7FFd32
第3个钱包地址： 0xabDcaE4EC379F6e9Ef0C1d03411123A73cC5b312
第4个钱包地址： 0x5Af27EA7c84423314BEe0Df5D6a964281F03bedC
第5个钱包地址： 0xFE67862b14eFDf0ABEB25EfD29EECc8C996DAbB1
第6个钱包地址： 0xfDc93123B35Be40CACAd7fEAb26E40AA4FcBbC1e
第7个钱包地址： 0x5b8d5462b733E176e397aA24e227d2E98a20D9ED
第8个钱包地址： 0x3ED0e45146CebeFb09d06a2d8DF3Ec0Dd882fF9D
第9个钱包地址： 0x87AaB125142F6A170D8189B55e79A0c560fe78A7
第10个钱包地址： 0x5Af6768A8EA5215eB29244Ac348734Fc72A5d0e1
第11个钱包地址： 0x43A1F6e8ce56A69FfdfE8e4A7b0F61A3Ff43Cb12
第12个钱包地址： 0x5d4921a44c1B833B72dAe635cc8636ea36f78232
第13个钱包地址： 0xbb29A7c6cfDbC067C5A77b1A93099687830C385d
第14个钱包地址： 0xb63E5533043074910ce8be06C1fd10792dE55b89
第15个钱包地址： 0xEEBE0B89da995488497766973ea0706c64c6c638
第16个钱包地址： 0x324993b09435578cA83e33a9A8a4c4fcBc332D52
第17个钱包地址： 0xe1D671BCB388501E86900dF280be424e29BB49B8
第18个钱包地址： 0xb9F36Ce65Ff6c1fA4814D7CBcDaEcc5c0770a6Ec
第19个钱包地址： 0x6e85Fe56759382Af2B98872e5Ba50EDBAC9FE25D
第20个钱包地址： 0xE371CD44Ee31605C1c2849aFDDCA32C38fCD9c7D

3. 保存钱包（加密json）
通过助记词创建钱包：
HDNodeWallet {
  provider: null,
  address: '0x6DbFF3576f3aD7a236deB50B5ec971e7586A2F2B',
  publicKey: '0x03b73c04011b86202188405801305ee4bb6ba2d58a1a9bfbf4b7463ae6ad20d922',
  fingerprint: '0x912c0a4b',
  parentFingerprint: '0x2f9883d0',
  mnemonic: Mnemonic {
    phrase: 'please fury push puppy estate smart pull primary blood ready royal traffic author panel lizard session will sight large lab physical clown visit sorry',
    password: '',
    wordlist: LangEn { locale: 'en' },
    entropy: '0xa66bcebad704d7992b555517f65af2f360f73f20b622fb3905f4be0a3e583d36'
  },
  chainCode: '0xa0393463733358e30dc22742fe06d6f3a60cf873fa5faefd9d3c22f62c62043b',
  path: "m/44'/60'/0'/0/0",
  index: 0,
  depth: 5
}
钱包的加密json：
{"address":"6dbff3576f3ad7a236deb50b5ec971e7586a2f2b","id":"9269422d-2c83-4506-9aa4-ab0bf186428e","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"b6905a9915f2fd2285cffe90156d15dd"},"ciphertext":"6010354dacc17d2670ce627e238e7fe73b89dee9b9b7b956c99684184f0cbfca","kdf":"scrypt","kdfparams":{"salt":"5d88801cf04b36de1f12916b8e395e20a10cded9121c654dd61e038abf33bc47","n":131072,"dklen":32,"p":1,"r":8},"mac":"ba054c112bac4c7420cb3c80fd7b41ed31c8e2d65c5198a8ea9bda42ac5e9bf5"},"x-ethers":{"client":"ethers/6.15.0","gethFilename":"UTC--2025-07-26T02-18-28.0Z--6dbff3576f3ad7a236deb50b5ec971e7586a2f2b","path":"m/44'/60'/0'/0/0","locale":"en","mnemonicCounter":"514063314faa4d2b5366da7f5cd2ee8c","mnemonicCiphertext":"646a1db215d53c20f89afcb1ec3661567f689575368a1963b2333eca55558b2f","version":"0.1"}}

4. 从加密json读取钱包：
HDNodeWallet {
  provider: null,
  address: '0x6DbFF3576f3aD7a236deB50B5ec971e7586A2F2B',
  publicKey: '0x03b73c04011b86202188405801305ee4bb6ba2d58a1a9bfbf4b7463ae6ad20d922',
  fingerprint: '0x912c0a4b',
  parentFingerprint: '0x2f9883d0',
  mnemonic: Mnemonic {
    phrase: 'please fury push puppy estate smart pull primary blood ready royal traffic author panel lizard session will sight large lab physical clown visit sorry',
    password: '',
    wordlist: LangEn { locale: 'en' },
    entropy: '0xa66bcebad704d7992b555517f65af2f360f73f20b622fb3905f4be0a3e583d36'
  },
  chainCode: '0xa0393463733358e30dc22742fe06d6f3a60cf873fa5faefd9d3c22f62c62043b',
  path: "m/44'/60'/0'/0/0",
  index: 0,
  depth: 5
}
 */