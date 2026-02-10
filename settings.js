import fs from 'fs'
import chalk from 'chalk'

/* ============== BOT INFO ============== */
global.mode = true // true = public, false = self
global.autoread = true
global.gcOnly = false
global.pairing = 'FENRYSSS'

global.ownerNumber = ['628xxx']
global.ownerName = 'junn'
global.botName = 'Fenrys Bot Store'
global.footer = '𝐂𝐫𝐞𝐚𝐭𝐞𝐝 𝐁𝐲 𝐉𝐮𝐧𝐚𝐚 | © 𝐂𝐨𝐩𝐲𝐫𝐢𝐠𝐡𝐭 𝟐𝟎𝟐𝟓'
global.title = '𝙁𝙚𝙣𝙧𝙮𝙨 | ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐉𝐮𝐧𝐚'
global.thumb = 'https://file.botcahx.eu.org/file/kigtcow1ll6fx41i8yqr.png' //opsional aja

global.packname = '𝐅𝐞𝐧𝐫𝐲𝐬 𝐁𝐨𝐭\n𝐂𝐫𝐞𝐚𝐭𝐞𝐝 𝐁𝐲 𝐉𝐮𝐧𝐚'
global.author = ''
global.youtube = 'https://youtube.com/@JunaaInHeree'
global.website = 'https://www.juun4.cloud'
global.idch = '123456789048@newsletter'
global.idgc = '120363069279039@g.us'

/* ============== KEY CASHIFY ============== */
// Ambil apikey di web https://cashify.my.id/
global.cashifyLicenseKey = 'LicenseKey' 
global.cashifyQrisId = 'QrisId'
global.packageCashify = 'id.dana'; //sesuaiin package id dari web
global.minFee = 50;
global.maxFee = 150;

/* ============== NOKOS ============== */
// regrist https://www.rumahotp.com
global.rumahOtpKey   = "apikey";
global.untungNokos = 10; //10 persen

/* ============== TOPUP ============== */
 // Apikey h2h atlantic tutor: https://telegra.ph/CARA-REGRISTRASI-H2H-ATLANTIC-09-30
global.atlanticKey = 'apikey';
global.untungTopup = 10; //10 persen

/* ============== MESSAGE ============== */
global.mess = {
  success: '✅ Success!',
  admin: '[ !! ] *Access Denied*\nFeature For Admins Only',
  botAdmin: '[ !! ] *Access Denied*\nBot Must Be Admins',
  creator: '[ !! ] *Access Denied*\nFeature For Owner Only',
  group: '[ !! ] *Access Denied*\nFeature For Group Only',
  private: '📩 Use this in private chat only.',
  wait: '⏳ Loading, please wait...',
  premium: '💎 Premium user only.',
  limit: '🚫 Your limit is exhausted!',
  error: '⚠️ An error occurred, please report to owner.'
}

/* ============== AUTO RELOAD ============== */
const file = new URL(import.meta.url).pathname
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(chalk.redBright(`🔄 settings.js updated`))
import(`${import.meta.url}?update=${Date.now()}`)
})