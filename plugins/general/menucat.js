let handler = async (m, { fenrys, args }) => {
  const tag = args[0]
  if (!tag) {
    return fenrys.sendMessage(
      m.chat,
      { text: '❌ Kategori tidak valid.\nContoh: *menucat general*' },
      { quoted: m }
    )
  }

  const cmds = []

  for (const plugin of Object.values(global.plugins)) {
    if (plugin.tags?.[0] === tag) {
      if (Array.isArray(plugin.help)) {
        cmds.push(...plugin.help)
      }
    }
  }

  if (!cmds.length) {
    return fenrys.sendMessage(
      m.chat,
      { text: `❌ Tidak ada perintah di kategori *${tag}*.` },
      { quoted: m }
    )
  }

  const now = new Date()
  const hari = now.toLocaleDateString('id-ID', { weekday: 'long' })
  const tanggal = now.toLocaleDateString('id-ID')
  const jam = now.toLocaleTimeString('id-ID')
  const uptime = clockString(process.uptime())
  const ram = (process.memoryUsage().rss / 1024 / 1024).toFixed(0) + 'MB'

  let text = `
╭───❏  MENU CATEGORY  ❏───╮
│📂 Kategori : ${tag.toUpperCase()}
│📅 Hari     : ${hari}
│📆 Tanggal  : ${tanggal}
│⏰ Jam      : ${jam}
│⏱ Uptime   : ${uptime}
│💾 RAM      : ${ram}
╰────────────────────────╯

📜 *Daftar Perintah:*
┌─❏
${cmds.map(cmd => `│ ▸ ${cmd}`).join('\n')}
└───────────────
✨ *Total:* ${cmds.length} perintah
`

  await fenrys.sendMessage(
    m.chat,
    { text },
    { quoted: m }
  )
}

handler.command = /^menucat$/i
handler.tags = ['general']

export default handler

function clockString(sec) {
  sec = Math.floor(sec)
  const h = String(Math.floor(sec / 3600)).padStart(2, '0')
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0')
  const s = String(sec % 60).padStart(2, '0')
  return `${h}:${m}:${s}`
}