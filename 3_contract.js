import { ethers } from 'ethers';

import dotenv from "dotenv";
dotenv.config();

const providerETH = new ethers.JsonRpcProvider(process.env.MAINNET_RPC_URL);
const providerSepolia = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);

// 第一种输入 abi 的方式
const abiWETH = '[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"}]';
const addressWETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' // WETH Contract
const contractWETH = new ethers.Contract(addressWETH, abiWETH, providerETH)
// console.log('contractWETH------->', contractWETH)


// 第2种输入abi的方式：输入程序需要用到的函数，逗号分隔，ethers会自动帮你转换成相应的abi
// 人类可读abi，以ERC20合约为例
const abiERC20 = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint)",
];
const addressDAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F' // DAI Contract
const contractDAI = new ethers.Contract(addressDAI, abiERC20, providerETH)
// console.log(`contractDAI========> ${contractDAI}`) // [object Object]
// console.log('------------- contractDAI -------------')
// console.dir(contractDAI, { depth: null });// [object Object]

const WTFContractInfo = async () => {
    // 1. 读取WETH合约的链上信息（WETH abi）
    const nameWETH = await contractWETH.name();
    const symbolWETH = await contractWETH.symbol();
    const totalSupply = await contractWETH.totalSupply();
    console.log("1. 读取WETH合约信息")
    console.log(`合约地址: ${addressWETH}`) //0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2
    console.log(`名称: ${nameWETH}`) // Wrapped Ether
    console.log(`代号: ${symbolWETH}`) // WETH
    console.log(`总供给: ${ethers.formatEther(totalSupply)}`) //2608925.082202719196244533
    console.log(`Vitalik持仓: ${ethers.formatEther(await contractWETH.balanceOf('vitalik.eth'))}`) // 0.0

    // 2. 读取DAI合约的链上信息（IERC20接口合约)
    console.log("2. 读取DAI合约信息")
    console.log(`合约地址: ${await contractDAI.name()}`) // Dai Stablecoin
    console.log(`名称: ${await contractDAI.symbol()}`) // DAI
    console.log(`代号: ${await contractDAI.totalSupply()}`) // 3608481559185393085212219753
    console.log(`总供给: ${ethers.formatEther(await contractDAI.totalSupply())}`) //3608481559.185393085212219753
    const balanceDAI = await contractDAI.balanceOf('vitalik.eth')
    console.log(`Vitalik持仓: ${ethers.formatEther(balanceDAI)}`) // 0.0
}

WTFContractInfo();