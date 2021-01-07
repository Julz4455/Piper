const { RequestHandler, DiscordHTTPError } = require("eris")

const Eris = require('eris')

module.exports = async (client, msg) => {
  const loweredContent = msg.content.toLowerCase()
  let prefix = 'p.'
  let isDM = false

  // DM Support
  if(msg.channel.type != 'text') isDM = true
  
  // Delete and Ignore messages with the Bot's token
  if(msg.content.includes(client.token.replace(/bot ?/gi, ''))) return msg.delete()

  // Ignore Bot users
  if(msg.author.bot || msg.webhookID) return;

  // Get guild prefix if there isn't a matching global prefix
  if(!loweredContent.startsWith('p.') || !loweredContent.startsWith('pip ')) {
    // TODO: Get guild prefix
  }
  
  // Prefix checking
  if(!loweredContent.startsWith('p.') && loweredContent.startsWith('pip ')) prefix = 'pip '
  if(!loweredContent.startsWith(prefix)) return;

  // Get the current command
  const args = msg.content.slice(prefix.length).split(/\s+/)
  const commandName = args.shift().toLowerCase()
  const command = client.commands.get(commandName)
               || client.commands.find(c => c.aliases && c.aliases.includes(commandName))
  
  // Exit on invalid command
  if(!command) return;

  // Handle cooldown bucket creation
  if(!client.cooldowns.has(command.name)) {
    client.cooldowns.set(command.name, new Eris.Collection())
  }

  // Handle cooldown creation
  const now = Date.now()
  const stamps = client.cooldowns.get(command.name)
  const cdAmount = (command.cooldown || 3) * 1000
  if(stamps.has(msg.author.id)) {
    const exp = stamps.get(msg.author.id) + cdAmount

    if(now < exp) {
      const left = (exp - now) / 1000
      return msg.channel.createMessage(`<@!${msg.author.id}>, You may not use the \`${command.name}\` command for another ${left} seconds`)
    }
  }
  stamps.set(msg.author.id, now)
  setTimeout(() => stamps.delete(msg.author.id), cdAmount)

  try {
    if(command.args && !args.length) {
      return msg.channel.createMessage(`Please employ the proper usage of this command: \`\`\`\n${command.usage}\`\`\``)
    }

    msg.prefix = prefix
    await command.launch(client, msg, args)
  } catch (e) {
    console.log(`Some error occured while launching command ${command.name}: `, e)
    msg.channel.createMessage(`Sorry, there was an issue processing that command on our side.\n**We recommend you report this to the owner: *Constanze#0001***`)
  }
}
