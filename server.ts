// External Dependencies
import { Request, Response } from 'express'
const express = require('express')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')
import * as dotenv from "dotenv"

// import { _createDemoData } from './services/db.service'
// // import { _createDatabaseTablesDemoData } from './services/db.service'
// // _createDatabaseTablesDemoData()
// _createDemoData()



const app = express()
const http = require('http').createServer(app)

// Express App Config
app.use(cookieParser())
app.use(express.json())
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'public')))
} else {
    const corsOptions = {
        origin: ['http://127.0.0.1:5173', 'http://localhost:5173', 'http://localhost:8080', 'http://127.0.0.1:3000', 'http://localhost:3000'],
        credentials: true
    }
    app.use(cors(corsOptions))
}
const authRoutes = require('./api/auth/auth.routes')
// const partnerUserRoutes = require('./api/partner-user/partnerUser.routes')
// const partnerRoutes = require('./api/partner/partner.routes')
// const accountRoutes = require('./api/account/account.routes')

// routes
// const setupAsyncLocalStorage = require('./middlewares/setupAls.middleware')
// app.all('*', setupAsyncLocalStorage)
app.use('/api/auth', authRoutes)
// app.use('/api/partner-user', partnerUserRoutes)
// app.use('/api/partner', partnerRoutes)
// app.use('/api/account', accountRoutes)

// app.use('/api/car', (req: Request, res: Response) => {
//     res.send('Not implemented, get from misterBackend...')
// })
// setupSocketAPI(http)

// Make every server-side-route to match the index.html
// so when requesting http://localhost:3030/index.html/car/123 it will still respond with
// our SPA (single page app) (the index.html file) and allow vue/react-router to take it from there
app.get('/**', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

dotenv.config()
const logger = require('./services/logger.service')
const port = process.env.PORT
http.listen(port, () => {
    logger.info('Server is running on port: ' + port)
})