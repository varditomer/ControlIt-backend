// Internal Dependencies
import { Account } from "../../Interfaces/account.interface"

// External Dependencies
const logger = require('../../services/logger.service')
const dbService = require('../../services/database.service')
const ObjectId = require('mongodb').ObjectId

async function query() {
    logger.debug(`account.service - getting accounts`)
    try {
        const accountCollection = await dbService.getCollection('account')

        let accounts: Account[] = await accountCollection.find().sort({ _id: -1 }).toArray()
        accounts = accounts.map((account: Account) => {
            account.createdAt = new ObjectId(account._id).getTimestamp()
            return account
        })
        return accounts
    } catch (err) {
        logger.error(`Cannot find accounts `, err)
        throw err
    }
}

async function getById(accountId: string) {
    try {
        const accountCollection = await dbService.getCollection('account')

        accountId = new ObjectId(accountId)
        const account: Account = await accountCollection.findOne({ _id: accountId })

        account.createdAt = new ObjectId(account._id).getTimestamp()
        return account
    } catch (err) {
        logger.error(`Cannot find user by id: ${accountId}`, err)
        throw err
    }
}

async function addAccount(accountToAdd: Account) {
    try {
        const accountCollection = await dbService.getCollection('account')
        const mongoRes: any = await accountCollection.insertOne(accountToAdd)

        accountToAdd._id = mongoRes.insertedId.toString()
        accountToAdd.createdAt = new ObjectId(accountToAdd._id).getTimestamp()
        return accountToAdd
    } catch (err) {
        logger.error(`Cannot add account: ${accountToAdd._id}`, err)
        throw err
    }

}

async function updateAccount(accountToUpdate: Account) {
    try {
        // peek only updatable properties
        const accountToSave = {
            _id: new ObjectId(accountToUpdate._id), // needed for the returned obj
            replies: accountToUpdate.replies,
            reaccountedBy: accountToUpdate.reaccountedBy,
            savedBy: accountToUpdate.savedBy,
            likes: accountToUpdate.likes
        }

        const accountCollection = await dbService.getCollection('account')
        await accountCollection.updateOne({ _id: accountToSave._id }, { $set: accountToSave })

        return accountToUpdate
    } catch (err) {
        logger.error(`Cannot update account: ${accountToUpdate._id}`, err)
        throw err
    }
}

async function remove(accountId: string) {
    try {
        const accountCollection = await dbService.getCollection('account')

        accountId = new ObjectId(accountId)
        await accountCollection.deleteOne({ _id: (accountId) })

    } catch (err) {
        logger.error(`Cannot remove account: ${accountId}`, err)
        throw err
    }
}

async function reaccount(newReaccount: Reaccount) {
    try {
        const accountCollection = await dbService.getCollection('account')
        const mongoRes: any = await accountCollection.insertOne(newReaccount)

        newReaccount._id = mongoRes.insertedId.toString()
        newReaccount.createdAt = new ObjectId(newReaccount._id).getTimestamp()
        const addedReaccount = JSON.parse(JSON.stringify(newReaccount))
        return addedReaccount
    } catch (err) {
        logger.error(`Cannot reaccount account: ${newReaccount.reaccountedAccountId}`, err)
        throw err
    }

}

async function queryHashtags() {
    logger.debug(`account.service - getting hashtags`)
    try {
        const hashtagCollection = await dbService.getCollection('hashtag')
        const hashtagsDocuments: [hashtags] = await hashtagCollection.find().toArray()

        let hashtagsToReturn: hashtags
        if (hashtagsDocuments.length) {
            hashtagsToReturn = {
                _id: hashtagsDocuments[0]._id,
                hashtagsList: hashtagsDocuments[0].hashtagsList || [],
            }
        } else {
            const newHashtags = {
                hashtagsList: []
            }
            await hashtagCollection.insertOne(newHashtags)
            const newHashtagsDocuments: [hashtags] = await hashtagCollection.find().toArray()

            hashtagsToReturn = {
                _id: newHashtagsDocuments[0]._id,
                hashtagsList: newHashtagsDocuments[0].hashtagsList,
            }
        }
        return hashtagsToReturn
    } catch (err) {
        logger.error(`Cannot find hashtags `, err)
        throw err
    }
}

async function updateHashtags(hashtags: hashtags) {
    logger.debug(`account.service - updating hashtags`)
    try {
        // peek only updatable properties
        const hashtagsToSave = {
            _id: new ObjectId(hashtags._id), // needed for the returned obj
            hashtagsList: hashtags.hashtagsList
        }

        const hashtagCollection = await dbService.getCollection('hashtag')
        await hashtagCollection.updateOne({ _id: hashtagsToSave._id }, { $set: hashtagsToSave })

        return hashtagsToSave
    } catch (err) {
        logger.error(`Cannot update hashtags: ${hashtags._id}`, err)
        throw err
    }
}

module.exports = {
    query,
    getById,
    addAccount,
    updateAccount,
    remove,
    reaccount,
    queryHashtags,
    updateHashtags,
}
