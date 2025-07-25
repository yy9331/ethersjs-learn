import { createPublicClient, http, formatUnits, parseAbiItem } from "viem";
import { mainnet } from "viem/chains";
import { contractAddressUSDT, accountBinance } from "./0_init_ethersjs.js";

// 创建公共客户端
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http('https://eth.merkle.io') // 使用免费的公共 RPC
});

// 定义 Transfer 事件
const transferEvent = parseAbiItem("event Transfer(address indexed from, address indexed to, uint256 amount)");

// 定义 balanceOf 函数
const balanceOfAbi = parseAbiItem("function balanceOf(address owner) view returns (uint256)");

const main = async () => {
  try {
    // 1. 读取币安热钱包USDT余额
    console.log("1. 读取币安热钱包USDT余额");
    const balanceUSDT = await publicClient.readContract({
      address: contractAddressUSDT,
      abi: [balanceOfAbi],
      functionName: 'balanceOf',
      args: [accountBinance]
    });
    console.log(`USDT余额: ${formatUnits(balanceUSDT, 6)}\n`);

    // 2. 创建过滤器，监听转移USDT进交易所
    console.log("2. 创建过滤器，监听USDT转进交易所");
    console.log("过滤器详情：监听转入币安热钱包的交易");
    
    // 使用轮询方式模拟实时监听
    let lastProcessedBlock = await publicClient.getBlockNumber();
    
    const pollBinanceInEvents = async () => {
      try {
        const currentBlock = await publicClient.getBlockNumber();
        
        if (currentBlock > lastProcessedBlock) {
          // 查询转入币安热钱包的事件
          const events = await publicClient.getLogs({
            address: contractAddressUSDT,
            event: transferEvent,
            args: {
              to: accountBinance // 只监听转入币安热钱包的事件
            },
            fromBlock: lastProcessedBlock + 1n,
            toBlock: currentBlock
          });
          
          if (events.length > 0) {
            console.log('---------监听USDT进入交易所--------');
            events.forEach((log, index) => {
              const from = '0x' + log.topics[1].slice(26);
              const to = '0x' + log.topics[2].slice(26);
              const value = formatUnits(log.data, 6);
              console.log(`${index + 1}. ${from} -> ${to} ${value} USDT`);
            });
          }
          
          lastProcessedBlock = currentBlock;
        }
      } catch (error) {
        console.error("轮询转入事件错误:", error.message);
      }
    };

    // 3. 创建过滤器，监听交易所转出USDT
    console.log("3. 创建过滤器，监听USDT转出交易所");
    console.log("过滤器详情：监听转出币安热钱包的交易");
    
    const pollBinanceOutEvents = async () => {
      try {
        const currentBlock = await publicClient.getBlockNumber();
        
        if (currentBlock > lastProcessedBlock) {
          // 查询转出币安热钱包的事件
          const events = await publicClient.getLogs({
            address: contractAddressUSDT,
            event: transferEvent,
            args: {
              from: accountBinance // 只监听转出币安热钱包的事件
            },
            fromBlock: lastProcessedBlock + 1n,
            toBlock: currentBlock
          });
          
          if (events.length > 0) {
            console.log('---------监听USDT转出交易所--------');
            events.forEach((log, index) => {
              const from = '0x' + log.topics[1].slice(26);
              const to = '0x' + log.topics[2].slice(26);
              const value = formatUnits(log.data, 6);
              console.log(`${index + 1}. ${from} -> ${to} ${value} USDT`);
            });
          }
          
          lastProcessedBlock = currentBlock;
        }
      } catch (error) {
        console.error("轮询转出事件错误:", error.message);
      }
    };

    // 开始轮询监听
    console.log("开始轮询监听币安热钱包的 USDT 转入转出事件...");
    console.log("按 Ctrl+C 停止监听");
    
    // 每5秒检查一次转入事件
    const pollInInterval = setInterval(pollBinanceInEvents, 5000);
    
    // 每5秒检查一次转出事件
    const pollOutInterval = setInterval(pollBinanceOutEvents, 5000);
    
    // 查询最近的转入转出事件作为示例
    console.log("\n4. 查询最近10个区块的币安热钱包转入转出事件作为示例");
    
    const recentBlock = await publicClient.getBlockNumber();
    
    // 查询最近的转入事件
    const recentInEvents = await publicClient.getLogs({
      address: contractAddressUSDT,
      event: transferEvent,
      args: {
        to: accountBinance
      },
      fromBlock: recentBlock - 10n,
      toBlock: recentBlock
    });
    
    console.log(`最近10个区块中找到 ${recentInEvents.length} 个转入币安热钱包的事件`);
    if (recentInEvents.length > 0) {
      console.log("最近的转入事件示例:");
      recentInEvents.slice(0, 3).forEach((log, index) => {
        const from = '0x' + log.topics[1].slice(26);
        const to = '0x' + log.topics[2].slice(26);
        const value = formatUnits(log.data, 6);
        console.log(`${index + 1}. ${from} -> ${to} ${value} USDT`);
      });
    }
    
    // 查询最近的转出事件
    const recentOutEvents = await publicClient.getLogs({
      address: contractAddressUSDT,
      event: transferEvent,
      args: {
        from: accountBinance
      },
      fromBlock: recentBlock - 10n,
      toBlock: recentBlock
    });
    
    console.log(`最近10个区块中找到 ${recentOutEvents.length} 个转出币安热钱包的事件`);
    if (recentOutEvents.length > 0) {
      console.log("最近的转出事件示例:");
      recentOutEvents.slice(0, 3).forEach((log, index) => {
        const from = '0x' + log.topics[1].slice(26);
        const to = '0x' + log.topics[2].slice(26);
        const value = formatUnits(log.data, 6);
        console.log(`${index + 1}. ${from} -> ${to} ${value} USDT`);
      });
    }
    
    // 保持程序运行，让轮询继续工作
    setTimeout(() => {
      console.log("停止轮询监听...");
      clearInterval(pollInInterval);
      clearInterval(pollOutInterval);
      process.exit(0);
    }, 120000); // 30秒后停止

  } catch (e) {
    console.log("连接错误:", e);
  }
};

