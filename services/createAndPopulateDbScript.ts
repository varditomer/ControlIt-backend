import { setupDbAndPopulate } from "./createAndPopulateDb.service"
const logger = require('../services/logger.service')


async function runScript() {
    await setupDbAndPopulate()
    logger.info('DB setup script complete successfully')
    process.exit(0)
}

runScript().catch((error) => {
    console.error('Error occurred:', error)
    process.exit(1)
})