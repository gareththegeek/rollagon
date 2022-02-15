import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import mongoSanitize from 'express-mongo-sanitize'
import routes from './routes'
import controllers from './controllers'

const app = express()

const CORS_ORIGIN = process.env['CORS_ORIGIN'] ?? '*'

app.use(cors({ origin: CORS_ORIGIN }))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.use(mongoSanitize())

routes(app)

app.use(controllers.errors.handler)
app.use(express.static('public'))

export default app
