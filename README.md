# Jin的codex建站小课堂

纯静态 HTML + CSS + JS，可直接部署到 Vercel。

## 仓库结构

- `index.html` — 入口（加载器，拼接 page-a / page-b1 / page-b2）
- `page-a.html` — 顶栏、侧栏（27 课）、课前工作台与表单
- `page-b1.html` — 准备部分 13 课
- `page-b2.html` — 实操部分 14 课
- `css/styles.css` / `js/app.js`
- `templates/` — 8 个 Markdown 模板 + ZIP
- `vercel.json`

## 部署到 Vercel（推荐）

1. 打开 [vercel.com/new](https://vercel.com/new)
2. **Import** GitHub 仓库 `devpeter/jin-codex-classroom`
3. Framework Preset 选 **Other**
4. 其余默认 → **Deploy**

生产域名示例：`https://jin-codex-classroom.vercel.app`（以实际分配为准）

## 本地预览

```bash
python3 -m http.server 8888
# 打开 http://127.0.0.1:8888/
```

## 功能

- 27 个课程条目（准备 13 + 实操 14）
- 3 个填写工具 + 本地自动保存
- 复制 Markdown / 导出 Excel
- 8 个模板下载 + ZIP
- 搜索 ⌘K
