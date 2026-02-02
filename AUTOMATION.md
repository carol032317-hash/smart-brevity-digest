# ⏰ 设置自动化定时发送

## 当前状态

❌ **目前**：需要手动执行 `node src/index.js` 才会发送
✅ **目标**：每天自动执行，无需人工操作

---

## 方法 1：Windows 工作排程器（推荐）

### 步骤 1：创建批次文件

创建一个 `.bat` 文件来执行脚本：

**文件位置**：`C:\Users\User\.gemini\antigravity\scratch\rss-reader\run-digest.bat`

```batch
@echo off
cd /d C:\Users\User\.gemini\antigravity\scratch\rss-reader
node src/index.js
```

### 步骤 2：设置 Windows 工作排程器

1. **打开工作排程器**
   - 按 `Win + R`
   - 输入 `taskschd.msc`
   - 按 Enter

2. **创建基本工作**
   - 点击右侧「创建基本工作」
   - 名称：`Smart Brevity AI Digest`
   - 描述：`每日自动发送技术文摘到 Telegram`

3. **设置触发条件**
   - 选择「每日」
   - 设置时间：例如 **08:00**（每天早上 8 点）
   - 开始日期：今天

4. **设置动作**
   - 选择「启动程序」
   - 程序或脚本：浏览并选择 `run-digest.bat`
   - 或直接填写：

     ```
     C:\Users\User\.gemini\antigravity\scratch\rss-reader\run-digest.bat
     ```

5. **完成并测试**
   - 勾选「完成时打开此工作的属性对话框」
   - 点击「完成」

### 步骤 3：验证设置

在属性对话框中：

- **常规** 标签页：
  - ✅ 勾选「不论用户是否登录都要执行」
  - ✅ 勾选「使用最高权限执行」
  
- **触发条件** 标签页：
  - 确认时间正确
  
- **设置** 标签页：
  - ✅ 勾选「如果工作失败，按以下方式重新启动」
  - 设置：每 **10 分钟** 重试一次，共 **3** 次

### 步骤 4：立即测试

1. 在工作排程器中找到你创建的工作
2. 右键点击 → 「执行」
3. 检查你的 Telegram 是否收到消息

---

## 方法 2：使用 npm 包 `node-cron`（程序内定时）

### 安装依赖

```bash
npm install node-cron
```

### 修改代码

创建新文件 `src/scheduler.js`：

```javascript
const cron = require('node-cron');
const { exec } = require('child_process');

console.log('🕐 定时任务已启动');
console.log('📅 每天 08:00 自动执行\n');

// 每天早上 8:00 执行
cron.schedule('0 8 * * *', () => {
  console.log(`⏰ ${new Date().toLocaleString()} - 开始生成文摘...`);
  
  exec('node src/index.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ 执行失败: ${error}`);
      return;
    }
    console.log(stdout);
    if (stderr) console.error(stderr);
  });
});

// 保持进程运行
console.log('✅ 按 Ctrl+C 停止定时任务');
```

### 启动定时任务

```bash
node src/scheduler.js
```

**优点**：灵活，可以自定义多个时间
**缺点**：需要保持进程运行（可配合 PM2 使用）

---

## 方法 3：云端执行（GitHub Actions）

### 创建 `.github/workflows/daily-digest.yml`

```yaml
name: Daily Tech Digest

on:
  schedule:
    - cron: '0 0 * * *'  # 每天 UTC 00:00 (台湾时间 08:00)
  workflow_dispatch:      # 支持手动触发

jobs:
  send-digest:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Run digest generator
      env:
        GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
        TELEGRAM_BOT_TOKEN: ${{ secrets.TELEGRAM_BOT_TOKEN }}
        TELEGRAM_CHAT_ID: ${{ secrets.TELEGRAM_CHAT_ID }}
      run: node src/index.js
```

### 在 GitHub 设置 Secrets

1. 前往你的 GitHub 仓库
2. Settings → Secrets and variables → Actions
3. 添加以下 secrets：
   - `GEMINI_API_KEY`
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`

**优点**：完全云端，无需本机运行
**缺点**：依赖 GitHub，需要公开仓库（或付费账户）

---

## 推荐配置

**最佳实践**：使用 **Windows 工作排程器**

| 项目 | 建议值 |
|------|--------|
| **执行时间** | 每天 08:00（早餐时间阅读） |
| **重试机制** | 失败后 10 分钟重试，最多 3 次 |
| **优先级** | 正常 |
| **执行条件** | 不论用户是否登录 |

---

## 验证自动化是否成功

### 检查清单

- [ ] 批次文件 `run-digest.bat` 已创建
- [ ] Windows 工作排程器中已设置任务
- [ ] 手动执行测试成功（收到 Telegram 消息）
- [ ] 确认触发时间正确
- [ ] 勾选「不论用户是否登录都要执行」

### 监控方式

1. **查看工作历史**
   - 工作排程器 → 选择你的工作
   - 点击「历史记录」标签页

2. **添加日志记录**（可选）

   修改 `run-digest.bat`：

   ```batch
   @echo off
   echo [%date% %time%] Starting digest generation... >> C:\digest-log.txt
   cd /d C:\Users\User\.gemini\antigravity\scratch\rss-reader
   node src/index.js 2>&1 >> C:\digest-log.txt
   echo [%date% %time%] Completed >> C:\digest-log.txt
   ```

---

## 故障排除

**问题：工作排程器显示"上次执行结果: (0x1)"**

- 检查批次文件路径是否正确
- 确认 Node.js 在系统 PATH 中
- 尝试使用完整路径：`C:\Program Files\nodejs\node.exe`

**问题：执行了但没收到消息**

- 检查 `.env` 文件是否在正确位置
- 查看日志确认错误信息
- 手动执行 `run-digest.bat` 测试

**问题：电脑休眠时未执行**

- 工作排程器 → 条件标签页
- ✅ 勾选「唤醒电脑以执行此工作」

---

**现在就去设置吧！设置完成后，明天早上 8:00 你就会自动收到文摘了！** 🎉
