import fs from "fs";

// 读取 JSON ABI 文件
const jsonAbi = JSON.parse(fs.readFileSync('./6_abi.json', 'utf8'));

// 将 JSON ABI 转换为人类可读格式
function convertToHumanReadable(abi) {
    const humanReadableAbi = [];
    
    abi.forEach(item => {
        if (item.type === 'constructor') {
            // 处理构造函数
            const inputs = item.inputs.map(input => `${input.type} ${input.name}`).join(', ');
            humanReadableAbi.push(`constructor(${inputs})`);
        } else if (item.type === 'function') {
            // 处理函数
            const inputs = item.inputs.map(input => `${input.type} ${input.name}`).join(', ');
            const outputs = item.outputs.map(output => output.type).join(', ');
            
            let functionStr = `function ${item.name}(${inputs})`;
            
            if (item.stateMutability === 'view' || item.stateMutability === 'pure') {
                functionStr += ` view`;
            }
            if (item.stateMutability === 'payable') {
                functionStr += ` payable`;
            }
            if (outputs) {
                functionStr += ` returns (${outputs})`;
            }
            
            humanReadableAbi.push(functionStr);
        } else if (item.type === 'event') {
            // 处理事件
            const inputs = item.inputs.map(input => {
                let eventInput = input.type;
                if (input.indexed) {
                    eventInput += ' indexed';
                }
                if (input.name) {
                    eventInput += ` ${input.name}`;
                }
                return eventInput;
            }).join(', ');
            
            humanReadableAbi.push(`event ${item.name}(${inputs})`);
        }
    });
    
    return humanReadableAbi;
}

// 转换 ABI
const humanReadableAbi = convertToHumanReadable(jsonAbi);

// 输出结果
console.log("// 人类可读的 ABI 格式:");
console.log("const abiERC20 = [");
humanReadableAbi.forEach((item, index) => {
    const isLast = index === humanReadableAbi.length - 1;
    console.log(`    "${item}"${isLast ? '' : ','}`);
});
console.log("];");

// 保存到文件
const outputContent = `// 人类可读的 ABI 格式:
const abiERC20 = [
${humanReadableAbi.map(item => `    "${item}"`).join(',\n')}
];`;

fs.writeFileSync('./human_readable_abi.js', outputContent);
console.log("\n已保存到 human_readable_abi.js 文件"); 