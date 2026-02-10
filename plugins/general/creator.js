import PhoneNumber from 'awesome-phonenumber'
import { sleep, parseMention } from '../../lib/myfunc.js'

/* ================== CONTACT SENDER ================== */
async function sendContactArray(conn, jid, data, quoted, options = {}) {
  if (!Array.isArray(data[0]) && typeof data[0] === 'string')
    data = [data]

  let contacts = []

  for (let [number, name, org, label, address, desc] of data) {
    number = number.replace(/[^0-9]/g, '')
    const njid = number + '@s.whatsapp.net'

    const vcard = `
BEGIN:VCARD
VERSION:3.0
N:Sy;${name};;;
FN:${name}
ORG:${org}
TEL;waid=${number}:${PhoneNumber('+' + number).getNumber('international')}
ADR:;;${address};;;;
NOTE:${desc}
END:VCARD`.trim()

    contacts.push({
      vcard,
      displayName: name
    })
  }

  return conn.sendMessage(
    jid,
    {
      contacts: {
        displayName:
          contacts.length > 1
            ? `${contacts.length} Kontak`
            : contacts[0].displayName,
        contacts
      }
    },
    { quoted, ...options }
  )
}

/* ================== HANDLER ================== */
let handler = async (m, { fenrys }) => {
  const botNumber = fenrys.user.id.split('@')[0]

  await sendContactArray(
    fenrys,
    m.chat,
    [
      [
        global.ownerNumber,
        global.ownerName,
        global.botName+' Developer',
        'Owner',
        'Sleman, Jawa Tengah, Indonesia',
        'Developer '+global.botName
      ],
      [
        botNumber,
        global.botName,
        'Bot WhatsApp',
        'Bot',
        'Indonesia',
        'Bot WhatsApp yang sering error 😭'
      ]
    ],
    m
  )

  const target = m.sender
  const text = `👋 Hai @${target.split('@')[0]}

Itu adalah kontak owner aku ya kak  
❗ Tolong jangan spam 🙏`

  await sleep(1000)
  await fenrys.sendMessage(
    m.chat,
    { text, mentions: [target] },
    { quoted: m }
  )
}

/* ================== META ================== */
handler.help = ['owner', 'creator']
handler.tags = ['general']
handler.command = /^(owner|creator)$/i

export default handler