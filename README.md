# 鲜果超市

这是一个用于演示 [oh-my-pi](https://github.com/can1357/oh-my-pi) 编码工作流的原生前端项目。项目刻意保持小而完整：商品筛选、购物车和结算都可以在浏览器中真实操作，核心逻辑也有 Bun 测试保护。

## 运行

```bash
bun install
bun run dev
```

打开终端显示的本地地址即可。运行测试：

```bash
bun test
```

## 目录

- `index.html`：页面骨架。
- `styles.css`：页面样式。
- `src/fruits.js`：页面使用的商品数据。
- `src/catalog.js`：筛选与分类逻辑。
- `src/cart.js`：购物车计算逻辑。
- `src/money.js`：金额展示。
- `src/app.js`：DOM 渲染与交互。
- `fruits.csv`：供数据分析演示使用的同一批商品数据。
- `test/`：Bun 行为测试。

完整的连续演示步骤见 oh-my-pi 仓库中的 `docs/omp-best-practices.zh.md`。
