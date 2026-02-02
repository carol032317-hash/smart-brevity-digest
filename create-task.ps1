# PowerShell 脚本 - 创建 Windows 工作排程器任务（无需密码）
# 以管理员身份运行此脚本

$TaskName = "Smart Brevity AI Digest"
$TaskDescription = "每日自动发送技术文摘到 Telegram"
$BatFilePath = "C:\Users\User\.gemini\antigravity\scratch\rss-reader\run-digest.bat"
$TriggerTime = "08:00"

# 创建触发器（每天早上 8:00）
$Trigger = New-ScheduledTaskTrigger -Daily -At $TriggerTime

# 创建动作（执行批次文件）
$Action = New-ScheduledTaskAction -Execute $BatFilePath

# 创建设置
$Settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -RestartCount 3 `
    -RestartInterval (New-TimeSpan -Minutes 10)

# 创建任务（使用当前登录用户，不需要密码）
Register-ScheduledTask `
    -TaskName $TaskName `
    -Description $TaskDescription `
    -Trigger $Trigger `
    -Action $Action `
    -Settings $Settings `
    -RunLevel Highest `
    -Force

Write-Host "✅ 任务创建成功！" -ForegroundColor Green
Write-Host "📋 任务名称: $TaskName"
Write-Host "⏰ 执行时间: 每天 $TriggerTime"
Write-Host ""
Write-Host "🧪 立即测试:" -ForegroundColor Yellow
Write-Host "Start-ScheduledTask -TaskName '$TaskName'"
