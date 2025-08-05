const fs = require('fs');
const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const axios = require('axios');

cmd({
    pattern: "menu",
    desc: "Show interactive menu system with buttons",
    category: "menu",
    react: "🧾",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const menuCaption = `╭━━━〔 *🧚‍♂️𝗥ᴏᴄʜᴀɴᴀ x 𝐁ᴏᴛ🧚‍♂️* 〕━━━┈⊷
│ ✓ 𝐎ᴡɴᴇʀ : *ʀᴏᴄʜᴀɴᴀ*
│ ✓ 𝐁ᴀɪʟᴇʏꜱ : *Multi Device*
│ ✓ 𝐓ʏᴘᴇ : *NodeJs*
│ ✓ 𝐏ʟᴀᴛꜰᴏʀᴍ : *Heroku*
│ ✓ 𝐌ᴏᴅᴇ : *[${config.MODE}]*
│ ✓ 𝐏ʀᴇꜰɪx : *[${config.PREFIX}]*
│ ✓ 𝐕ᴇʀꜱɪᴏɴ : *5.0.0 Bᴇᴛᴀ*
│ ✓ 𝐂ᴏᴍᴍᴀɴᴅꜱ : *352*
╰━━━━━━━━━━━━━━━┈⊷
╭━━〔 *🧚‍♂️𝗥ᴏᴄʜᴀɴᴀ x -ᴍᴇɴᴜ🧚‍♂️* ━┈⊷
││❯❯ *Select a category to view commands*
╰──────────────┈⊷
> *🧚‍♂️𝗥ᴏᴄʜᴀɴᴀ x -𝐁ᴏᴛ🧚‍♂️*`;

        const buttons = [
            { buttonId: `${config.PREFIX}dmenu`, buttonText: { displayText: '📥 Download Menu' }, type: 1 },
            { buttonId: `${config.PREFIX}gmenu`, buttonText: { displayText: '👥 Group Menu' }, type: 1 },
            { buttonId: `${config.PREFIX}fmenu`, buttonText: { displayText: '😄 Fun Menu' }, type: 1 },
            { buttonId: `${config.PREFIX}omenu`, buttonText: { displayText: '👑 Owner Menu' }, type: 1 },
            { buttonId: `${config.PREFIX}aimenu`, buttonText: { displayText: '🤖 AI Menu' }, type: 1 },
            { buttonId: `${config.PREFIX}amenu`, buttonText: { displayText: '🎎 Anime Menu' }, type: 1 },
            { buttonId: `${config.PREFIX}cmenu`, buttonText: { displayText: '🔄 Convert Menu' }, type: 1 },
            { buttonId: `${config.PREFIX}omenu2`, buttonText: { displayText: '📌 Other Menu' }, type: 1 },
            { buttonId: `${config.PREFIX}rmenu`, buttonText: { displayText: '💞 Reactions Menu' }, type: 1 },
            { buttonId: `${config.PREFIX}mmenu`, buttonText: { displayText: '🏠 Main Menu' }, type: 1 },
        ];
        
        const buttonMessage = {
            image: { url: config.MENU_IMAGE_URL || 'https://res.cloudinary.com/df2rnoijw/image/upload/v1752740024/bankl0exnr8remsz8t32.jpg' },
            caption: menuCaption,
            footer: 'ඔබට අවශ්‍ය menu එක තේරීමට button එකක් ඔබන්න.',
            buttons: buttons,
            headerType: 4,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363403182346919@newsletter',
                    newsletterName: config.OWNER_NAME,
                    serverMessageId: 143
                }
            }
        };

        await conn.sendMessage(from, buttonMessage, { quoted: mek });

    } catch (e) {
        console.error('Menu Error:', e);
        reply(`❌ Menu system is currently busy. Please try again later.\n\n> ${config.DESCRIPTION}`);
    }
});
