import { ethers } from "ethers";

import dotenv from "dotenv";
dotenv.config();

// 某个USDT 合约地址
export const contractAddressUSDT = '0xdac17f958d2ee523a2206206994597c13d831ec7'
// 币安交易所地址
export const accountBinance = '0x28C6c06298d514Db089934071355E5743bf21d60'
// DAI 币地址:
export const addressDAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
// 我的Zy币地址
export const myZyTokenContractAddr = '0xF6b88086F76eC3E772CBE9cF32Ca591E265Cd232'
export const myZyWalletAddr = '0xbd61c00E4B7C2a77Cd660304ddd852379F705ED6'

// 标准 WETH 地址:
// 主网
export const wethMainNet = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
// Sepolia 测试网 WETH  
export const wethSepolia = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14"
// Goerli 测试网 WETH
export const wethGoerli = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6"

const privateKey = process.env.WALLET_PRIVATE_KEY

// 连接以太坊主网 provider:
export const providerEthByInfura = new ethers.JsonRpcProvider(process.env.MAINNET_RPC_URL_INFURA); // Infura
export const providerEthByAlchemy = new ethers.JsonRpcProvider(process.env.MAINNET_RPC_URL_ALCHEMY); // Alchemy
// 连接测试网 Sepolia provider:
export const providerSepoliaInfura = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL_INFURA); // Infura
export const providerSepoliaAlchemy = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL_ALCHEMY); // Alchemy

// 主网 wallet:
export const walletMainNetByInfura = new ethers.Wallet(privateKey, providerEthByInfura) // Infura
export const walletMainNetByAlchemy = new ethers.Wallet(privateKey, providerEthByAlchemy) // Alchemy
// 测试网Sepolia wallet:
export const walletSepoliaInfura = new ethers.Wallet(privateKey, providerSepoliaInfura) // Infura
export const walletSepoliaAlchemy = new ethers.Wallet(privateKey, providerSepoliaAlchemy) // Alchemy

// abi
export const eventTransferAbi= ["event Transfer(address indexed from, address indexed to, uint value)"]
export const eventWithdrawalAbi = ["event Withdrawal(address indexed src, uint256 wad)"]
export const balanceOfAbi= ["function balanceOf(address) public view returns(uint)"]
export const nameFunctionAbi= ["function name() view returns (string)"]
export const symbolFuncstionAbi = ["function symbol() view returns (string)",]
export const supportsInterfaceFunctionAbi = ["function supportsInterface(bytes4) public view returns(bool)"]
export const depositFunctionAbi = ["function deposit() payable"]
export const approveFunctionAbi = ["function approve(address spender, uint256 amount) returns (bool)"]
