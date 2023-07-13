import { setupDbAndPopulate } from "./createAndPopulateDb.service"

async function runScript() {
    await setupDbAndPopulate()
    console.log('DB setup script complete successfully')
    process.exit(0)
}

runScript().catch((error) => {
    console.error('Error occurred:', error)
    process.exit(1)
})