module.exports = {
  name: 'ping',
  description: 'Pong!',
  aliases: ['pingpong', 'pong'],
  launch(client, msg, args) {
    msg.channel.createMessage(msg.guild.shard.ping)
  }
}
