let handler = async (m, { fenrys, text }) => {
  if (!text) return m.reply('❌ Kode produk tidak ditemukan.')

  await fenrys.sendButtonMsg(m.chat,{
    text:`💳 *Pilih Metode Pembayaran*\nProduk: ${text}`,
    footer: global.footer,
    buttons:[{
      buttonId:'topup_method',
      buttonText:{ displayText:'💳 Metode Pembayaran' },
      nativeFlowInfo:{
        name:'single_select',
        paramsJson: JSON.stringify({
          title:'Metode Pembayaran',
          sections:[{
            title:'Pilih metode',
            rows:[
              { title:'QRIS (Pay to Buy)', description:'Bayar via QRIS', id:`topup ${text}|qris` },
              { title:'Saldo Topup', description:'Pakai saldoTopup', id:`topup ${text}|saldo` }
            ]
          }]
        })
      },
      type:2
    }]
  },{ quoted:m })
}

handler.command = /^method$/i
handler.tags = ['topup']
export default handler