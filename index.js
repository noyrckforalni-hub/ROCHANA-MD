const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  jidNormalizedUser,
  isJidBroadcast,
  getContentType,
  proto,
  generateWAMessageContent,
  generateWAMessage,
  AnyMessageContent,
  prepareWAMessageMedia,
  areJidsSameUser,
  downloadContentFromMessage,
  MessageRetryMap,
  generateForwardMessageContent,
  generateWAMessageFromContent,
  generateMessageID,
  makeInMemoryStore,
  jidDecode,
  fetchLatestBaileysVersion,
  Browsers
} = require('@whiskeysockets/baileys');


const l = console.log;
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions');
const { AntiDelDB, initializeAntiDeleteSettings, setAnti, getAnti, getAllAntiDeleteSettings, saveContact, loadMessage, getName, getChatSummary, saveGroupMetadata, getGroupMetadata, saveMessageCount, getInactiveGroupMembers, getGroupMembersMessageCount, saveMessage } = require('./data');
const fs = require('fs');
const ff = require('fluent-ffmpeg');
const P = require('pino');
const config = require('./config');
const GroupEvents = require('./lib/groupevents');
const qrcode = require('qrcode-terminal');
const util = require('util');
const { sms, downloadMediaMessage, AntiDelete } = require('./lib');
const FileType = require('file-type');
const axios = require('axios');
const { File } = require('megajs');
const os = require('os');
const path = require('path');
const prefix = config.PREFIX;

const ownerNumber = config.OWNER_NUMBER ? config.OWNER_NUMBER.split(',').map(num => num.trim() + '@s.whatsapp.net') : [];

const tempDir = path.join(os.tmpdir(), 'cache-temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

const clearTempDir = () => {
  fs.readdir(tempDir, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      fs.unlink(path.join(tempDir, file), err => {
        if (err) throw err;
      });
    }
  });
};

setInterval(clearTempDir, 5 * 60 * 1000);

//===================SESSION-AUTH============================
if (!fs.existsSync(__dirname + '/sessions/creds.json')) {
  if (!config.SESSION_ID) {
    console.log('Please add your session to SESSION_ID env !!');
    process.exit(1);
  }
  const sessdata = config.SESSION_ID.replace("IK~", '');
  const filer = File.fromURL(`https://mega.nz/file/${sessdata}`);
  filer.download((err, data) => {
    if (err) throw err;
    fs.writeFile(__dirname + '/sessions/creds.json', data, () => {
      console.log("Session downloaded ✅");
    });
  });
}

const express = require("express");
const app = express();
const port = process.env.PORT || 9090;

