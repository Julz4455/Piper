module.exports = (client) => {
  console.log("running now")
  try {
    console.log(`Ready from ${client.user.username}#${client.user.discriminator}`)
    client.editStatus(`online`, {
      name: 'BeatSaber',
      type: 0
    })
  } catch(e) {
    console.log(`Failure on ready: `)
    console.log(e)
  }
}
