import fs from 'fs'
import path from 'path'
import chalk from 'chalk'

const ROOT = process.cwd()
const USER_DB = path.join(ROOT, 'database', 'user.json')

function loadUsers () {
  if (!fs.existsSync(USER_DB)) {
    fs.writeFileSync(
      USER_DB,
      JSON.stringify({ users: {} }, null, 2)
    )
  }
  return JSON.parse(fs.readFileSync(USER_DB, 'utf8'))
}

function saveUsers (db) {
  fs.writeFileSync(USER_DB, JSON.stringify(db, null, 2))
}

let handler = async (m, { fenrys }) => {
  const uid = m.sender.split('@')[0]
  const db = loadUsers()
  if (!db.users[uid]) {
    db.users[uid] = {
      id: m.sender,
      saldoNokos: 0,
      saldoTopup: 0
    }
    saveUsers(db)
  }
  const user = db.users[uid]
  const saldoNokos = Number(user.saldoNokos || 0)
  const saldoTopup = Number(user.saldoTopup || 0)
  const totalSaldo = saldoNokos + saldoTopup
  const text = `
╭───「 💰 *CEK SALDO* 」───
│ 👤 User : @${uid}
│
│ 📦 Saldo Nokos : Rp ${saldoNokos.toLocaleString('id-ID')}
│ 💳 Saldo Topup : Rp ${saldoTopup.toLocaleString('id-ID')}
│
│ 🧾 Total Saldo : Rp ${totalSaldo.toLocaleString('id-ID')}
╰──────────────────────

Terima kasih telah menggunakan ${global.botName || 'Fenrys Bot'} 🙏
`.trim()

  await fenrys.sendMessage(
    m.chat,
    {
      text,
      mentions: [m.sender]
    },
    { quoted: m }
  )
}

handler.command = /^(saldo|ceksaldo)$/i
handler.tags = ['general']
handler.help = ['saldo', 'ceksaldo']

export default handler