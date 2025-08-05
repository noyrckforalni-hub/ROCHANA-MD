const { cmd } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');
const config = require('../config');

cmd({
    pattern: "alive",
    alias: ["status", "online", "a"],
    desc: "Check bot is alive or not",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        const status = `
╭───〔 *🤖 ${config.BOT_NAME} STATUS* 〕───◉
│✨ *Bot is Active & Online!*
│
│🧠 *Owner:* ${config.OWNER_NAME}
│⚡ *Version:* 4.0.0
│📝 *Prefix:* [${config.PREFIX}]
│📳 *Mode:* [${config.MODE}]
│💾 *RAM:* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${(os.totalmem() / 1024 / 1024).toFixed(2)}MB
│🖥️ *Host:* ${os.hostname()}
│⌛ *Uptime:* ${runtime(process.uptime())}
╰────────────────────◉
> ${config.DESCRIPTION}`;
        
        const sections = [
            {
                title: "Bot Options",
                rows: [
                    {
                        title: "🧚‍♂️ GET MENU",
                        rowId: `${config.PREFIX}menu`,
                        description: "Bot's command menu"
                    },
                    {
                        title: "⚙️ CHECK SETTINGS",
                        rowId: `${config.PREFIX}sc`,
                        description: "Bot's configuration settings"
                    }
                ]
            }
        ];

        const listMessage = {
            text: status,
            footer: 'Select an option to navigate.',
            title: `*${config.BOT_NAME}*`,
            buttonText: 'Click Here',
            sections,
            contextInfo: {
                mentionedJid: [m.sender],
            }
        };

        await conn.sendMessage(from, listMessage, { quoted: mek });

    } catch (e) {
        console.error("Alive Error:", e);
        reply(`An error occurred: ${e.message}`);
    }
});
