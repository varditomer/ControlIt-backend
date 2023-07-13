import { createDatabaseTablesDemoData } from "./createAndPopulateDb"

async function runScript() {
    console.log('Code works')
    await createDatabaseTablesDemoData()
    console.log('Script execution complete')
    process.exit(0)
}

runScript().catch((error) => {
    console.error('Error occurred:', error)
    process.exit(1)
})