import { ethers } from "ethers";

import dotenv from "dotenv";
dotenv.config();

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
export const balanceOfAbi= ["function balanceOf(address) public view returns(uint)"]

// 某个USDT 合约地址
export const contractAddressUSDT = '0xdac17f958d2ee523a2206206994597c13d831ec7'
// 币安交易所地址
export const accountBinance = '0x28C6c06298d514Db089934071355E5743bf21d60'
