require('dotenv').config()
import { createServer } from 'http'
import * as appInsights from 'applicationinsights'
import app from './server'
import * as websockets from './websockets'

const key = process.env['APPINSIGHTS_INSTRUMENTATIONKEY']
if (!!key) {
    console.info(`Starting application insights for ${key}`)
    appInsights.setup(key).start()
} else {
    console.warn('No instrumentation key found')
}

const server = createServer(app)
websockets.configure(server)

const port = process.env['PORT'] ?? 8080
server.listen(port, () => {
    console.log(`🚀 rollagon server started on port ${port} 🚀`)
})
