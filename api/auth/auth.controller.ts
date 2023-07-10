// Internal Dependencies
import { doLogin, generateToken } from './auth.service'
const logger = require('../../services/logger.service')
// import { User, UserCredentials } from '../../Interfaces/user.interface'

// External Dependencies
import { Request, Response } from 'express'
import { UserCredentials } from '../../Interfaces/user.interface'

async function login(req: Request, res: Response) {
    const credentials: UserCredentials = req.body
    try {
        const userInfo = await doLogin(credentials)
        const token = generateToken(userInfo)
        logger.info('User login: ', userInfo.email)

        res.json(token)
    } catch (err) {
        logger.error('Failed to Login ' + err)
        res.status(401).send({ err: 'Failed to Login' })
    }
}

module.exports = {
    login,
}