/* ============================================================
   FENRYS BOT — THANKS TO / CREDITS
   KALAU MAU TAMBAHIN NAMA TAMBAHIN AJA JANGAN HAPUS CREDIT GW. 
   Creator: Juna | 2025
============================================================ */

let handler = async (m, { fenrys }) => {
  const text = `
╭─「 🙏 *THANKS TO* 」─╮
│
│ ✨ *Tuhan Yang Maha Esa*
│ 👨‍👩‍👦 *Orang Tua*
│ 🤖 *Creator Bot Lain*
│ 💻 *Open Source Community*
│ 🧠 *ChatGPT*
│ ❤️ *Para Subscriber & Member Grup*
│ 
│ 𝐂𝐫𝐞𝐚𝐭𝐞𝐝 𝐁𝐲 𝐉𝐮𝐧𝐚 || © 𝟐𝟎𝟐𝟓
╰─「 ✨ ${global.botName} ✨ 」─╯
`.trim()

  await fenrys.sendMessage(
    m.chat,
    { text },
    { quoted: m }
  )
}

handler.help = ['tqto']
handler.tags = ['general']
handler.command = /^(tqto|credit|credits)$/i

export default handler