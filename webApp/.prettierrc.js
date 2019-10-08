module.exports = {
	//排版宽度即每行最大宽度。默认值是 80。
	printWidth: 100,
	//制表符宽度，每个层级缩进几个空格。默认值 2
	tabWidth: 4,
	//是否使用 tab 代替 space(空格) 为单位缩进，默认 false
	useTabs: false,
	//分号，句尾是否自动补全“分号”，默认 true
	semi: true,
	//启用单引号,默认 false
	singleQuote: true,
	//自定义引号配置,"as-needed" -- 按需添加|"consistent" -- 一致原则|"preserve" -- 遵循原则
	quoteProps: 'consistent',
	//在 JSX 文件中使用单引号代替双引号
	jsxSingleQuote: true,
	//为多行数组的非末尾行添加逗号,"none" - 不添加逗号|"es5" - 在 ES5 中生效的逗号|"all" - 任何可以添加逗号的地方
	trailingComma: 'es5', //对象属性最后有 ","
	//括号空格，在对象字面量和括号之间添加空格
	bracketSpacing: true,
	//将多行 JSX 元素的 > 放置于最后一行的末尾，而非换行
	jsxBracketSameLine: true, //JSX标签闭合位置 默认false
	//箭头函数参数括号 "avoid" - 在可以消除的情况下|"always" - 一直保留括号.
	arrowParens: 'always',
	//为 HTML 文件定义全局空格敏感度
	htmlWhitespaceSensitivity: 'ignore',
	//文件行尾处理方式,保持原有规则
	endOfLine: 'auto'
};
