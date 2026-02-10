/* ============================================================
   TOPUP — AUTO TARGET INPUT (BEFORE HOOK)
   Creator: Juna 
============================================================ */

import fs from 'fs'
import path from 'path'

const ROOT = process.cwd()
const TRX_DIR = path.join(ROOT, 'database', 'topup', 'transaction')

function normalizeTarget(productId, input){
  if (String(productId).startsWith('ML')){
    const [a,b] = String(input||'').split('#')
    if (!a || !b)
      return { ok:false, msg:'❌ Format ML salah\nContoh: 123456#1234' }
    return { ok:true, target:`${a}|${b}` }
  }
  return { ok:true, target: String(input).trim() }
}

function buildTargetHint(pid){
  if (String(pid).startsWith('ML'))
    return '📌 Mobile Legends\nFormat: 123456#1234'
  return '📌 Masukkan ID / target sesuai produk'
}

export default {
  async before(m, { fenrys }) {

    if (!m.text) return false
    if (/^[!.\/#]/.test(m.text)) return false

    const uid = m.sender.split('@')[0]
    const trxFile = path.join(TRX_DIR, `${uid}.json`)

    if (!fs.existsSync(trxFile)) return false

    let trx
    try {
      trx = JSON.parse(fs.readFileSync(trxFile,'utf8'))
    } catch {
      return false
    }

    if (trx.status !== 'need_target') return false

    const input = m.text.trim()
    if (!input) return true

    const norm = normalizeTarget(trx.productId, input)
    if (!norm.ok){
      await fenrys.sendMessage(m.chat,{ text: norm.msg },{ quoted:m })
      return true
    }

    trx.target = norm.target
    trx.target_raw = input
    trx.status = 'need_confirm'

    fs.writeFileSync(trxFile, JSON.stringify(trx,null,2))

    await fenrys.sendButtonMsg(m.chat,{
      text:
`📌 *KONFIRMASI TOPUP*

📦 Produk: ${trx.productName}
💰 Harga: Rp ${Number(trx.price).toLocaleString('id-ID')}
🎯 Target: ${input}

Lanjutkan?`,
      footer: global.footer,
      buttons:[
        { buttonId:'confirmtopup', buttonText:{ displayText:'✅ Konfirmasi' }, type:1 },
        { buttonId:'canceltopup', buttonText:{ displayText:'🔁 Ubah Target' }, type:1 }
      ]
    },{ quoted:m })

    return true
  }
}