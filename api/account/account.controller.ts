// Internal Dependencies
const accountService = require('./account.service')
const logger = require('../../services/logger.service')
import { Account } from '../../Interfaces/account.interface'

// External Dependencies
import { Request, Response } from 'express'
import { UserInfo } from '../../Interfaces/user.interface';

interface AccountControllerRequest extends Request {
    userInfo: UserInfo
}

async function getAccounts(req: AccountControllerRequest, res: Response) {
    try {
        const { userInfo } = req; // Access the userInfo from req object
        const { partners } = userInfo
        const accounts: Account[] = await accountService.getAccountsByUserInfo(userInfo)
        res.send({ accounts, partners })
    } catch (err) {
        logger.error('Failed to get accounts ' + err)
        res.status(500).send({ err: 'Failed to get accounts' })
    }
}

module.exports = {
    getAccounts,
}
