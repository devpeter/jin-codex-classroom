# Jin的codex建站小课堂（静态版）

对齐 [jin-codex-web.vercel.app](https://jin-codex-web.vercel.app/) 的视觉与核心交互。  
纯 **HTML + CSS + JavaScript**，无构建步骤，可直接部署到 Vercel。

## 功能

- 左侧课程目录（准备部分 / 实操部分，可折叠）
- 顶部搜索（⌘K / Ctrl+K）
- 课前填写工作台：3 份资料表
  - 外贸独立站信息填写表（10 个子页签）
  - SEO 关键词规划表
  - 网站框架与 SEO 执行表
- 本地自动保存（localStorage）
- 一键复制 Markdown / 导出 Excel
- Markdown 模板下载 + ZIP
- 课程正文（可复制 Prompt、验收门）
- Hash 路由（`#lesson-01` … `#lesson-15`）

## 本地预览

```bash
cd jin-codex-classroom
python3 -m http.server 3000
# 浏览器打开 http://127.0.0.1:3000
```

或：

```bash
npx serve .
```

## 部署到 Vercel（三种方式）

### 方式 A：GitHub + Vercel 控制台（推荐）

1. 在 GitHub 新建仓库，把本目录全部文件推上去
2. 打开 [vercel.com](https://vercel.com) → **Add New Project** → Import 该仓库
3. **Framework Preset** 选 **Other**
4. Root Directory、Build Command、Output 均保持默认（留空）
5. 点击 **Deploy**

### 方式 B：Vercel CLI

```bash
cd jin-codex-classroom
npx vercel
npx vercel --prod
```

### 方式 C：拖拽上传

1. 打开 [vercel.com/new](https://vercel.com/new)
2. 将整个文件夹拖进页面
3. 等待部署完成

## 目录结构

```
jin-codex-classroom/
├── index.html
├── css/styles.css
├── js/app.js
├── templates/
├── vercel.json
└── README.md
```

## 说明

- 数据只存在用户浏览器（localStorage），不上传服务器
- Excel 导出依赖 CDN 上的 SheetJS
- 静态站无后端，适合课程展示与填写工具场景
