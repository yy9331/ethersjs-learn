// 人类可读的 ABI 格式:
const abiERC20 = [
    "constructor(string name_, string symbol_)",
    "event Approval(address indexed owner, address indexed spender, uint256 value)",
    "event Transfer(address indexed from, address indexed to, uint256 value)",
    "function allowance(address , address ) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function balanceOf(address ) view returns (uint256)",
    "function burn(uint256 amount)",
    "function decimals() view returns (uint8)",
    "function mint(uint256 amount)",
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function transfer(address recipient, uint256 amount) returns (bool)",
    "function transferFrom(address sender, address recipient, uint256 amount) returns (bool)"
]

export default abiERC20;