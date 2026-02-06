const Parser = require('rss-parser');
const { GoogleGenAI } = require('@google/genai');
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

// Initialize services
const parser = new Parser();
const ai = new GoogleGenAI({});

// Smart Brevity System Prompt (for caching)
const SYSTEM_PROMPT = `你是一位使用 Smart Brevity 方法論的技術策展人。

你的任務是將技術文章轉換為 Axios 風格的極簡摘要，讓讀者在 10 秒內判斷是否值得閱讀。

輸出格式（嚴格遵守）：

**[6字以內的標題]**

[一句話開場：最重要的事實或發現]

**Why it matters：** [這對讀者的工作/學習/決策有什麼影響？1-2句]

**Be smart：** [一個可立即應用的洞見或行動建議]

---

寫作原則：
- 標題必須 ≤ 6 個字，使用動詞開頭
- 開場句必須是完整的一句話，不超過 25 字
- "Why it matters" 要回答「這對我有什麼用？」
- "Be smart" 要給出可執行的建議
- 使用繁體中文
- 不要使用技術術語，除非必要
- 刪除所有可刪除的字
- **不要包含原文連結**（連結會自動添加）

範例輸出：

**SaaS 創業破百萬**

一位獨立開發者分享從 0 到 100 萬美金 ARR 的完整時間線與關鍵轉折點。

**Why it matters：** 如果你正在考慮 SaaS 創業，這篇提供了可複製的市場驗證框架。

**Be smart：** 作者強調「先賣再做」— 在寫任何程式碼前，先確認有人願意付費。`;

async function parseOPML(filePath) {
    const opmlContent = await fs.readFile(filePath, 'utf-8');
    const feeds = [];

    // Simple OPML parsing
    const urlRegex = /xmlUrl="([^"]+)"/g;
    let match;
    while ((match = urlRegex.exec(opmlContent)) !== null) {
        feeds.push(match[1]);
    }

    console.log(`📥 Found ${feeds.length} feeds in OPML`);
    return feeds;
}

async function fetchRecentArticles(feedUrls, limit = 50) {
    console.log('🔄 Fetching recent articles...');
    const articles = [];

    for (const url of feedUrls.slice(0, 20)) { // Limit to first 20 feeds for testing
        try {
            const feed = await parser.parseURL(url);
            if (feed.items && feed.items.length > 0) {
                const recent = feed.items[0]; // Get most recent article
                articles.push({
                    title: recent.title,
                    link: recent.link,
                    content: recent.contentSnippet || recent.summary || '',
                    pubDate: recent.pubDate,
                    source: feed.title
                });
            }
        } catch (error) {
            // Skip problematic feeds
            console.log(`⚠️  Skipped: ${url}`);
        }
    }

    console.log(`✅ Fetched ${articles.length} articles`);
    return articles;
}

function filterTopArticles(articles, count = 10) {
    // Sort by publication date (most recent first)
    const sorted = articles
        .filter(a => a.pubDate)
        .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    return sorted.slice(0, count);
}

async function generateSummary(article) {
    const prompt = `${SYSTEM_PROMPT}

請為以下技術文章生成 Smart Brevity 摘要：

標題：${article.title}
來源：${article.source}
內容：${article.content.substring(0, 1000)}`;

    try {
        const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
        });

        return result.text;
    } catch (error) {
        console.error(`❌ Failed to summarize: ${article.title}`);
        return `**${article.title}**\n\n🔗 ${article.link}`;
    }
}

async function generateDigest(articles) {
    console.log('🤖 Generating AI summaries...');
    const summaries = [];

    for (const article of articles) {
        const summary = await generateSummary(article);
        summaries.push({
            summary,
            link: article.link
        });

        // Small delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    return summaries;
}


async function sendToTelegram(summaries) {
    console.log('📨 Sending to Telegram...');

    const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const date = new Date().toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // 發送標題
    await bot.sendMessage(chatId, `📰 *國際產經精選*\n${date}`, {
        parse_mode: 'Markdown'
    });

    // 發送每篇摘要
    for (const item of summaries) {
        const message = `${item.summary}\n\n🔗 [閱讀完整文章](${item.link})`;

        try {
            await bot.sendMessage(chatId, message, {
                parse_mode: 'Markdown',
                disable_web_page_preview: true
            });

            // 小延遲避免 rate limit
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error(`❌ Failed to send: ${error.message}`);
        }
    }

    console.log('✅ Messages sent to Telegram successfully!');
}

async function main() {
    console.log('🚀 Starting AI Digest Generator...\n');

    // 1. Parse OPML
    const feedUrls = await parseOPML(path.join(__dirname, '../config/feeds.opml'));

    // 2. Fetch articles
    const articles = await fetchRecentArticles(feedUrls);

    // 3. Filter top 10
    const topArticles = filterTopArticles(articles, 10);
    console.log(`🎯 Selected top ${topArticles.length} articles\n`);

    // 4. Generate summaries
    const summaries = await generateDigest(topArticles);

    // 5. Send to Telegram
    await sendToTelegram(summaries);

    console.log('\n🎉 Digest generation complete!');
}

// Run
main().catch(console.error);
