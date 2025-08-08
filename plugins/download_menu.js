const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "dmenu", // This matches the buttonId from the main menu
    desc: "Show Download Menu commands",
    category: "menu",
    react: "📥",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    const dmenuContent = `╭━━━〔 *Download Menu* 〕━━━┈⊷
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
> ${config.DESCRIPTION}`;
    
    // Send the sub-menu as a regular text message
    await conn.sendMessage(from, { text: dmenuContent }, { quoted: mek });
});
