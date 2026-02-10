/* ============================================================
   FENRYS BOT — RIWAYAT PEMBELIAN USER
   Source: database/account.json
   Creator: Juna | 2025
============================================================ */

import fs from 'fs'
import path from 'path'

const ACCOUNT_DB = path.join(process.cwd(), 'database', 'account.json')

function readAccountDB(){
  if(!fs.existsSync(ACCOUNT_DB)) return { users:{} }
  try{
    return JSON.parse(fs.readFileSync(ACCOUNT_DB,'utf8')) || { users:{} }
  }catch{
    return { users:{} }
  }
}

function toJid(jid){
  return jid.includes('@') ? jid : jid + '@s.whatsapp.net'
}

let handler = async (m) => {
  const jid = toJid(m.sender)
  const db = readAccountDB()

  const user = db.users?.[jid]
  if(!user){
    return m.reply('📭 Kamu belum memiliki riwayat pembelian.')
  }

  const produkList = Object.entries(user.produk || {})
    .map(([p,q]) => `• ${p} × ${q}`)
    .join('\n') || '-'

  const text = [
    '╭──────────────────────────╮',
    '│ 🧾 *RIWAYAT PEMBELIAN*',
    '├──────────────────────────┤',
    `│ 💰 Total Pengeluaran : Rp${Number(user.total_pengeluaran||0).toLocaleString('id-ID')}`,
    `│ 📦 Total Produk      : ${user.total_produk_dibeli || 0}`,
    '├──────────────────────────┤',
    '│ 🛒 Produk Dibeli:',
    produkList,
    '╰──────────────────────────╯'
  ].join('\n')

  return m.reply(text)
}

handler.command = /^riwayat$/i
handler.tags = ['store']
handler.help = ['riwayat']
handler.group = false

export default handler