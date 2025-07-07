import { ethers } from "ethers";

import dotenv from "dotenv";
dotenv.config();

// 连接以太坊主网
export const providerEthBySepolia = new ethers.JsonRpcProvider(process.env.MAINNET_RPC_URL);
export const providerEthByAlchemy = new ethers.JsonRpcProvider(process.env.MAINNET_RPC_URL);
// 连接测试网
export const providerSepolia = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
export const providerAlchemy = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);

const privateKey = process.env.WALLET_PRIVATE_KEY

export const walletSepolia = new ethers.Wallet(privateKey, providerSepolia)
export const walletAlchemy = new ethers.Wallet(privateKey, providerAlchemy)

export const walletMainNetByAlchemy = new ethers.Wallet(privateKey, providerSepolia)
export const walletMainNetBySepolia = new ethers.Wallet(privateKey, providerEthBySepolia)
