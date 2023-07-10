// Internal Dependencies
const accountService = require('./account.service')
const logger = require('../../services/logger.service')
import { Account } from '../../Interfaces/account.interface'

// External Dependencies
import { Request, Response } from 'express'

async function getAccounts(req: Request, res: Response) {
    try {
        const accounts: Account[] = await accountService.query()
        res.send(accounts)
    } catch (err) {
        logger.error('Failed to get accounts ' + err)
        res.status(500).send({ err: 'Failed to get accounts' })
    }
}

async function getAccount(req: Request, res: Response) {
    try {
        const accountId: string = req.params.id
        const account: Account = await accountService.getById(accountId)
        res.send(account)
    } catch (err) {
        logger.error('Failed to get account ' + err)
        res.status(500).send({ err: 'Failed to get account' })
    }
}

async function addAccount(req: Request, res: Response) {
    try {
        const accountToAdd: Account = req.body
        const addedAccount: Account = await accountService.addAccount(accountToAdd)

        logger.info('Account added: ', addedAccount._id)

        res.send(addedAccount)
    } catch (err) {
        logger.error('Failed to add account ' + err)
        res.status(500).send({ err: 'Failed to add account' })
    }
}

async function updateAccount(req: Request, res: Response) {
    try {
        const accountToUpdate: Account = req.body
        const updatedAccount: Account = await accountService.updateAccount(accountToUpdate)

        logger.info('Account updated: ', updatedAccount._id)

        res.send(updatedAccount)
    } catch (err) {
        logger.error('Failed to update account ' + err)
        res.status(500).send({ err: 'Failed to update account' })
    }
}

async function deleteAccount(req: Request, res: Response) {
    try {
        const accountId: string = req.params.id
        await accountService.remove(accountId)

        logger.info('Account removed: ', accountId)

        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete account ' + err)
        res.status(500).send({ err: 'Failed to delete account' })
    }
}

async function reaccount(req: Request, res: Response) {
    try {
        const newReaccount: Reaccount = req.body
        const reaccount: Reaccount = await accountService.reaccount(newReaccount)

        logger.info('Reaccount added: ', newReaccount._id)

        res.send(reaccount)
    } catch (err) {
        logger.error('Failed to update account ' + err)
        res.status(500).send({ err: 'Failed to update account' })
    }
}

async function getHashtags(req: Request, res: Response) {
    try {
        const hashtags: hashtags = await accountService.queryHashtags()
        res.send(hashtags)
    } catch (err) {
        logger.error('Failed to get accounts ' + err)
        res.status(500).send({ err: 'Failed to get accounts' })
    }
}

async function updateHashtags(req: Request, res: Response) {
    try {
        const hashtags: hashtags = req.body
        const updatedHashtags: hashtags = await accountService.updateHashtags(hashtags)
        res.send(updatedHashtags)
    } catch (err) {
        logger.error('Failed to update hashtags ' + err)
        res.status(500).send({ err: 'Failed to update hashtags' })
    }
}

module.exports = {
    getAccounts,
    getAccount,
    addAccount,
    updateAccount,
    deleteAccount,
    reaccount,
    getHashtags,
    updateHashtags,
}
