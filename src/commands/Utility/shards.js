const Eris = require('eris')
const yieldChunks = require('../../util/yieldChunks')

module.exports = {
  name: 'shards',
  description: 'Get a list of all shards and the info about the current shards.',
  aliases: ['shard', 'whatshard'],
  launch(client, msg, _args) {
    const shard = msg.channel.guild.shard
    console.log(client.shards)
    const shardChunks = yieldChunks([...client.shards.values()], 20) // Chunks of 20 shards per page
    const shardPage = shardChunks.filter(c => c.find(s => s.id == shard.id))[0]
    const longestStatus = shardPage.reduce((acc, x) => x.status.length > acc.length ? x.status : acc, '').length
    const guildShardMap = new Eris.Collection(Number)
    Object.keys(client.guildShardMap).forEach(k => guildShardMap.set(k, client.guildShardMap[k]))
    let avgPing = 0
    let guildCount = 0
    let userCount = 0
    let readyCount = 0

    const tableHeader = `SHARD|GUILDS |USERS  |STATUS${' '.repeat(longestStatus - 6 < 0 ? 0 : longestStatus - 6)}|PING  `
    const tableSep = `-----+-------+-------+------${'-'.repeat(longestStatus - 6 < 0 ? 0 : longestStatus - 5)}+------`
    let tableBody = `${tableHeader}\n${tableSep}\n`
    for(const s of shardPage) {
      const shardGuildMap = guildShardMap.filter(sid => sid == s.id)
      const guildLengthForShard = shardGuildMap.length
      const memberCountForShard = Array.from(guildShardMap.keys()).filter(k => guildShardMap.get(k) == s.id).map(gid => client.guilds.find(g => g.id == gid)).reduce((acc, g) => acc + g.memberCount, 0)
      const shardStatus = s.status.toUpperCase()
      const statusLengthForShard = shardStatus.length
      tableBody += `${' '.repeat((5-s.id.toString().length) - (s.id == shard.id ? 1 : 0))}${shard.id == s.id ? '>' : ''}${s.id}|`
      tableBody += `${guildLengthForShard}${' '.repeat(7 - guildLengthForShard.toString().length)}|`
      tableBody += `${memberCountForShard}${' '.repeat(7 - memberCountForShard.toString().length < 0 ? 0 : 7 - memberCountForShard.toString().length)}|`
      tableBody += `${shardStatus}${' '.repeat(longestStatus -  statusLengthForShard < 1 ? 1 : longestStatus - statusLengthForShard)}|`
      tableBody += `${s.latency}ms\n`
      avgPing += s.latency
      guildCount += guildLengthForShard
      userCount += memberCountForShard
      if(shardStatus == "READY")
        readyCount++
    }
    tableBody += `TOTAL|`
    tableBody += `${guildCount}${' '.repeat(7 - guildCount.toString().length)}|`
    tableBody += `${userCount}${' '.repeat(7 - userCount.toString().length)}|`
    tableBody += `R: ${readyCount}${' '.repeat(longestStatus + 1 - `R: ${readyCount}`.length < 1 ? 1 : longestStatus + 1 - `R: ${readyCount}`.length)}|`
    tableBody += `AVG ${avgPing / shardPage.length}ms`

    msg.channel.createMessage(client.code(tableBody, ''))
  }
}