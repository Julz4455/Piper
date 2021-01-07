module.exports = {
  name: 'ping',
  description: 'Pong!',
  aliases: ['pingpong', 'pong'],
  launch(_client, msg, _args) {
    msg.channel.createMessage(`Pong!\n\`${msg.channel.guild.shard.latency}ms\``)
  }
}
