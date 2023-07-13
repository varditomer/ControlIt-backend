// Internal Dependencies
import { Account } from "../../Interfaces/account.interface"
import { UserInfo } from "../../Interfaces/user.interface"
import { query } from "../../services/db.service"

// External Dependencies
const logger = require('../../services/logger.service')

async function getAccountsByUserInfo(userInfo: UserInfo): Promise<Account[]> {
  try {
    const partnerIds = userInfo.partners.map(partner=>partner._id)
    const partnerIdsStr = partnerIds.join(',') // Convert partner IDs array to comma-separated string
    const queryString = `SELECT * FROM account WHERE partner_id IN (${partnerIdsStr})`
    const accounts = await query(queryString) as Account[]
    return accounts
  } catch (err) {
    logger.error('Failed to get accounts by user info', err)
    throw err
  }
}


module.exports = {
  getAccountsByUserInfo,
}
