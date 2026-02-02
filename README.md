# 🤖 Smart Brevity AI Digest

> 基於 Axios Smart Brevity 方法論的個人技術文摘系統，使用 Gemini AI 自動將 200+ 技術部落格摘要為精簡的每日訊息，直接推送到 Telegram。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

## ✨ 功能特色

- 📡 **自動抓取**：從 92 個技術部落格的 RSS feeds 抓取最新文章
- 🤖 **AI 摘要**：使用 Gemini 2.5 Flash-Lite 生成 Smart Brevity 格式摘要
- 🎯 **智能篩選**：每日精選 Top 10 最高價值文章
- 📱 **Telegram 推送**：直接發送到你的 Telegram，隨時隨地閱讀
- 💰 **超低成本**：每日成本約 $0.0003 USD（不到 1 分錢台幣）

## 📸 效果預覽

**Telegram 訊息格式**：

```
📰 *技術文摘精選*
2026年2月3日

**AI 重塑技能形成**

研究顯示 AI 工具正在改變專業技能的學習與應用模式，創造新的職能需求。

**Why it matters：** 對於技術工作者，提前理解這些變化能幫助調整職涯方向。

**Be smart：** 專注培養「問題分解」與「AI 協作」能力，而非單純記憶技術細節。

🔗 [閱讀完整文章](https://example.com/article)
```

## 🚀 快速開始

### 前置需求

