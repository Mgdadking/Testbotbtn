import fs from 'fs'
import path from 'path'

const ACCOUNT_FILE = path.join(process.cwd(), 'database', 'account.json')

function readAccount(){
  if(!fs.existsSync(ACCOUNT_FILE)) return { users:{}, mutasi:{} }
  try{ return JSON.parse(fs.readFileSync(ACCOUNT_FILE,'utf8')) }
  catch{ return { users:{}, mutasi:{} } }
}

function today(){
  return new Date().toISOString().slice(0,10)
}

function last7Days(){
  const days=[]
  for(let i=6;i>=0;i--){
    const d=new Date()
    d.setDate(d.getDate()-i)
    days.push(d.toISOString().slice(0,10))
  }
  return days
}

let handler = async (m,{ text })=>{
  const acc = readAccount()
  const arg = (text||'').trim().toLowerCase()

  if(arg === 'mingguan'){
    let tp=0,tr=0,tf=0,produk={}
    for(const d of last7Days()){
      const day=acc.mutasi[d]
      if(!day) continue
      tp+=day.total_produk_terjual||0
      tr+=day.total_pendapatan||0
      tf+=day.total_fee||0
      for(const p in day.produk){
        produk[p]=(produk[p]||0)+day.produk[p]
      }
    }
    if(!tp) return m.reply('📊 Belum ada mutasi 7 hari terakhir.')

    return m.reply(
`📊 *MUTASI MINGGUAN*

📦 Total Produk : ${tp}
💰 Pendapatan   : Rp${tr.toLocaleString('id-ID')}
⚙️ Total Fee    : Rp${tf.toLocaleString('id-ID')}

🧾 Produk:
${Object.entries(produk).map(([k,v])=>`• ${k} × ${v}`).join('\n')}`
    )
  }

  const d=today()
  const day=acc.mutasi[d]
  if(!day) return m.reply('📊 Belum ada transaksi hari ini.')

  return m.reply(
`📊 *MUTASI HARI INI (${d})*

📦 Total Produk : ${day.total_produk_terjual}
💰 Pendapatan   : Rp${day.total_pendapatan.toLocaleString('id-ID')}
⚙️ Total Fee    : Rp${day.total_fee.toLocaleString('id-ID')}

🧾 Produk:
${Object.entries(day.produk).map(([k,v])=>`• ${k} × ${v}`).join('\n')}`
  )
}

handler.command = /^mutasi$/i
handler.owner = true
handler.tags = ['owner']
handler.help = ['mutasi','mutasi mingguan']

export default handler