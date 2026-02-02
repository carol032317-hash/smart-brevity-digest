# 使用 n8n 設置 Smart Brevity AI Digest

n8n 是一個開源的工作流自動化工具，提供視覺化介面來建立自動化流程。

## 為什麼選擇 n8n？

相比 Windows 工作排程器，n8n 提供：

✅ **跨平台**：Windows、macOS、Linux 都可用  
✅ **視覺化編輯**：拖拉即可建立工作流  
✅ **雲端執行**：可部署到伺服器，無需本機運行  
✅ **執行歷史**：查看每次執行的詳細記錄  
✅ **錯誤處理**：自動重試、失敗通知  
✅ **更多整合**：未來可輕鬆添加其他功能

## 🚀 快速開始

### 方法 1：Docker（推薦）

```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

### 方法 2：npm

```bash
npm install -g n8n
n8n start
```

執行後，訪問：<http://localhost:5678>

## 📋 建立工作流

### 步驟 1：創建新工作流

1. 打開 n8n 介面
2. 點擊「Create new workflow」
3. 工作流名稱：`Smart Brevity AI Digest`

### 步驟 2：添加 Cron 觸發器

1. 點擊「Add first step」
2. 搜索並選擇「Schedule Trigger」
3. 設置：
   - **Trigger Interval**: `Cron`
   - **Cron Expression**: `0 8 * * *`（每天 08:00）
   - **Timezone**: `Asia/Taipei`

### 步驟 3：添加執行節點

#### 3.1 創建執行腳本節點

1. 點擊「+」添加新節點
2. 選擇「Execute Command」
3. 設置：
   - **Command**: `node`
   - **Arguments**: `/path/to/smart-brevity-digest/src/index.js`
   - **Working Directory**: `/path/to/smart-brevity-digest`

#### 3.2 設置環境變數

在「Environment Variables」中添加：

```
GEMINI_API_KEY={{ $secrets.GEMINI_API_KEY }}
TELEGRAM_BOT_TOKEN={{ $secrets.TELEGRAM_BOT_TOKEN }}
TELEGRAM_CHAT_ID={{ $secrets.TELEGRAM_CHAT_ID }}
```

### 步驟 4：設置憑證

1. 點擊右上角「Settings」→「Credentials」
2. 創建新憑證：
   - **Name**: `GEMINI_API_KEY`
   - **Value**: 你的 Gemini API Key
3. 重複步驟創建其他憑證

### 步驟 5：測試與啟動

1. 點擊「Test workflow」測試執行
2. 確認 Telegram 收到訊息
3. 點擊「Active」切換開關，啟動自動執行

## 🎨 進階設定

### 添加錯誤通知

在執行節點後添加：

1. **IF 節點**：檢查執行是否成功
2. **Telegram 節點**：失敗時發送錯誤通知

### 添加執行日誌

使用「HTTP Request」節點將執行結果發送到：

- Google Sheets（記錄每日執行）
- Notion（建立執行日誌）
- Email（發送執行報告）

### 多時段執行

複製 Cron 觸發器，設置不同時間：

- 早上 8:00：完整文摘
- 下午 6:00：快速更新

## ☁️ 雲端部署

### 選項 1：n8n Cloud（最簡單）

訪問 [n8n.cloud](https://n8n.cloud)：

- 免費方案：每月 5,000 次執行
- 無需自己架設伺服器
- 自動備份與更新

### 選項 2：自架伺服器

使用 Railway、Render 或 DigitalOcean：

```bash
# docker-compose.yml
version: '3'
services:
  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=your_password
    volumes:
      - ./n8n_data:/home/node/.n8n
```

## 📊 工作流範例

完整的 n8n 工作流 JSON 已包含在專案中：

**檔案位置**：`n8n-workflow.json`

**導入方式**：

1. n8n 介面 → 「Import from File」
2. 選擇 `n8n-workflow.json`
3. 設置憑證
4. 啟動工作流

## 🔍 監控與維護

### 查看執行記錄

n8n 介面 → 「Executions」：

- 查看每次執行的詳細日誌
- 檢查成功/失敗狀態
- 重新執行失敗的工作流

### 設置警報

使用「Error Trigger」節點：

1. 自動捕獲工作流錯誤
2. 發送 Telegram 或 Email 通知
3. 記錄到日誌系統

## 💡 優勢對比

| 功能 | Windows 排程器 | n8n |
|------|----------------|-----|
| 跨平台 | ❌ 僅 Windows | ✅ 全平台 |
| 視覺化 | ❌ | ✅ |
| 雲端執行 | ❌ | ✅ |
| 錯誤處理 | 基礎 | 進階 |
| 執行歷史 | 有限 | 完整 |
| 擴展性 | 低 | 高 |

## 🎯 建議使用場景

**選擇 Windows 排程器**：

- ✅ 只在 Windows 上使用
- ✅ 不需要複雜功能
- ✅ 想要最簡設置

**選擇 n8n**：

- ✅ 需要跨平台支援
- ✅ 想要視覺化管理
- ✅ 計劃添加更多自動化功能
- ✅ 需要雲端執行

## 📚 更多資源

- [n8n 官方文檔](https://docs.n8n.io/)
- [n8n 工作流範例](https://n8n.io/workflows)
- [n8n 社群](https://community.n8n.io/)

---

**完成設置後，你的 AI Digest 系統將在雲端 24/7 運行！** 🚀
