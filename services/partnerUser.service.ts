// Internal Dependencies
import { PartnerUser } from "../Interfaces/user.interface"
const logger = require('./logger.service')
import { query } from './db.service'

async function getByEmail(email: string) {
  try {
    const queryString = `SELECT * FROM partner_users WHERE email='${email}'`
    const partnerUsers = await query(queryString) as PartnerUser[]
    return partnerUsers
  } catch (err) {
    logger.error(`Cannot find partner_user by email: ${email}`, err)
    throw err
  }
}

export {
  getByEmail
}

module.exports = {
    getByEmail,
}