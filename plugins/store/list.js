import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'database', 'list.json')

const readDB = () => {
  try { return JSON.parse(fs.readFileSync(DB_PATH, 'utf8')) || [] }
  catch { return [] }
}

let handler = async (m, { fenrys }) => {
  const db = readDB()
  const listGroup = db.filter(i => i.id === m.chat)

  if (!listGroup.length)
    return m.reply('❌ Belum ada list message di grup ini.')

  let groupName = ''
  try {
    const meta = await fenrys.groupMetadata(m.chat)
    groupName = meta?.subject || ''
  } catch {}

  const keys = listGroup
    .map(i => String(i.key).toUpperCase())
    .sort((a,b)=>a.localeCompare(b))

  const rows = keys.map(k => ({
    title: k,
    description: 'Klik untuk lihat detail',
    id: k.toLowerCase() 
  }))

  const text = `
╭───❏  🗂️ *LIST STORE*  ❏───╮
│ 👋 Halo : Kak ${m.pushName}
│ 🏷️ Grup : ${groupName || 'Grup Ini'}
│ 📦 Total : ${keys.length} List
╰────────────────────────────╯

Pilih produk di bawah untuk melihat detail.
`.trim()

  await fenrys.sendButtonMsg(
    m.chat,
    {
      text,
      footer: global.footer,
      buttons: [{
        buttonId: 'list_menu',
        buttonText: { displayText: '📦 Lihat Daftar Produk' },
        type: 2,
        nativeFlowInfo: {
          name: 'single_select',
          paramsJson: JSON.stringify({
            title: 'Daftar Produk',
            sections: [{
              title: 'Produk Tersedia',
              rows
            }]
          })
        }
      }]
    },
    { quoted: m }
  )
}

handler.help = ['list']
handler.tags = ['store']
handler.command = /^(list)$/i
handler.group = true

export default handler