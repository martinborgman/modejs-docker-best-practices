// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })
const PORT = 3000
const HOST = '0.0.0.0'

async function closeGracefully(signal) {
  fastify.log.info(`Received signal to terminate: ${signal}`)

  await fastify.close()
  // await db.close() if we have a db connection in this app
  // await other things we should cleanup nicely
  process.exit()
}
process.on('SIGINT', closeGracefully)
process.on('SIGTERM', closeGracefully)

// Declare a route
fastify.get('/delayed', async (request, reply) => {
  const MILLISECONDS_DELAY = 6000
  await new Promise(resolve => {
    setTimeout(() => resolve(), MILLISECONDS_DELAY)
  })
  return { hello: 'delayed world' }
})

fastify.get('/', async (request, reply) => {
  return { hello: 'world' }
})

// Run the server!
const start = async () => {
  try {
    await fastify.listen(PORT, HOST)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()