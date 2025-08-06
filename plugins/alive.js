// plugins/alive.js
module.exports = {
  name: "alive",
  desc: "Check bot status",
  async handle(client, chat, msg) {
    const buttons = [
      { buttonId: 'id_menu', buttonText: { displayText: '📋 MENU' }, type: 1 },
      { buttonId: 'id_settings', buttonText: { displayText: '⚙️ SETTINGS' }, type: 1 }
    ];

    await client.sendMessage(
      msg.key.remoteJid,
      {
        text: `🤖 *ROCHANA-MD IS ALIVE!*\n\n` +
              `⚡ Version: 2.0\n` +
              `🕒 Uptime: ${runtime(process.uptime())}\n` +
              `💻 Powered By: ROCHANA-MD`,
        buttons: buttons,
        footer: "© ROCHANA-MD 2024"
      },
      { quoted: msg }
    );
  }
};
