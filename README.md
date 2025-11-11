# musiclist_v4

你的专属歌单中心 — v4

本版本特性：
- 左侧三列搜索结果（最多 200 首）
- 搜索栏固定（不会随拖拽或滚动移动）
- 搜索旁有刷新按钮，可清空搜索并返回首页推荐歌手
- 右侧固定歌单，显示序号与总数，分享与清空按钮固定在顶部
- 歌单分页：每页显示 10 首（上下页控制）
- 自动保存歌单至 localStorage；支持通过 `?list=` 参数加载分享歌单

本地运行：
1. 安装 Node.js（LTS）
2. 运行：
   npm install
   npm run dev
3. 打开 http://localhost:5173

部署到 Vercel：上传到 GitHub → Vercel Import → Deploy（Root Directory 留空）
