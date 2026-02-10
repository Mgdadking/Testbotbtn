let handler = async (m, { fenrys, text, participants }) => {

  const mentions = (participants || [])
    .map(p => p?.id)
    .filter(Boolean)

  if (m.quoted && m.quoted.fakeObj) {
    return fenrys.sendMessage(
      m.chat,
      {
        forward: m.quoted.fakeObj,
        mentions
      },
      { quoted: m }
    )
  }

  let content =
    (text && text.trim()) ||
    (m.quoted?.text?.trim?.() || m.quoted?.caption?.trim?.()) ||
    '\u200E' 

  await fenrys.sendMessage(
    m.chat,
    {
      text: content,
      mentions
    },
    { quoted: m }
  )
}

handler.help = ['hidetag', 'h', 'totag']
handler.tags = ['group']
handler.command = /^(h|hidetag|totag)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler