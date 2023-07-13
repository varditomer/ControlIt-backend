// Internal Dependencies
import { PartnerUserExpanded } from "../Interfaces/user.interface"
const logger = require('./logger.service')
import { query } from './db.service'

async function getPartnerUsersExpandedByEmail(email: string) {
  try {
    const queryString = `
    SELECT partner_users.*, partners.name AS partner_name
    FROM partner_users
    JOIN partners ON partner_users.partner_id = partners._id
    WHERE partner_users.email = '${email}'
  `
    const partnerUsers = await query(queryString) as PartnerUserExpanded[]
    return partnerUsers
  } catch (err) {
    logger.error(`Cannot find partner_user by email: ${email}`, err)
    throw err
  }
}

export {
  getPartnerUsersExpandedByEmail
}