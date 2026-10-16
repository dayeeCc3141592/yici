# 忆词 PWA v0.2 — iPhone 可安装版本

## 已实现

单词/卡组管理、四档间隔重复、忘记卡片当天重学队列、撤销、英语朗读、学习统计、CSV 词库导入导出、JSON 完整备份恢复、离线应用缓存。算法为 **SM-2 风格**，不是 FSRS；不宣称已实现个性化 FSRS。

## 让 iPhone 能直接使用（免费 GitHub Pages）

1. Windows 浏览器登录 GitHub，创建一个 **Public** 仓库（例如 `yici`）。
2. 解压本 ZIP，将 `index.html`、`app.js`、`engine.js`、`style.css`、`sw.js`、`manifest.webmanifest`、`icon.svg` 等文件**直接上传至仓库根目录**（不要把外层文件夹作为仓库根目录）。
3. 打开仓库 **Settings → Pages → Build and deployment → Source: Deploy from a branch**，选择 `main`、`/(root)`，保存。等待 GitHub Pages 部署成功。
4. 用 iPhone **Safari** 打开 Pages 显示的网址，通常为 `https://用户名.github.io/yici/`，实际以 GitHub 页面显示为准。点击 Safari 分享 → **添加到主屏幕** → 添加。之后从主屏幕图标启动。
5. 首次联网打开，待资源缓存后可离线背单词。每次更新代码时，联网重新打开应用以获取新版本。

**注意：** GitHub Pages 托管的是公开前端代码，**不要把私人单词数据或备份文件上传到仓库**。单词和学习记录存储在 iPhone 本地。GitHub Pages 对公共仓库的免费使用以其当时政策为准。

## 导入词库

在设置中选择「导入 CSV 单词表」。UTF-8 CSV 第一行必须包含 `front,back`，可选 `example`。导入至当前卡组（默认初始卡组），跳过已有相同英文词。支持字段中含逗号或换行的带引号 CSV。

## 安全及限制

- 记忆算法是透明 SM-2 风格间隔重复，不是 FSRS。忘记后设置 10 分钟到期；同次学习中暂未到期会提示稍后返回。
- 免费、无需 Apple 开发者证书、无需 Mac、不使用云数据库或 AI。首次部署需要互联网。
- iOS 删除主屏幕应用、清理网站数据、存储回收均可能丢失数据；请经常导出 JSON 备份保存到 iPhone 文件 App。
- Safari 标签页和主屏幕 Web App 的数据可能不共享；请固定使用主屏幕入口。
- 这是一份可部署的工程，**不是已经部署好的在线链接**；需要你按上述步骤创建 GitHub Pages。
- 开发者应在真实 iPhone 上检查安装、离线访问、文件导入和语音兼容性。

## Windows 本地测试

Node.js 18+ 环境执行 `npm test`；运行 `python -m http.server 4173` 并访问 `http://localhost:4173`。
