let handler = async (m, { fenrys }) => {
  const pluginCount = Object.keys(global.plugins).length
  const featureCount = Object.values(global.plugins)
    .map(p => p.help?.length || 0)
    .reduce((a, b) => a + b, 0)

  const uptime = clockString(process.uptime())
  const ram = (process.memoryUsage().rss / 1024 / 1024).toFixed(0) + 'MB'

  let text = `
╭───❏  ${global.botName}  ❏───╮
│👤 Owner   : ${global.ownerName}
│📞 Contact : wa.me/${global.ownerNumber[0]}
│📦 Plugins : ${pluginCount}
│💡 Features: ${featureCount}
│🟢 Mode    : ${global.mode ? 'Public' : 'Self'}
│⏱ Uptime  : ${uptime}
│💾 RAM     : ${ram}
╰────────────────────────────╯

Halo Kak ${m.pushName} 👋
silakan pilih kategori fitur di bawah 👇
`

  const categories = {}
  for (const plugin of Object.values(global.plugins)) {
    const tag = plugin.tags?.[0]
    const cmds = plugin.help || []
    if (!tag || cmds.length === 0) continue
    if (!categories[tag]) categories[tag] = []
    cmds.forEach(cmd => categories[tag].push(cmd))
  }

  const rows = Object.entries(categories).map(([tag, cmds]) => ({
    title: `${tag.toUpperCase()} (${cmds.length})`,
    description: `Lihat ${cmds.length} perintah`,
    id: `menucat ${tag}`
  }))

  await fenrys.sendButtonMsg(
    m.chat,
    {
      text,
      footer: global.footer,
      buttons: [
        {
          buttonId: 'menu_category',
          buttonText: { displayText: '📚 Daftar Kategori' },
          nativeFlowInfo: {
            name: 'single_select',
            paramsJson: JSON.stringify({
              title: 'Kategori Fitur',
              sections: [
                {
                  title: 'Daftar Menu',
                  rows
                }
              ]
            })
          },
          type: 2
        }
      ],
      contextInfo: {
        mentionedJid: [m.sender]
      }
    },
    { quoted: m }
  )
}

handler.command = /^(menu|help)$/i
handler.help = ['menu', 'help']
handler.tags = ['general']

export default handler

function clockString(sec) {
  sec = Math.floor(sec)
  const h = String(Math.floor(sec / 3600)).padStart(2, '0')
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0')
  const s = String(sec % 60).padStart(2, '0')
  return `${h}:${m}:${s}`
}