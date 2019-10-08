---
title: tableComponent
subtitle: 综合统计表格组件
---

包含了6种常见的综合统计面板形状

## API

| 参数      | 说明                                       | 类型    | 默认值 |
| --------- | ------------------------------------------ | ------- | ------ |
| rowSelect | 控制是否显示选中表格第一条，表格行选中效果 | boolean | true   |
| ...       | 其他参数对应ant design的Table组件          | object  |        |

## demo

```js
<TableComponent
    rowSelect={true}
    columns={columns}
    dataSource={lastData}
    pagination={{ total: 200, hideOnSinglePage: true }} />
```