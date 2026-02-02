# 快速设置指南 - 无需密码版本

## 方法 A：手动设置（简单）

### 在属性对话框的「常规」标签页

**选择**：

- ⭕ **只有使用者登入时才执行**（这个选项不需要密码！）
- ✅ 勾选「以最高权限执行」

### 优点

- ✅ 不需要输入密码
- ✅ 设置简单
- ✅ 每天开机登录后自动执行

### 注意

- ⚠️ 需要你登录 Windows 才会执行
- ⚠️ 如果电脑整天关机则不会执行

---

## 方法 B：使用 PowerShell（完全自动化）

### 步骤 1：右键点击 PowerShell，选择「以系统管理员身分执行」

### 步骤 2：执行以下命令

```powershell
cd C:\Users\User\.gemini\antigravity\scratch\rss-reader
.\create-task.ps1
```

### 步骤 3：如果遇到执行策略错误

先执行：

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

然后再执行步骤 2。

### 步骤 4：测试

```powershell
Start-ScheduledTask -TaskName "Smart Brevity AI Digest"
```

---

## 推荐：使用方法 A

对于个人电脑，选择「只有使用者登入时才执行」是最简单的方案：

- 每天早上开机登录后，8:00 自动发送
- 不需要记住密码
- 设置超级简单

如果你的电脑 24 小时开机，才需要考虑「不论使用者是否登入」选项。
