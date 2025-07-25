import { createPublicClient, http, parseAbiItem } from "viem";
import { mainnet } from "viem/chains";
import { nameFunctionAbi, symbolFuncstionAbi, supportsInterfaceFunctionAbi } from './0_init_ethersjs.js';
import dotenv from "dotenv";
dotenv.config();

// ERC721的合约地址，这里用的BAYC
const addressBAYC = "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d";

// 创建公共客户端
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(process.env.MAINNET_RPC_URL_ALCHEMY)
});

// ERC721接口的ERC165 identifier
const selectorERC721 = "0x80ac58cd";

// 其他常用 identifier
// ERC1155: 0xd9b67a26
// ERC165: 0x01ffc9a7
// ERC2981 (版税): 0x2a55205a

const main = async () => {
  try {
    // 1. 读取ERC721合约的链上信息
    console.log("\n1. 读取ERC721合约信息");
    console.log(`合约地址: ${addressBAYC}`);
    
    // 使用 parseAbiItem 解析 ABI
    const nameAbi = parseAbiItem("function name() view returns (string)");
    const symbolAbi = parseAbiItem("function symbol() view returns (string)");
    const supportsInterfaceAbi = parseAbiItem("function supportsInterface(bytes4 interfaceId) view returns (bool)");
    
    const nameERC721 = await publicClient.readContract({
      address: addressBAYC,
      abi: [nameAbi],
      functionName: 'name'
    });
    
    const symbolERC721 = await publicClient.readContract({
      address: addressBAYC,
      abi: [symbolAbi],
      functionName: 'symbol'
    });
    
    console.log(`名称: ${nameERC721}`);
    console.log(`代号: ${symbolERC721}`);

    // 2. 利用ERC165的supportsInterface，确定合约是否为ERC721标准
    console.log("\n2. 利用ERC165的supportsInterface，确定合约是否为ERC721标准");
    
    const isERC721 = await publicClient.readContract({
      address: addressBAYC,
      abi: [supportsInterfaceAbi],
      functionName: 'supportsInterface',
      args: [selectorERC721]
    });
    
    console.log(`合约是否为ERC721标准: ${isERC721}`);
    
    // 3. 额外检查：验证其他接口支持情况
    console.log("\n3. 检查其他接口支持情况");
    
    const selectorERC1155 = "0xd9b67a26";
    const selectorERC165 = "0x01ffc9a7";
    const selectorERC2981 = "0x2a55205a";
    
    const isERC1155 = await publicClient.readContract({
      address: addressBAYC,
      abi: [supportsInterfaceAbi],
      functionName: 'supportsInterface',
      args: [selectorERC1155]
    });
    
    const isERC165 = await publicClient.readContract({
      address: addressBAYC,
      abi: [supportsInterfaceAbi],
      functionName: 'supportsInterface',
      args: [selectorERC165]
    });
    
    const isERC2981 = await publicClient.readContract({
      address: addressBAYC,
      abi: [supportsInterfaceAbi],
      functionName: 'supportsInterface',
      args: [selectorERC2981]
    });
    
    console.log(`是否为ERC1155标准: ${isERC1155}`);
    console.log(`是否为ERC165标准: ${isERC165}`);
    console.log(`是否支持ERC2981版税: ${isERC2981}`);
    
  } catch (e) {
    // 如果不是ERC721，则会报错
    console.log("检查失败:", e.message);
  }
}

main();
// 1. 读取ERC721合约信息
// 合约地址: 0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d
// 名称: BoredApeYachtClub
// 代号: BAYC

// 2. 利用ERC165的supportsInterface，确定合约是否为ERC721标准
// 合约是否为ERC721标准: true

// 3. 检查其他接口支持情况
// 是否为ERC1155标准: false
// 是否为ERC165标准: true
// 是否支持ERC2981版税: false