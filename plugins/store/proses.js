import moment from 'moment-timezone'

let handler = async (m, { fenrys }) => {

  const time = moment().tz('Asia/Jakarta').format('HH:mm')
  const tanggal = moment().tz('Asia/Jakarta').format('D MMM YYYY')

  if (!m.quoted)
    return fenrys.sendMessage(
      m.chat,
      { text: '❗ Reply pesanan yang akan diproses / selesai.' },
      { quoted: m }
    )
    
  const targetJid =
    m.quoted.sender ||
    m.quoted.participant ||
    m.quoted.key?.participant

  if (!targetJid)
    return m.reply('❌ Gagal mendeteksi user.')

  const userTag = targetJid.split('@')[0]
  const quotedText = m.quoted.text || 'Tidak ada catatan pesanan.'
  const cmd = (m.text || '').trim().toLowerCase().split(/\s+/)[0]

  let text = ''

  if (cmd === 'proses') {
    text = `
「 ⏳ TRANSAKSI PENDING 」

📆 TANGGAL : ${tanggal}
⌚ JAM     : ${time}
✨ STATUS  : Pending

📝 Catatan Pesanan:
${quotedText}

Pesanan @${userTag} sedang diproses.
`.trim()
  }

  if (cmd === 'done') {
    text = `
「 ✅ TRANSAKSI BERHASIL 」

📆 TANGGAL : ${tanggal}
⌚ JAM     : ${time}
✨ STATUS  : Berhasil

Terimakasih @${userTag}
Next order ya 🙏
`.trim()
  }

  if (!text) return

  await fenrys.sendMessage(
    m.chat,
    {
      text,
      mentions: [targetJid]
    },
    { quoted: m }
  )
}

handler.help = ['proses', 'done']
handler.tags = ['store']
handler.command = /^(proses|done)$/i
handler.group = true
handler.admin = true

export default handler