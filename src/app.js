const Base = require('eris-sharder').Base
const os = require('os')
const fs = require('fs')
const fetch = require('node-fetch')
const Eris = require('eris')
const cmdCat = fs.readdirSync(`${__dirname}/commands`, { withFileTypes: true }).filter(e => e.isDirectory()).map(d => d.name)
const eventEntries = fs.readdirSync(`${__dirname}/events`).filter(f => f.endsWith('.js'))

process.on('unhandledRejection', e => {
  console.log(`Unhandled rejection: `, e)
})

process.on('uncaughtException', e => {
  console.log(`Uncaught Exception: `, e)
})

module.exports = class extends Base {
  constructor(setup) {
    super(setup)
  }

  async launch() {
    console.log(`Doing initial client setup`)
    this.bot.ipc = this.ipc
    this.bot.commands = new Eris.Collection()
    this.bot.events = new Eris.Collection()
    this.bot.cooldowns = new Eris.Collection()
    require('./util/functions.js')(this.bot)

    console.log(`Loading ${cmdCat.length} categories`)
    for(const c of cmdCat) {
      if(process.env.DEBUG)
        console.log(`Loading category: ${c}`)
      for(const f of (fs.readdirSync(`${__dirname}/commands/${c}`).filter(x => !x.startsWith('_') && x.endsWith('.js')))) {
        try {
          if(process.env.DEBUG)
            console.log(`Loading command: ${f.split('.')[0]}`)
          const command = require(`${__dirname}/commands/${c}/${f}`)
          this.bot.commands.set(command.name, {...command, category: c})
        } catch(e) {
          console.log(`Failure to load command: ${f}`)
          console.log(e)
        }
      }
    }

    console.log(`Loading ${eventEntries.length} events`)
    for(const ev of eventEntries) {
      try {
        if(process.env.DEBUG)
          console.log(`Loading event: ${ev.split('.')[0]}`)
        const event = require(`${__dirname}/events/${ev}`)
        this.bot.on(ev.split('.')[0], event.bind(null, this.bot))
      } catch(e) {
        console.log(`Failure to load event: ${ev}`)
        console.log(e)
      }
    }

    console.log(`Loaded all commands and events. Awaiting ready for ${this.bot.user.username}#${this.bot.user.discriminator}`)
  }
}
