const Eris = require('eris')
const { STATUS_CODES } = require('http')
const { inspect } = require('util')
let embede,
    result,
    fail,
    start,
    args

module.exports = {
  name: 'eval',
  description: 'Execute some code.',
  launch(client, msg, _args) {
    start = new Date()
    args = msg.content.replace(RegExp(`${msg.prefix}eval\\s+(\\n?)+`, `gi`), ``)

    try {
      result = inspect(eval(args), { depth: 1 })
    } catch(e) {
      result = e
      fail = true
    }
    if(result.length > 1024 && result.length < 80_000) {
      require(`hastebin-gen`)(result, { extension: 'js', url: 'https://paste.mod.gg' }).then(h => {
        msg.channel.createMessage(`Result was too big: ${h}`)
      })
    } else if(result.length > 80_000) {
      msg.channel.createMessage(`Result was too big to send to hastebin`)
    } else {
      msg.channel.createMessage({
        embed: {
          fields: [
            {
              name: '\u200B',
              value: client.code(result, 'js')
            }
          ],
          color: fail ? 0xff0033 : 0xFB71A8,
          footer: {
            text: `${new Date() - start}ms`,
            icon_url: msg.author.avatarURL
          },
          author: {
            name: msg.author.username,
            icon_url: msg.author.avatarURL,
            url: 'https://helselia.dev'
          }
        }
      })
    }
  }
}
