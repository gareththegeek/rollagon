import express from 'express'
import bodyParser from 'body-parser'
import routes from './routes'
import controllers from './controllers'

const app = express()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())

routes(app)

app.use(controllers.errors.handler)

export default app