main();
// 1. 读取币安热钱包USDT余额
// USDT余额: 720727773.749522

// 2. 创建过滤器，监听USDT转进交易所
// 过滤器详情：监听转入币安热钱包的交易
// 3. 创建过滤器，监听USDT转出交易所
// 过滤器详情：监听转出币安热钱包的交易
// 开始轮询监听币安热钱包的 USDT 转入转出事件...
// 按 Ctrl+C 停止监听

// 4. 查询最近10个区块的币安热钱包转入转出事件作为示例
// 最近10个区块中找到 1 个转入币安热钱包的事件
// 最近的转入事件示例:
// 1. 0xb3e8c75912438c2282e0afa51b41bff8e835bc88 -> 0x28c6c06298d514db089934071355e5743bf21d60 0x0000000000000000000000000000000000000000000000000000001a3a.4a1f3c USDT
// 最近10个区块中找到 2 个转出币安热钱包的事件
// 最近的转出事件示例:
// 1. 0x28c6c06298d514db089934071355e5743bf21d60 -> 0xfcb7c8ecc0299d1891b9ed86c176cff7616c0c9b 0x000000000000000000000000000000000000000000000000000000003b.83e6a USDT
// 2. 0x28c6c06298d514db089934071355e5743bf21d60 -> 0xf4cf2bdab7eefef77c677ac00aa01e11998f09cd 0x0000000000000000000000000000000000000000000000000000000001.dde7c USDT
// ---------监听USDT转出交易所--------
// 1. 0x28c6c06298d514db089934071355e5743bf21d60 -> 0x0a12aed0ca690fc1ae9184594dd02b60f7246fb0 0x00000000000000000000000000000000000000000000000000000000c2.470bb9 USDT
// ---------监听USDT转出交易所--------
// 1. 0x28c6c06298d514db089934071355e5743bf21d60 -> 0x6d9c0af604251af5e433f4e676febe7cb0860d11 0x000000000000000000000000000000000000000000000000000000000e.df116 USDT
// ---------监听USDT转出交易所--------
// 1. 0x28c6c06298d514db089934071355e5743bf21d60 -> 0x6d9c0af604251af5e433f4e676febe7cb0860d11 0x000000000000000000000000000000000000000000000000000000000e.df116 USDT
// 停止轮询监听...