require('dotenv').config()
const Sharder = require('eris-sharder').Master;
const sharder = new Sharder(process.env.TOKEN, '/src/app.js', {
  stats: true,
  webhooks: {
    cluster: {
      id: '789111469056327710',
      token: 'gIdeOQmS5uW_Z0BImjKly1NoNMJI2YHlAEW7sHAe9gDCnyptuQf-r_hVs5ymaqpa9vv1'
    },
    shard: {
      id: '789111776795951116',
      token: 'oo3cJfaitVktL6ZZ59daj4FGBkZVl7xCI8jad52v2fwCGLDlzZl24IiTfZw5RA6keUN9'
    }
  },
  // debug: process.env.DEBUG,
  name: 'Piper'
})