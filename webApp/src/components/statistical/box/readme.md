---
title: boxComponent
subtitle: 综合统计常用面板组件
---

包含了6种常见的综合统计面板形状

## API

| 参数   | 说明                                   | 类型    | 默认值    |
| ------ | -------------------------------------- | ------- | --------- |
| type   | 面板类型(default,panel[1~8])           | string  | 'defalut' |
| title  | 面板头部标题，如果不设置，则不显示     | string|array  | ''        |
| titleSelect  | 切换面板头部标题回调函数，目前仅适用panel8    | function  | ''        |
| icon   | 面板头部标题图标，如果不设置，则不显示 | boolean | true      |
| width  | 面板宽度                               | string  | '20rem'   |
| height | 面板高度                               | string  | '20rem'   |

## demo

```js
<BoxComponent type='panel1' title='数据统计'>
    <BoxComponent width='8rem' height='8rem' />
</BoxComponent>
```