- Node.js 18.0.0 或更高版本
- Gemini API Key（[免費取得](https://aistudio.google.com/apikey)）
- Telegram Bot（5 分鐘設置）

### 1. 克隆專案

```bash
git clone https://github.com/scandnavik/smart-brevity-digest.git
cd smart-brevity-digest
```

### 2. 安裝依賴

```bash
npm install
```

### 3. 設定 API Keys

複製環境變數範本：

```bash
cp .env.example .env
```

編輯 `.env` 檔案，填入你的 API Keys：

```env
GEMINI_API_KEY=你的_Gemini_API_Key
TELEGRAM_BOT_TOKEN=你的_Bot_Token
TELEGRAM_CHAT_ID=你的_Chat_ID
```

#### 🔑 如何取得 API Keys

**Gemini API Key**：

1. 前往 [Google AI Studio](https://aistudio.google.com/apikey)
2. 點擊「Create API Key」
3. 複製 API Key

**Telegram Bot Token & Chat ID**：

請參考 [TELEGRAM_SETUP.md](TELEGRAM_SETUP.md) 完整設置指南（僅需 2 分鐘）。

### 4. 測試執行

```bash
node src/index.js
```

如果設置正確，你會在 Telegram 收到當天的技術文摘！

## ⏰ 自動化設置（重要！）

### 方案 A：Windows 工作排程器（推薦）

**適用於**：Windows 用戶，最簡單的設置方式

#### 步驟 1：創建執行腳本

已包含在專案中：`run-digest.bat`

#### 步驟 2：設置 Windows 工作排程器

1. 按 `Win + R`，輸入 `taskschd.msc`
2. 點擊「創建基本工作」
3. 填寫資訊：
   - **名稱**：`Smart Brevity AI Digest`
   - **觸發條件**：每日 08:00
   - **動作**：啟動程式
   - **程式路徑**：瀏覽並選擇 `run-digest.bat`
4. 在屬性中設置：
   - ✅ 勾選「只有使用者登入時才執行」
   - ✅ 勾選「以最高權限執行」

**詳細圖文教學**：參見 [AUTOMATION.md](AUTOMATION.md)

---

### 方案 B：n8n 工作流（推薦給進階用戶）

**適用於**：想要雲端執行、更靈活的自動化控制

n8n 是一個強大的工作流自動化工具，支援：

- 🌐 雲端執行（無需本機運行）
- 🎨 視覺化工作流編輯
- 🔄 多種觸發方式（定時、webhook 等）
- 📊 執行歷史記錄

#### 設置步驟

1. **安裝 n8n**（擇一）：

   ```bash
   # Docker (推薦)
   docker run -it --rm \
     --name n8n \
     -p 5678:5678 \
     -v ~/.n8n:/home/node/.n8n \
     n8nio/n8n
   
   # npm
   npm install -g n8n
   n8n start
   ```

2. **導入工作流**：
   - 打開 n8n（<http://localhost:5678）>
   - 導入 `n8n-workflow.json`（專案中包含）
   - 設置憑證（Gemini API、Telegram Bot）

3. **啟動定時執行**：
   - 設定 Cron 觸發器：`0 8 * * *`（每天 08:00）
   - 啟動工作流

**詳細教學**：參見 [N8N_SETUP.md](N8N_SETUP.md)

---

### 方案 C：GitHub Actions（完全雲端）

**適用於**：想要完全託管在 GitHub，無需本機或伺服器

已包含工作流檔案：`.github/workflows/daily-digest.yml`

**設置步驟**：

1. Fork 此專案
2. 在 GitHub 設定 Secrets：
   - `GEMINI_API_KEY`
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
3. 啟用 GitHub Actions

**注意**：GitHub Actions 在私有倉庫有使用限制。

---

### 方案 D：macOS/Linux Cron

```bash
# 編輯 crontab
crontab -e

# 添加以下行（每天 08:00 執行）
0 8 * * * cd /path/to/smart-brevity-digest && node src/index.js
```

## 📊 成本分析

| 項目 | 每日消耗 | 單價 | 每日成本 |
|------|----------|------|----------|
| Gemini API (輸入) | ~5,500 tokens | $0.10/M | $0.00055 |
| Gemini API (輸出) | ~800 tokens | $0.40/M | $0.00032 |
| Telegram Bot | 免費 | $0 | $0 |
| **總計** | | | **~$0.0009/日** |

**每月成本**：約 $0.027 USD（不到 1 元台幣）

## 🎨 自訂設定

### 調整文章數量

編輯 `src/index.js`：

```javascript
// 第 224 行
const topArticles = filterTopArticles(articles, 10); // 改成你想要的數量
```

### 修改 RSS 來源

編輯 `config/feeds.opml`，添加或移除 RSS 訂閱。

### 客製化 Smart Brevity Prompt

編輯 `src/index.js` 中的 `SYSTEM_PROMPT`（第 13-45 行），調整 AI 摘要風格。

## 🛠️ 專案結構

```
smart-brevity-digest/
├── src/
│   └── index.js              # 主程式
├── config/
│   └── feeds.opml            # 92 個 RSS feeds
├── .env.example              # 環境變數範本
├── run-digest.bat            # Windows 執行腳本
├── TELEGRAM_SETUP.md         # Telegram Bot 設置指南
├── AUTOMATION.md             # 自動化完整教學
├── N8N_SETUP.md              # n8n 工作流設置
└── README.md                 # 本文件
```

## 📝 Smart Brevity 方法論

本專案基於 Axios 的 **Smart Brevity** 寫作法：

- **簡潔即信心**：用最少的字傳達最多的價值
- **Core Four 結構**：
  1. 6 字以內標題
  2. 一句話開場
  3. "Why it matters"（為什麼重要）
  4. "Be smart"（可執行建議）

了解更多：[smart_brevity_prompt.md](https://github.com/scandnavik/smart-brevity-digest/blob/main/.github/smart_brevity_prompt.md)

## 🤝 貢獻

歡迎提交 Issue 或 Pull Request！

建議貢獻方向：

- 增加更多優質 RSS 來源
- 支援其他語言
- 改進 AI prompt
- 添加 Web Dashboard

## 📄 授權

MIT License - 詳見 [LICENSE](LICENSE)

## 🙏 致謝

- [Axios](https://www.axios.com/) - Smart Brevity 方法論
- [Google Gemini](https://ai.google.dev/) - AI 摘要服務
- [Telegram](https://telegram.org/) - 訊息推送平台

---

**⭐ 如果這個專案對你有幫助，請給個 Star！**

**📧 問題與建議**：[提交 Issue](https://github.com/scandnavik/smart-brevity-digest/issues)
