// Internal Dependencies
import { doLogin } from './auth.service'
const logger = require('../../services/logger.service')
// import { User, UserCredentials } from '../../Interfaces/user.interface'

// External Dependencies
import { Request, Response } from 'express'
import { UserCredentials } from '../../Interfaces/user.interface'

async function login(req: Request, res: Response) {
    const credentials: UserCredentials = req.body
    console.log(`req.body:`, req.body)
    try {
        const users = await doLogin(credentials)
        // const loginToken = getLoginToken(users)

        // logger.info('User login: ', users)

        // res.cookie('loginToken', loginToken, { sameSite: 'none', secure: true })
        res.json('success')
    } catch (err) {
        logger.error('Failed to Login ' + err)
        res.status(401).send({ err: 'Failed to Login' })
    }
}

// async function signup(req: Request, res: Response) {
//     try {
//         const credentials: UserCredentials = req.body
//         const account = await authService.signup(credentials)
//         logger.debug(`auth.route - new account created: ` + JSON.stringify(account))

//         const user: User = await authService.login(credentials.username, credentials.password)
//         logger.info('User signup: ', user)

//         const loginToken = authService.getLoginToken(user)

//         res.cookie('loginToken', loginToken, { sameSite: 'none', secure: true })
//         res.json(user)

//     } catch (err) {
//         logger.error('Failed to Signup ' + err)
//         res.status(500).send({ err: 'Failed to Signup' })
//     }
// }

// async function logout(req: Request, res: Response) {
//     try {
//         res.clearCookie('loginToken')
//         res.send({ msg: 'Logged out successfully' })

//     } catch (err) {
//         logger.error('Failed to Logout ' + err)
//         res.status(500).send({ err: 'Failed to Logout' })
//     }
// }

module.exports = {
    login,
    // signup,
    // logout
}