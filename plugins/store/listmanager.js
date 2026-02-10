/* ============================================================
   FENRYS BOT — SIMPLE BOT STORE ESM — LIST SUPPORT IMAGE
   UNTUK UPLOADER BISA KALIAN GANTI KALAU MAU PAKAI YANG LAIN
   Creator: Juna | 2025
============================================================ */

import fs from 'fs'
import path from 'path'
import { fileTypeFromBuffer } from 'file-type'
import { catbox } from '../../lib/uploader.js'

const DB_PATH = path.join(process.cwd(), 'database', 'list.json')

const readDB = () => {
  try { return JSON.parse(fs.readFileSync(DB_PATH, 'utf8')) || [] }
  catch { return [] }
}

const writeDB = (arr) => {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })
  fs.writeFileSync(DB_PATH, JSON.stringify(arr, null, 2))
}

const norm = (s='') => String(s).trim().toLowerCase()

/* ================= UPLOADER CATBOX ================= */

async function uploadFromQuotedCatbox(m){
  try{
    const qmsg = m.quoted ? m.quoted : m
    const mime = (qmsg.msg || qmsg).mimetype || ''
    if (!mime || !/^(image|video|audio|application)\//.test(mime))
      return { url:null, isImage:false }

    const buffer = await qmsg.download()
    const fileInfo = await fileTypeFromBuffer(buffer)
    const ext = fileInfo?.ext || 'bin'

    const tmpDir = path.join(process.cwd(), 'tmp')
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir)

    const filePath = path.join(tmpDir, `${Date.now()}.${ext}`)
    fs.writeFileSync(filePath, buffer)

    await m.reply('⏳ Upload ke Catbox...')
    const url = await catbox(buffer, filePath).catch(() => null)

    fs.unlinkSync(filePath)

    if (!url) throw new Error('Upload gagal')

    await m.reply(`✅ Upload sukses\n🔗 ${url}`)
    return { url, isImage: /^image\//i.test(mime) }
  } catch {
    await m.reply('❌ Upload error.')
    return { url:null, isImage:false }
  }
}

function getFullText(m){
  return (
    m.text ||
    m.message?.conversation ||
    m.message?.extendedTextMessage?.text ||
    m.message?.imageMessage?.caption ||
    ''
  )
}

function parseMultiBlocks(body){
  const lines = body.split(/\r?\n/)
  const idx = []
  const re = /^\s*\d+\s+\S+\|/

  for(let i=0;i<lines.length;i++){
    if(re.test(lines[i])) idx.push(i)
  }
  if(!idx.length) return null

  return idx.map((start,i)=>{
    const end = idx[i+1] ?? lines.length
    return lines.slice(start,end).join('\n').trim()
  })
}

let handler = async (m) => {
  const fullText = getFullText(m)
  if (!fullText) return

  const cmd = fullText.trim().split(/\s+/)[0].toLowerCase()
  const body = fullText.replace(/^(\S+)\s*/, '')

  if (cmd === 'addlist') {
    const { url, isImage } = await uploadFromQuotedCatbox(m)
    const db = readDB()

    const firstLine = body.split(/\r?\n/)[0] || ''
    const isMulti = /^\s*\d+\s+\S+\|/.test(firstLine)

    if (body.includes('|') && !isMulti) {
      const [k,...r] = body.split('|')
      const key = norm(k)
      const val = r.join('|').trim()

      if (!key || !val)
        return m.reply('⚠️ Format salah\naddlist key|response')

      if (db.some(o => o.id===m.chat && norm(o.key)===key))
        return m.reply('❌ Key sudah ada.')

      db.push({
        id: m.chat,
        key,
        respon: val,
        isImage: !!(isImage && url),
        image_url: url || '-'
      })
      writeDB(db)
      return m.reply(`✅ List *${key}* ditambahkan.`)
    }

    const blocks = parseMultiBlocks(body)
    if (!blocks)
      return m.reply(
`Gunakan:
addlist key|response
atau multi:
1 key|response
2 key|response`
      )

    let added=[], skipped=[]
    for(const blk of blocks){
      const lines = blk.split(/\r?\n/)
      const header = lines[0].replace(/^\s*\d+\s+/,'')
      if(!header.includes('|')) continue

      const [k,...r] = header.split('|')
      const key = norm(k)
      const val = [r.join('|'), lines.slice(1).join('\n')].filter(Boolean).join('\n')

      if(db.some(o=>o.id===m.chat && norm(o.key)===key)){ skipped.push(key); continue }

      db.push({
        id: m.chat,
        key,
        respon: val,
        isImage: !!(isImage && url),
        image_url: url || '-'
      })
      added.push(key)
    }

    writeDB(db)
    return m.reply(
`✅ Selesai
• Ditambah: ${added.join(', ') || '-'}
• Dilewati: ${skipped.join(', ') || '-'}`
    )
  }

  if (cmd === 'editlist') {
    const { url, isImage } = await uploadFromQuotedCatbox(m)
    let db = readDB()

    if (!body.includes('|'))
      return m.reply('⚠️ Format:\neditlist key|response baru')

    const [k,...r] = body.split('|')
    const key = norm(k)
    const val = r.join('|').trim()

    const idx = db.findIndex(o => o.id===m.chat && norm(o.key)===key)
    if (idx === -1)
      return m.reply(`❌ List *${key}* tidak ditemukan.`)

    db[idx].respon = val
    if (url) {
      db[idx].isImage = !!isImage
      db[idx].image_url = url
    }

    writeDB(db)
    return m.reply(
`✅ List *${key}* diupdate
${url ? '🖼️ Media diganti' : '✏️ Teks diperbarui'}`
    )
  }

  if (cmd === 'dellist') {
    let db = readDB()
    const keys = body.split('\n').map(norm).filter(Boolean)

    let del=[], nf=[]
    for(const k of keys){
      const i = db.findIndex(o=>o.id===m.chat && norm(o.key)===k)
      if(i===-1){ nf.push(k); continue }
      db.splice(i,1); del.push(k)
    }

    writeDB(db)
    return m.reply(
`🗑️ Hasil:
✅ Hapus: ${del.join(', ') || '-'}
❌ Tidak ada: ${nf.join(', ') || '-'}` )
  }
}

handler.help = ['addlist','editlist','dellist']
handler.tags = ['store']
handler.command = /^(addlist|editlist|dellist)$/i
handler.group = true
handler.admin = true

export default handler