import path from 'path'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import mongoSanitize from 'express-mongo-sanitize'
import routes from './routes'
import controllers from './controllers'
import * as nocache from './nocache'

const app = express()

const CORS_ORIGIN = process.env['CORS_ORIGIN'] ?? '*'
app.use(cors({ origin: CORS_ORIGIN }))
app.use(controllers.securityHeaders.handler)

app.use(bodyParser.urlencoded({ extended: true,  }));
app.use(express.json())
app.use(mongoSanitize())

app.use('/api/*', nocache.middleware)

routes(app)

app.use(controllers.errors.handler)

app.use(express.static('public'))
app.get('*', function (_, response) {
    response.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})

export default app
