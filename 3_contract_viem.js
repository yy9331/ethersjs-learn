import { createPublicClient, http } from "viem";
import { readContract } from "viem/actions";
import { mainnet } from "viem/chains";
import { abiERC20 } from "./3_contract_abiERC20_viem.js";

// 创建公共客户端
const client = createPublicClient({
    chain: mainnet,
    transport: http()
});

// 第一种输入 abi 的方式 - WETH 合约
const abiWETH = '[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"}]';

const addressWETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'; // WETH Contract

// 第2种输入abi的方式：使用完整的 ABI 格式
// viem 不支持人类可读的 ABI 格式，需要使用完整的 ABI

const addressDAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F'; // DAI Contract

const WTFContractInfo = async () => {
    try {
        // 1. 读取WETH合约的链上信息（WETH abi）
        console.log("1. 读取WETH合约信息");
        console.log(`合约地址: ${addressWETH}`); // 0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2
        
        // 使用 viem 的 readContract 函数读取合约信息
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
        
        const totalSupplyWETH = await readContract(client, {
            address: addressWETH,
            abi: JSON.parse(abiWETH),
            functionName: 'totalSupply'
        });
        
        console.log(`名称: ${nameWETH}`); // Wrapped Ether
        console.log(`代号: ${symbolWETH}`); // WETH
        console.log(`总供给: ${Number(totalSupplyWETH) / 10**18}`); // 转换为 ETH 单位
        
        // 读取 Vitalik 的 WETH 余额
        const vitalikWETHBalance = await readContract(client, {
            address: addressWETH,
            abi: JSON.parse(abiWETH),
            functionName: 'balanceOf',
            args: ['0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'] // Vitalik 的地址
        });
        
        console.log(`Vitalik持仓: ${Number(vitalikWETHBalance) / 10**18}`); // 转换为 ETH 单位

        // 2. 读取DAI合约的链上信息（IERC20接口合约)
        console.log("\n2. 读取DAI合约信息");
        
        const nameDAI = await readContract(client, {
            address: addressDAI,
            abi: abiERC20,
            functionName: 'name'
        });
        
        const symbolDAI = await readContract(client, {
            address: addressDAI,
            abi: abiERC20,
            functionName: 'symbol'
        });
        
        const totalSupplyDAI = await readContract(client, {
            address: addressDAI,
            abi: abiERC20,
            functionName: 'totalSupply'
        });
        
        console.log(`合约地址: ${addressDAI}`);
        console.log(`名称: ${nameDAI}`); // Dai Stablecoin
        console.log(`代号: ${symbolDAI}`); // DAI
        console.log(`总供给: ${Number(totalSupplyDAI) / 10**18}`); // 转换为 DAI 单位
        
        // 读取 Vitalik 的 DAI 余额
        const vitalikDAIBalance = await readContract(client, {
            address: addressDAI,
            abi: abiERC20,
            functionName: 'balanceOf',
            args: ['0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'] // Vitalik 的地址
        });
        
        console.log(`Vitalik持仓: ${Number(vitalikDAIBalance) / 10**18}`); // 转换为 DAI 单位
        
    } catch (error) {
        console.error("查询失败:", error.message);
    }
};

WTFContractInfo();
