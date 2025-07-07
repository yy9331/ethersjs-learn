import { ethers } from "ethers";
import { providerETHBySepolia as provider } from "./0_initWallet.js"

// WETH ABI，只包含我们关心的Transfer事件
const abiWETH = [
    "event Transfer(address indexed from, address indexed to, uint amount)"
];

// 测试网WETH地址
const addressWETH = '0xF6b88086F76eC3E772CBE9cF32Ca591E265Cd232'
// 声明合约实例
const contract = new ethers.Contract(addressWETH, abiWETH, provider)


// 查询事件的函数
const queryEvents = async (fromBlock, toBlock) => {
    try {
        const events = await contract.queryFilter('Transfer', fromBlock, toBlock);
        return events;
    } catch (error) {
        console.error("查询事件时发生错误:", error.message);
        return null;
    }
};

// 打印事件详情的函数
const printEventDetails = (events, blockRange) => {
    console.log(`在${blockRange}中找到 ${events.length} 个Transfer事件`);
    
    if (events.length > 0) {
        console.log("打印事件详情:");
        console.log(events[0]);
        // EventLog {
        //     provider: JsonRpcProvider {},
        //     transactionHash: '0xadd8d9ff5f4f731959d1a4e2d4e0fb9d463b3192e49392353400b12fd6f2cf39',
        //     blockHash: '0x424e7fd1c02a04a25a05cb2fc61e6a1054b008890f76ab0de2e9b8c3e05c0d72',
        //     blockNumber: 8708949,
        //     removed: false,
        //     address: '0xF6b88086F76eC3E772CBE9cF32Ca591E265Cd232',
        //     data: '0x00000000000000000000000000000000000000000000424edd92f4dbd9cc0000',
        //     topics: [
        //       '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        //       '0x000000000000000000000000bd61c00e4b7c2a77cd660304ddd852379f705ed6',
        //       '0x0000000000000000000000005a7157d6fd2ad4a9edc4686758be77ae480bfe6a'
        //     ],
        //     index: 8,
        //     transactionIndex: 13,
        //     interface: Interface {
        //       fragments: [ [EventFragment] ],
        //       deploy: ConstructorFragment {
        //         type: 'constructor',
        //         inputs: [],
        //         payable: false,
        //         gas: null
        //       },
        //       fallback: null,
        //       receive: false
        //     },
        //     fragment: EventFragment {
        //       type: 'event',
        //       inputs: [ [ParamType], [ParamType], [ParamType] ],
        //       name: 'Transfer',
        //       anonymous: false
        //     },
        //     args: Result(3) [
        //       '0xbd61c00E4B7C2a77Cd660304ddd852379F705ED6',
        //       '0x5A7157d6Fd2aD4A9Edc4686758bE77aE480bfe6A',
        //       313131000000000000000000n
        //     ]
        //   }
        
        console.log("\n2. 解析事件：");
        const amount = ethers.formatUnits(ethers.getBigInt(events[0].args["amount"]), "ether");
        console.log(`地址 ${events[0].args["from"]} 转账${amount} WETH 到地址 ${events[0].args["to"]}`);
        return true;
    }
    return false;
};

const main = async () => {
    console.log("\n1. 获取过去100个区块内的Transfer事件，并打印出1个");
    
    const block = await provider.getBlockNumber();
    console.log(`当前区块高度: ${block}`);
    
    // 查询最近10个区块的事件
    let events = await queryEvents(block - 10, block);
    
    if (events && events.length > 0) {
        printEventDetails(events, "最近10个区块");
        return;
    }
    
    console.log("在最近10个区块内没有找到Transfer事件");
    console.log("尝试查询更早的区块...");
    
    // 查询更早的区块
    events = await queryEvents(block - 100, block);
    if (events && events.length > 0) {
        printEventDetails(events, "更早的区块");
        return;
    }
    
    console.log("在最近100个区块内都没有找到Transfer事件");
    console.log("可能的原因：");
    console.log("1. WETH合约地址可能不正确");
    console.log("2. 该合约在Sepolia测试网上可能不活跃");
    console.log("3. 需要查询更早的区块或使用不同的合约地址");
};

main();
