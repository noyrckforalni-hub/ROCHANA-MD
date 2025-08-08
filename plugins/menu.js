const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "menu",
    desc: "Show interactive menu system with a list",
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

        const sections = [
            {
                title: "Choose a Menu Category",
                rows: [
                    { title: "📥 Download Menu", rowId: `${config.PREFIX}dmenu` },
                    { title: "👥 Group Menu", rowId: `${config.PREFIX}gmenu` },
                    { title: "😄 Fun Menu", rowId: `${config.PREFIX}fmenu` },
                    { title: "👑 Owner Menu", rowId: `${config.PREFIX}omenu` },
                    { title: "🤖 AI Menu", rowId: `${config.PREFIX}aimenu` },
                    { title: "🎎 Anime Menu", rowId: `${config.PREFIX}amenu` },
                    { title: "🔄 Convert Menu", rowId: `${config.PREFIX}cmenu` },
                    { title: "📌 Other Menu", rowId: `${config.PREFIX}omenu2` },
                    { title: "💞 Reactions Menu", rowId: `${config.PREFIX}rmenu` },
                    { title: "🏠 Main Menu", rowId: `${config.PREFIX}mmenu` }
                ]
            }
        ];

        const listMessage = {
            text: menuCaption,
            footer: 'Select a menu option from the list below.',
            title: "Rochana Bot Menu",
            buttonText: "Click Here for Menu",
            sections,
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

        await conn.sendMessage(from, listMessage, { quoted: mek });

    } catch (e) {
        console.error('Menu Error:', e);
        reply(`❌ Menu system is currently busy. Please try again later.\n\n> ${config.DESCRIPTION}`);
    }
});
