const Eris = require('eris')
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
    const guildShardMap = new Eris.Collection(Number)
    Object.keys(client.guildShardMap).forEach(k => guildShardMap.set(k, client.guildShardMap[k]))
    let avgPing = 0

    const tableHeader = `SHARD|GUILDS |USERS  |STATUS${' '.repeat(longestStatus - 6 < 0 ? 0 : longestStatus - 6)}|PING  `
    const tableSep = `-----+-------+-------+------${'-'.repeat(longestStatus - 6 < 0 ? 0 : longestStatus - 5)}+------`
    let tableBody = `${tableHeader}\n${tableSep}\n`
    for(const s of shardPage) {
      const shardGuildMap = guildShardMap.filter(sid => sid == s.id)
      const guildLengthForShard = shardGuildMap.length
      console.log(guildShardMap)
      console.log(guildShardMap.keys())
      const memberCountForShard = Array.from(guildShardMap.keys()).filter(k => guildShardMap.get(k) == s.id).map(gid => client.guilds.find(g => g.id == gid)).reduce((acc, g) => { 
        console.log(g)
        return acc + g.memberCount
      }, 0)
      const shardStatus = s.status.toUpperCase()
      const statusLengthForShard = shardStatus.length
      tableBody += `${' '.repeat((5-s.id.toString().length) - (s.id == shard.id ? 1 : 0))}${shard.id == s.id ? '>' : ''}${s.id}|`
      tableBody += `${guildLengthForShard}${' '.repeat(7 - guildLengthForShard.toString().length)}|`
      tableBody += `${memberCountForShard}${' '.repeat(7 - memberCountForShard.toString().length < 0 ? 0 : 7 - memberCountForShard.toString().length)}|`
      tableBody += `${shardStatus}${' '.repeat(longestStatus -  statusLengthForShard < 1 ? 1 : longestStatus - statusLengthForShard)}|`
      tableBody += `${s.latency}ms\n`
      avgPing += s.latency
    }
    msg.channel.createMessage(client.code(tableBody, ''))
  }
}