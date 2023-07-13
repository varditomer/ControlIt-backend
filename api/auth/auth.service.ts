import { Partner, PartnerUser, User, UserCredentials, UserInfo } from "../../Interfaces/user.interface"

// Internal Dependencies
import { getPartnerUsersExpandedByEmail } from '../../services/partnerUser.service'
const logger = require('../../services/logger.service')

// External Dependencies
const bcrypt = require('bcrypt')
import * as dotenv from 'dotenv'
const jwt = require('jsonwebtoken')


dotenv.config()

async function doLogin(credentials: UserCredentials) {
    logger.debug(`auth.service - login try with email: ${credentials.email}`)

    const partnerUsersExpanded = await getPartnerUsersExpandedByEmail(credentials.email)
    if (!partnerUsersExpanded.length) return Promise.reject('Invalid email')

    const match = await bcrypt.compare(credentials.password, partnerUsersExpanded[0].password)
    if (!match) return Promise.reject('Invalid username or password')

    // removing password from partner users and structure the userInfo object
    const userInfo: UserInfo = {
        email: partnerUsersExpanded[0].email,
        partners: partnerUsersExpanded.map(partnerUserExpanded => ({
            _id: partnerUserExpanded.partner_id,
            name: partnerUserExpanded.partner_name
        } as Partner)
        )
    }

    return userInfo
}

async function hashPassword(password: string) {
    const saltRounds = 10

    const hash = await bcrypt.hash(password, saltRounds)
    return hash
}

function generateToken(userInfo: UserInfo) {
    return jwt.sign(userInfo, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
}

function verifyToken(loginToken: string): any {
    try {
        const decryptUserInfo = jwt.verify(loginToken, process.env.JWT_SECRET)
        return decryptUserInfo
    } catch (error) {
        
    }
}

export {
    doLogin,
    generateToken,
    verifyToken,
    hashPassword,
}