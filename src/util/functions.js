const Eris = require('eris')

module.exports = client => {
  client.wait = require('util').promisify(setTimeout)
  client.code = (contents, lang = 'asciidoc') => {
    return `${'```'}${lang}\n${contents}${'\n```'}`
  }
}