async function connectToWA() {
  console.log("Connecting to WhatsApp ⏳️...");
  const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/sessions/');
  const { version } = await fetchLatestBaileysVersion();
  
  const conn = makeWASocket({
    logger: P({ level: 'silent' }),
    printQRInTerminal: true,
    browser: Browsers.macOS("Firefox"),
    syncFullHistory: true,
    auth: state,
    version
  });

  conn.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      if (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
        connectToWA();
      }
    } else if (connection === 'open') {
      console.log('🧬 Installing Plugins');
      const path = require('path');
      fs.readdirSync("./plugins/").forEach((plugin) => {
        if (path.extname(plugin).toLowerCase() == ".js") {
          require("./plugins/" + plugin);
        }
      });
      console.log('Plugins installed successful ✅');
      console.log('ROCHANA MD Bot connected to whatsapp ✅');
      
      let up = `╭─〔 *🤖 ROCHANA-MD BOT* 〕  
├─▸ *Ultra Super Fast Powerfull ⚠️* │     *World Best BOT ROCHANA-MD* ╰─➤ *Your Smart WhatsApp Bot is Ready To use 🍁!* - *🖤 Thank You for Choosing ROCHANA-MD!* ╭──〔 🔗 *Information* 〕  
├─ 🧩 *Prefix:* = ${prefix}
├─ 📢 *Join Channel:* │    https://whatsapp.com/channel/0029VbB04YkHAdNamg1Ob22V 
├─ 🌟 *Star the Repo:* │    https://github.com/Rochana99/ROCHANA-MD  
╰─🚀 *POWERED BY ROCHANA-MD*`;
      
      conn.sendMessage(config.OWNER_NUMBER + '@s.whatsapp.net', { 
        image: { url: `https://res.cloudinary.com/df2rnoijw/image/upload/v1752740024/bankl0exnr8remsz8t32.jpg` }, 
        caption: up 
      });
    }
  });

  conn.ev.on('creds.update', saveCreds);

  conn.ev.on('messages.update', async updates => {
    for (const update of updates) {
      if (update.update.message === null) {
        console.log("Delete Detected:", JSON.stringify(update, null, 2));
        await AntiDelete(conn, updates);
      }
    }
  });

  conn.ev.on("group-participants.update", (update) => GroupEvents(conn, update));

  conn.ev.on('messages.upsert', async(mek) => {
    mek = mek.messages[0];
    if (!mek.message) return;
    mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;

    if (config.READ_MESSAGE === 'true') {
      await conn.readMessages([mek.key]);
      console.log(`Marked message from ${mek.key.remoteJid} as read.`);
    }

    if(mek.message.viewOnceMessageV2)
      mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;

    if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_SEEN === "true"){
      await conn.readMessages([mek.key]);
    }

    if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_REACT === "true"){
      const jawadlike = await conn.decodeJid(conn.user.id);
      const emojis = ['❤️', '💸', '😇', '🍂', '💥', '💯', '🔥', '💫', '💎', '💗', '🤍', '🖤', '👀', '🙌', '🙆', '🚩', '🥰', '💐', '😎', '🤎', '✅', '🫀', '🧡', '😁', '😄', '🌸', '🕊️', '🌷', '⛅', '🌟', '🗿', '🇵🇰', '💜', '💙', '🌝', '🖤', '💚'];
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      await conn.sendMessage(mek.key.remoteJid, {
        react: {
          text: randomEmoji,
          key: mek.key,
        }
      }, { statusJidList: [mek.key.participant, jawadlike] });
    }

    if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_REPLY === "true"){
      const user = mek.key.participant;
      const text = `${config.AUTO_STATUS_MSG}`;
      await conn.sendMessage(user, { text: text, react: { text: '💜', key: mek.key } }, { quoted: mek });
    }
    
    await Promise.all([
      saveMessage(mek),
    ]);

    const m = sms(conn, mek);
    const type = getContentType(mek.message);
    const from = mek.key.remoteJid;
    const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : '';
    const isCmd = body.startsWith(prefix);
    const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
    const args = body.trim().split(/ +/).slice(1);
    const q = args.join(' ');
    const isGroup = from.endsWith('@g.us');
    const sender = mek.key.fromMe ? (conn.user.id.split(':')[0] + '@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid);
    const senderNumber = sender.split('@')[0];
    const botNumber = conn.user.id.split(':')[0];
    const pushname = mek.pushName || 'Sin Nombre';
    const isMe = botNumber.includes(senderNumber);
    const isOwner = ownerNumber.includes(sender);
    const botNumber2 = await jidNormalizedUser(conn.user.id);
    const groupMetadata = isGroup ? await conn.groupMetadata(from).catch(e => {}) : '';
    const groupName = isGroup ? groupMetadata.subject : '';
    const participants = isGroup ? await groupMetadata.participants : '';
    const groupAdmins = isGroup ? await getGroupAdmins(participants) : '';
    const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false;
    const isAdmins = isGroup ? groupAdmins.includes(sender) : false;
    const isReact = m.message?.reactionMessage ? true : false;
    const reply = (teks) => {
      conn.sendMessage(from, { text: teks }, { quoted: mek });
    };

    const isFileOwner = JSON.parse(fs.readFileSync('./lib/sudo.json', 'utf-8')).includes(sender);
    const isRealOwner = isOwner || isMe || isFileOwner;

    // Mode settings
    if (!isRealOwner && config.MODE === "private" && isGroup) return;
    if (!isRealOwner && config.MODE === "groups" && !isGroup) return;

    if (isRealOwner && body.startsWith("&")) {
      const code = body.slice(1);
      if (!code) {
        reply(`Provide me with a query to run Master!`);
        return;
      }
      try {
        const { spawn } = require("child_process");
        const child = spawn(code, { shell: true });
        child.stdout.on("data", data => reply(data.toString()));
        child.stderr.on("data", data => reply(data.toString()));
        child.on("close", code => {
          if (code !== 0) reply(`command exited with code ${code}`);
        });
      } catch (err) {
        reply(util.format(err));
      }
      return;
    }

    if (!isReact && config.AUTO_REACT === 'true') {
      const reactions = [
        '🌼', '❤️', '💐', '🔥', '🏵️', '❄️', '🧊', '🐳', '💥', '🥀', '❤‍🔥', '🥹', '😩', '🫣', '🤭', '👻', '👾', '🫶', '😻', '🙌', '🫂', '🫀', '👩‍🦰', '🧑‍🦰', '👩‍⚕️', '🧑‍⚕️', '🧕', '👩‍🏫', '👨‍💻', '👰‍♀', '🦹🏻‍♀️', '🧟‍♀️', '🧟', '🧞‍♀️', '🧞', '🙅‍♀️', '💁‍♂️', '💁‍♀️', '🙆‍♀️', '🙋‍♀️', '🤷', '🤷‍♀️', '🤦', '🤦‍♀️', '💇‍♀️', '💇', '💃', '🚶‍♀️', '🚶', '🧶', '🧤', '👑', '💍', '👝', '💼', '🎒', '🥽', '🐻', '🐼', '🐭', '🐣', '🪿', '🦆', '🦊', '🦋', '🦄', '🪼', '🐋', '🐳', '🦈', '🐍', '🕊️', '🦦', '🦚', '🌱', '🍃', '🎍', '🌿', '☘️', '🍀', '🍁', '🪺', '🍄', '🍄‍🟫', '🪸', '🪨', '🌺', '🪷', '🪻', '🥀', '🌹', '🌷', '💐', '🌾', '🌸', '🌼', '🌻', '🌝', '🌚', '🌕', '🌎', '💫', '🔥', '☃️', '❄️', '🌨️', '🫧', '🍟', '🍫', '🧃', '🧊', '🪀', '🤿', '🏆', '🥇', '🥈', '🥉', '🎗️', '🤹', '🤹‍♀️', '🎧', '🎤', '🥁', '🧩', '🎯', '🚀', '🚁', '🗿', '🎙️', '⌛', '⏳', '💸', '💎', '⚙️', '⛓️', '🔪', '🧸', '🎀', '🪄', '🎈', '🎁', '🎉', '🏮', '🪩', '📩', '💌', '📤', '📦', '📊', '📈', '📑', '📉', '📂', '🔖', '🧷', '📌', '📝', '🔏', '🔐', '🩷', '❤️', '🧡', '💛', '💚', '🩵', '💙', '💜', '🖤', '🩶', '🤍', '🤎', '❤‍🔥', '❤‍🩹', '💗', '💖', '💘', '💝', '❌', '✅', '🔰', '〽️', '🌐', '🌀', '⤴️', '⤵️', '🔴', '🟢', '🟡', '🟠', '🔵', '🟣', '⚫', '⚪', '🟤', '🔇', '🔊', '📢', '🔕', '♥️', '🕐', '🚩', '🇵🇰'
      ];
      const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
      m.react(randomReaction);
    }
          
    if (!isReact && config.CUSTOM_REACT === 'true') {
      const reactions = (config.CUSTOM_REACT_EMOJIS || '🥲,😂,👍🏻,🙂,😔').split(',');
      const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
      m.react(randomReaction);
    }
        
    const bannedUsers = JSON.parse(fs.readFileSync('./lib/ban.json', 'utf-8'));
    const isBanned = bannedUsers.includes(sender);
    if (isBanned) return;

    const events = require('./command');
    const cmdName = isCmd ? body.slice(1).trim().split(" ")[0].toLowerCase() : false;
    if (isCmd) {
      const cmd = events.commands.find((cmd) => cmd.pattern === (cmdName)) || events.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName));
      if (cmd) {
        if (cmd.react) conn.sendMessage(from, { react: { text: cmd.react, key: mek.key }});
        
        try {
          cmd.function(conn, mek, m, { from, quoted: mek, body, isCmd, command, args, q, text: q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, isRealOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply });
        } catch (e) {
          console.error("[PLUGIN ERROR] " + e);
        }
      }
    }

    events.commands.map(async(command) => {
      if (body && command.on === "body") {
        command.function(conn, mek, m, { from, l, quoted: mek, body, isCmd, command, args, q, text: q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, isRealOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply });
      } else if (mek.q && command.on === "text") {
        command.function(conn, mek, m, { from, l, quoted: mek, body, isCmd, command, args, q, text: q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, isRealOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply });
      } else if ((command.on === "image" || command.on === "photo") && mek.type === "imageMessage") {
        command.function(conn, mek, m, { from, l, quoted: mek, body, isCmd, command, args, q, text: q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, isRealOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply });
      } else if (command.on === "sticker" && mek.type === "stickerMessage") {
        command.function(conn, mek, m, { from, l, quoted: mek, body, isCmd, command, args, q, text: q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, isRealOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply });
      }
    });
  });

  conn.decodeJid = jid => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {};
      return ((decode.user && decode.server && decode.user + '@' + decode.server) || jid);
    } else return jid;
  };

  // Other utility functions (copyNForward, downloadAndSaveMediaMessage, etc.) are omitted for brevity but should be included as in your original code.
  // Make sure to add the necessary helper functions from your original code here.

}

app.get("/", (req, res) => {
  res.send("ROCHANA MD STARTED ✅");
});
app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));
setTimeout(() => {
  connectToWA();
}, 4000);
