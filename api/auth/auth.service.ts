import { PartnerUser, User, UserCredentials } from "../../Interfaces/user.interface"

// Internal Dependencies
import { getByEmail } from '../partner-user/partnerUser.service'
const logger = require('../../services/logger.service')

// External Dependencies
const bcrypt = require('bcrypt')
import * as dotenv from 'dotenv'

dotenv.config()

async function doLogin(credentials: UserCredentials) {
    // logger.debug(`auth.service - login try with email: ${credentials.email}`)
    console.log(`auth.service - login try with email: ${credentials.email}`)

    const partnerUsers = await getByEmail(credentials.email)
    if (!partnerUsers.length) return Promise.reject('Invalid email')
    console.log(`partnerUsers:`, partnerUsers.length)

    const match = await bcrypt.compare(credentials.password, partnerUsers[0].password)
    if (!match) return Promise.reject('Invalid username or password')
    console.log(`match:`, match)

    // removing password from partner users for return to front
    const users: User[] = partnerUsers.map(({ password, ...rest }) => rest)

    return users
}

async function signup({ email, password }: UserCredentials) {
    const saltRounds = 10

    logger.debug(`auth.service - signup with email: ${email}`)
    if (!email || !password) return Promise.reject('Missing required signup information')

    const hash = await bcrypt.hash(password, saltRounds)
    return { email, password: hash }
    // return userService.add({ email, password: hash })
}

async function hashPassword(password: string) {
    const saltRounds = 10

    const hash = await bcrypt.hash(password, saltRounds)
    return hash
}

function getLoginToken(users: User[]) {
    // return users.map(user => cryptr.encrypt(JSON.stringify({ _id: user._id, email: user.email })))
    return
}

// function validateToken(loginToken: any) {
//     try {
//         const json = cryptr.decrypt(loginToken)
//         const loggedinUser = JSON.parse(json)
//         return loggedinUser
//     } catch (err) {
//         console.log('Invalid login token')
//     }
//     return null
// }

export {
    doLogin,
    // getLoginToken,
    // validateToken,
    hashPassword,
    // signup
}