const yieldChunks = require('../../util/yieldChunks')

module.exports = {
  name: 'shards',
  description: 'Get a list of all shards and the info about the current shards.',
  aliases: ['shard', 'whatshard'],
  launch(client, msg, _args) {
    const shard = msg.channel.guild.shard
    const shardChunks = yieldChunks([...client.shards.values()], 20) // Chunks of 20 shards per page
    const shardPage = shardChunks.filter(c => c.find(s => s.id == shard.id))[0]
    const longestStatus = shardPage.reduce((acc, x) => x.status.length > acc.length ? x.status : acc, '').length

    const tableHeader = `SHARD|GUILDS |USERS  |STATUS${' '.repeat(longestStatus - 6 > 0 ? 0 : longestStatus - 6)}|PING  `
    const tableSep = `-----+-------+-------+------${'-'.repeat(longestStatus - 6 > 0 ? 0 : longestStatus - 5)}+------`
    let tableBody = `${tableHeader}\n${tableSep}\n`
    for(const s of shardPage) {
      tableBody += `${' '.repeat((5-s.id.toString().length) - (s.id == shard.id ? 1 : 0))}${shard.id == s.id ? '>' : ''}${s.id}|`
      
    }
  }
}