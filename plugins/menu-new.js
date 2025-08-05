const fs = require('fs');
const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const axios = require('axios');

cmd({
    pattern: "menu",
    desc: "Show interactive menu system",
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
││❯❯ 01 *𝐃ᴏᴡɴʟᴏᴀᴅ ᴍᴇɴᴜ*
││❯❯ 02 *𝐆ʀᴏᴜᴘ ᴍᴇɴᴜ*
││❯❯ 03 *𝐅ᴜɴ ᴍᴇɴᴜ*
││❯❯ 04 *𝐎ᴡɴᴇʀ ᴍᴇɴᴜ*
││❯❯ 05 *𝐀ɪ ᴍᴇɴᴜ*
││❯❯ 06 *𝐀ɴɪᴍᴇ ᴍᴇɴᴜ*
││❯❯ 07 *𝐂ᴏɴᴠᴇʀᴛ ᴍᴇɴᴜ*
││❯❯ 08 *𝐎ᴛʜᴇʀ ᴍᴇɴᴜ*
││❯❯ 09 *𝐑ᴇᴀᴄᴛɪᴏɴꜱ ᴍᴇɴᴜ*
││❯❯ 10 *𝐌ᴀɪɴ ᴍᴇɴᴜ*
╰──────────────┈⊷
> *🧚‍♂️𝗥ᴏᴄʜᴀɴᴀ x -𝐁ᴏᴛ🧚‍♂️*`;
        
        const buttons = [
            { buttonId: `${config.PREFIX}sc`, buttonText: { displayText: '⚙️ CHECK SETTINGS' }, type: 1 }
        ];

        const contextInfo = {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363403182346919@newsletter',
                newsletterName: config.OWNER_NAME,
                serverMessageId: 143
            }
        };

        const buttonMessage = {
            image: { url: config.MENU_IMAGE_URL || 'https://res.cloudinary.com/df2rnoijw/image/upload/v1752740024/bankl0exnr8remsz8t32.jpg' },
            caption: menuCaption,
            footer: 'Select a number to view a specific menu or check settings.',
            buttons: buttons,
            headerType: 4,
            contextInfo: contextInfo
        };

        const sentMsg = await conn.sendMessage(from, buttonMessage, { quoted: mek });
        const messageID = sentMsg.key.id;

        const handler = async (msgData) => {
            try {
                const receivedMsg = msgData.messages[0];
                if (!receivedMsg?.message || !receivedMsg.key?.remoteJid) return;

                const isReplyToMenu = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;
                
                if (isReplyToMenu) {
                    const receivedText = receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text;
                    const senderID = receivedMsg.key.remoteJid;

                    if (menuData[receivedText]) {
                        const selectedMenu = menuData[receivedText];
                        
                        await conn.sendMessage(
                            senderID,
                            { 
                                image: { url: config.MENU_IMAGE_URL || 'https://res.cloudinary.com/df2rnoijw/image/upload/v1752740024/bankl0exnr8remsz8t32.jpg' },
                                caption: selectedMenu.content,
                                contextInfo: contextInfo
                            },
                            { quoted: receivedMsg }
                        );

                        await conn.sendMessage(senderID, { react: { text: '✅', key: receivedMsg.key } });

                    } else {
                        await conn.sendMessage(
                            senderID,
                            {
                                text: `❌ *Invalid Option!* ❌\nPlease reply with a number from 1-10 to select a menu.`,
                                contextInfo: contextInfo
                            },
                            { quoted: receivedMsg }
                        );
                    }
                }
            } catch (e) {
                console.error('Menu handler error:', e);
            }
        };

        conn.ev.on("messages.upsert", handler);

        setTimeout(() => {
            conn.ev.off("messages.upsert", handler);
        }, 300000);

    } catch (e) {
        console.error('Menu Error:', e);
        reply(`❌ Menu system is currently busy. Please try again later.\n\n> ${config.DESCRIPTION}`);
    }
});

const menuData = {
    '1': {
        title: "📥 *Download Menu* 📥",
        content: `╭━━━〔 *Download Menu* 〕━━━┈⊷
┃★╭──────────────
┃★│ 🌐 *Social Media*
┃★│ • facebook [url]
┃★│ • mediafire [url]
┃★│ • tiktok [url]
┃★│ • twitter [url]
┃★│ • Insta [url]
┃★│ • apk [app]
┃★│ • img [query]
┃★│ • tt2 [url]
┃★│ • pins [url]
┃★│ • apk2 [app]
┃★│ • fb2 [url]
┃★│ • pinterest [url]
┃★╰──────────────
┃★╭──────────────
┃★│ 🎵 *Music/Video*
┃★│ • spotify [query]
┃★│ • play [song]
┃★│ • play2-10 [song]
┃★│ • audio [url]
┃★│ • video [url]
┃★│ • video2-10 [url]
┃★│ • ytmp3 [url]
┃★│ • ytmp4 [url]
┃★│ • song [name]
┃★│ • darama [name]
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
        image: true
    },
    // ... all other menu data objects (2 to 10) should be placed here
};
