module.exports = (client) => {
  try {
    console.log(`Ready from ${client.user.username}#${client.user.discriminator}`)
    client.editStatus(`online`, {
      name: `BeatSaber | ${client.shards.size} shard${client.shards.size > 1 ? 's' : ''}`,
      type: 0
    })
  } catch(e) {
    console.log(`Failure on ready: `)
    console.log(e)
  }
}
