// 监听合约方法：
// 1. 持续监听
// contractUSDT.on("事件名", Listener)
// 2. 只监听一次
// contractUSDT.once("事件名", Listener)

import { ethers } from "ethers";
import { providerEthByAlchemy as provider, eventTransferAbi, contractAddressUSDT } from "./0_initWallet.js"

// 生成USDT合约对象
const contractUSDT = new ethers.Contract(contractAddressUSDT, [...eventTransferAbi], provider);

const main = async () => {
  // 监听USDT合约的Transfer事件

  try{
    // 只监听一次
    console.log("1. 利用contract.once()，监听一次Transfer事件");
    contractUSDT.once('Transfer', (from, to, value, event)=>{
      // 打印结果
      console.log(
        `ONCE:: ${from} -> ${to} ${ethers.formatUnits(ethers.getBigInt(value),6)} USDT`
      )
      
      // 安全地打印 event 对象的关键信息
			console.log("Event 所有对象属性:", Object.keys(event)) // [ 'filter', 'emitter', 'log', 'args', 'fragment' ]
			console.log("交易 详情:")
			console.log(event)
			// EventLog {
			// 	provider: JsonRpcProvider {},
			// 	transactionHash: '0xfdd611dae584c310e174abe4d7e668e8fa72c5f939644e673d2f5af1d38fdb02',
			// 	blockHash: '0xbfd41861b46f1dacfecfa154e3ddbe9b5f1861e14ffac0a441aa8d10e3dc2a65',
			// 	blockNumber: 22865210,
			// 	removed: false,
			// 	address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
			// 	data: '0x0000000000000000000000000000000000000000000000000000000077234480',
			// 	topics: [
			// 		'0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
			// 		'0x000000000000000000000000aeb4250eeb2cab09a52d280779a4abf813e7d727',
			// 		'0x0000000000000000000000005141b82f5ffda4c6fe1e372978f1c5427640a190'
			// 	],
			// 	index: 29,
			// 	transactionIndex: 2,
			// 	interface: Interface {
			// 		fragments: [ [EventFragment] ],
			// 		deploy: ConstructorFragment {
			// 			type: 'constructor',
			// 			inputs: [],
			// 			payable: false,
			// 			gas: null
			// 		},
			// 		fallback: null,
			// 		receive: false
			// 	},
			// 	fragment: EventFragment {
			// 		type: 'event',
			// 		inputs: [ [ParamType], [ParamType], [ParamType] ],
			// 		name: 'Transfer',
			// 		anonymous: false
			// 	},
			// 	args: Result(3) [
			// 		'0xaEB4250EEb2cAB09A52D280779A4abF813E7D727',
			// 		'0x5141B82f5fFDa4c6fE1E372978F1C5427640a190',
			// 		1998800000n
			// 	]
			// }
    })

    // 持续监听USDT合约
    console.log("2. 利用contract.on()，持续监听Transfer事件");
    contractUSDT.on('Transfer', (from, to, value, event)=>{
      console.log(
       `${from} -> ${to} ${ethers.formatUnits(ethers.getBigInt(value),6)} USDT`
      )
    })
// 0xaEB4250EEb2cAB09A52D280779A4abF813E7D727 -> 0x5141B82f5fFDa4c6fE1E372978F1C5427640a190 1998.8 USDT
// 0x5141B82f5fFDa4c6fE1E372978F1C5427640a190 -> 0xe0e0e08A6A4b9Dc7bD67BCB7aadE5cF48157d444 1998.8 USDT
// 0xc7bBeC68d12a0d1830360F8Ec58fA599bA1b0e9b -> 0xcFeF8898B6e95D17122695f2f1f1cb0369E7cE1B 148.586799 USDT

  }catch(e){
    console.log(e);

  } 
}
main()