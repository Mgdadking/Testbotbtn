let handler = async (m, { fenrys, text }) => {
  const amount = Number(text)
  if (!amount || amount < 2000)
    return m.reply('❌ Minimal deposit Rp 2.000\nContoh: deposit 5000')

  await fenrys.sendButtonMsg(m.chat,{
    text:
`💰 *PILIH JENIS DEPOSIT*

Nominal: Rp ${amount}

Silakan pilih saldo tujuan deposit.`,
    footer: global.footer,
    buttons:[
      {
        buttonId:`depositnokos ${amount}`,
        buttonText:{ displayText:'📱 Deposit NOKOS' },
        type:1
      },
      {
        buttonId:`deposittopup ${amount}`,
        buttonText:{ displayText:'🎮 Deposit TOPUP' },
        type:1
      }
    ]
  },{ quoted:m })
}

handler.command = /^deposit$/i
handler.tags = ['general']
handler.help = ['deposit']
export default handler