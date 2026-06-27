# 鲜果超市开发约定

- 保持原生 HTML、CSS 和 JavaScript，不引入前端框架。
- 商品目录的纯逻辑放在 `src/catalog.js`，购物车纯逻辑放在 `src/cart.js`，DOM 交互放在 `src/app.js`。
- 修改购物车或筛选行为时同步更新 `test/` 中可观察行为测试。
- 使用 `bun test` 验证；使用 `bun run dev` 启动页面。
- 界面文案使用简体中文，金额统一通过 `formatMoney()` 展示。
- 未经明确要求，不执行 `git add`、`git commit` 或 `git push`。
