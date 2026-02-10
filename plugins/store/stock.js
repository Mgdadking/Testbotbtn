import fs from 'fs'
import path from 'path'

const STOCK_DIR = path.join(process.cwd(), 'database', 'stock')

function ensure() {
  try { fs.mkdirSync(STOCK_DIR, { recursive: true }) } catch {}
}

function readStocks() {
  ensure()
  return fs.readdirSync(STOCK_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      const raw = JSON.parse(fs.readFileSync(path.join(STOCK_DIR, f)))
      return {
        product: f.replace('.json', ''),
        harga: raw.harga ?? null,
        stok: Array.isArray(raw.items) ? raw.items.length : 0
      }
    })
    .filter(x => x.stok > 0 && x.harga)
    .sort((a,b)=>a.product.localeCompare(b.product))
}

let handler = async (m, { fenrys }) => {
  const stocks = readStocks()
  if (!stocks.length) return m.reply('❌ Stock kosong.')

  const rows = stocks.map(s => ({
    title: s.product.toUpperCase(),
    description: `💰Harga Rp${s.harga.toLocaleString('id-ID')} | 📦Total ${s.stok} akun`,
    id: `addkeranjang ${s.product}`
  }))

  await fenrys.sendButtonMsg(m.chat, {
    text: '🛒 *DAFTAR STOCK AKUN*\n\nKlik produk untuk tambah ke keranjang (1 pcs).',
    footer: global.footer,
    buttons: [{
      buttonId: 'add_keranjang',
      buttonText: { displayText: '🛒 Tambah ke Keranjang' },
      type: 2,
      nativeFlowInfo: {
        name: 'single_select',
        paramsJson: JSON.stringify({
          title: 'Stock Tersedia',
          sections: [{ title: 'Produk', rows }]
        })
      }
    }, {
        buttonId: "keranjang",
        buttonText: { displayText: "🛒 Keranjang Saya" },
        type: 1
      }
      ]
  }, { quoted: m })
}

handler.command = /^stock$/i
handler.tags = ['store']
handler.help = ['stock']
export default handler