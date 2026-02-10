/* ============================================================
   FENRYS BOT — RUNTIME / PING / STATUS
   Creator: Juna | 2025
============================================================ */

import os from 'os'
import speed from 'performance-now'
import { runtime } from '../../lib/myfunc.js'

let handler = async (m, { fenrys }) => {
  const startTime = speed()
  const latensi = speed() - startTime
  const totalMem = os.totalmem()
  const freeMem = os.freemem()
  const usedMem = totalMem - freeMem
  const memUsage = (usedMem / totalMem) * 100
  const uptimeServer = runtime(os.uptime())
  const serverTime = new Date().toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    hour12: false
  })

  const teks = `
— *Informasi Bot 🤖*
• *Nama Bot* : ${global.botName || 'Fenrys Bot'}
• *Runtime Bot* : ${runtime(process.uptime())}
• *Response Speed* : ${latensi.toFixed(4)} detik
• *NodeJS* : ${process.version}

— *Informasi Server 🖥️*
• *OS* : ${os.type()} (${os.arch()})
• *CPU Core* : ${os.cpus().length} Core
• *Load Avg* : ${(os.loadavg()[0] * 100 / os.cpus().length).toFixed(2)}%
• *RAM Total* : ${(totalMem / 1024 / 1024 / 1024).toFixed(2)} GB
• *RAM Terpakai* : ${(usedMem / 1024 / 1024 / 1024).toFixed(2)} GB (${memUsage.toFixed(2)}%)
• *RAM Tersisa* : ${(freeMem / 1024 / 1024 / 1024).toFixed(2)} GB
• *Uptime VPS* : ${uptimeServer}
• *Server Time* : ${serverTime}
`.trim()

  await fenrys.sendMessage(
    m.chat,
    { text: teks },
    { quoted: m }
  )
}

handler.help = ['runtime', 'ping', 'rt']
handler.tags = ['general']
handler.command = /^(runtime|ping|rt)$/i

export default handler