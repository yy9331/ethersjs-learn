import { ethers } from "ethers";
import { providerEthByAlchemy as provider, eventTransferAbi, balanceOfAbi, contractAddressUSDT, accountBinance } from "./0_init.js"

// 构建合约对象
const contractUSDT = new ethers.Contract(contractAddressUSDT, [...eventTransferAbi, ...balanceOfAbi], provider);

(async () => {
  try {
    // 1. 读取币安热钱包USDT余额
    console.log("1. 读取币安热钱包USDT余额")
    const balanceUSDT = await contractUSDT.balanceOf(accountBinance)
    console.log(`USDT余额: ${ethers.formatUnits(balanceUSDT,6)}\n`)

    // 2. 创建过滤器，监听转移USDT进交易所
    console.log("2. 创建过滤器，监听USDT转进交易所")
    // * bloom filter 的体现:
    // * filters.Transfer(AddrFrom, AddrTo) 函数中, AddrFrom 为 null, 所以只监听 AddrTo 的交易, 即进入 AddrTo 的交易
    const filterBinanceIn = contractUSDT.filters.Transfer(null, accountBinance);
    console.log("过滤器详情：")
    console.log(filterBinanceIn);
    contractUSDT.on(filterBinanceIn, (res) => {
      console.log('---------监听USDT进入交易所--------');
      console.log(
        `${res.args[0]} -> ${res.args[1]} ${ethers.formatUnits(res.args[2],6)}`
      )
    })

    // 3. 创建过滤器，监听交易所转出USDT
    const filterToBinanceOut = contractUSDT.filters.Transfer(accountBinance);
    console.log("3. 创建过滤器，监听USDT转出交易所")
    console.log("过滤器详情：")
    console.log(filterToBinanceOut);
    contractUSDT.on(filterToBinanceOut, (res) => {
      console.log('---------监听USDT转出交易所--------');
      console.log(
        `${res.args[0]} -> ${res.args[1]} ${ethers.formatUnits(res.args[2],6)}`
      )
    }
    );
  } catch (e) {
    console.log(e);
  }
})()