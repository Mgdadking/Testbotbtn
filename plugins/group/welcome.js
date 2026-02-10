import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'database', 'welcome.json')

function ensureDB() {
  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })
    fs.writeFileSync(DB_PATH, JSON.stringify([]))
  }
}
function readDB() {
  ensureDB()
  try { return JSON.parse(fs.readFileSync(DB_PATH)) }
  catch { return [] }
}
function writeDB(data) {
  ensureDB()
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
}
export function setupWelcome(fenrys, store) {
  fenrys.ev.on('group-participants.update', async (update) => {
    try {
      const enabled = readDB()
      if (!enabled.includes(update.id)) {
        return
      }
      const { id: groupId, participants, action } = update
      const meta = await fenrys.groupMetadata(groupId).catch(() => null)
      if (!meta) {
        return
      }
      for (const p of participants) {
        const userJid =
          typeof p === 'string'
            ? p
            : p.phoneNumber || p.id
        if (!userJid) {
          continue
        }
        const jid = fenrys.decodeJid(userJid)
        const number = jid.replace(/@.+/, '')
        if (action === 'add') {
          await fenrys.sendMessage(groupId, {
            text:
`👋 Halo @${number}
Selamat datang di *${meta.subject}*

👥 Total member: *${meta.participants.length}*`,
            mentions: [jid]
          })
        }
        if (action === 'remove') {
          await fenrys.sendMessage(groupId, {
            text: `👋 @${number} telah meninggalkan grup`,
            mentions: [jid]
          })
        }
      }
    } catch (e) {
      console.error('[WELCOME ERROR]', e)
    }
  })
}

let handler = async (m, { text }) => {

  const on = /^(on|enable|1)$/i.test(text)
  const off = /^(off|disable|0)$/i.test(text)

  if (!on && !off)
    return m.reply('Gunakan: welcome on / welcome off')

  let list = readDB()

  if (on) {
    if (!list.includes(m.chat)) list.push(m.chat)
    writeDB(list)
    return m.reply('✅ Welcome & Leave diaktifkan')
  }

  if (off) {
    list = list.filter(v => v !== m.chat)
    writeDB(list)
    return m.reply('❎ Welcome & Leave dimatikan')
  }
}

handler.command = /^welcome$/i
handler.tags = ['group']
handler.help = ['welcome']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler