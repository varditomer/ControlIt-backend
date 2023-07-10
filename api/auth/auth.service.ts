import { PartnerUser, User, UserCredentials, UserInfo } from "../../Interfaces/user.interface"

// Internal Dependencies
import { getByEmail } from '../../services/partnerUser.service'
const logger = require('../../services/logger.service')

// External Dependencies
const bcrypt = require('bcrypt')
import * as dotenv from 'dotenv'
const jwt = require('jsonwebtoken')


dotenv.config()

async function doLogin(credentials: UserCredentials) {
    logger.debug(`auth.service - login try with email: ${credentials.email}`)

    const partnerUsers = await getByEmail(credentials.email)
    if (!partnerUsers.length) return Promise.reject('Invalid email')

    const match = await bcrypt.compare(credentials.password, partnerUsers[0].password)
    if (!match) return Promise.reject('Invalid username or password')

    // removing password from partner users and structure the userInfo object
    const userInfo: UserInfo = {
        email: partnerUsers[0].email,
        partners: partnerUsers.map(user => user.partner_id)
    }

    return userInfo
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

function generateToken(userInfo: UserInfo) {
    return jwt.sign(userInfo, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
}

function verifyToken(token: string) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded; // The decoded payload
      } catch (error) {
        // Token verification failed
        console.error('Failed to verify token:', error)
        throw new Error('Failed to verify token.')
      }
}

export {
    doLogin,
    generateToken,
    verifyToken,
    hashPassword,
}