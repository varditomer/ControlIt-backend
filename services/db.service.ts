// Internal Dependencies
const logger = require('../services/logger.service')

// External Dependencies
import * as dotenv from 'dotenv'
import { Connection, RowDataPacket, createConnection } from 'mysql2/promise'

dotenv.config()

async function _connectToDatabase() {
    try {
        const db: Connection = await createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PWD,
            database: process.env.DB_NAME,
        })
        return db
    } catch (err) {
        logger.error('Cannot connect to the database', err)
        throw err
    }
}

async function query(queryString: string): Promise<RowDataPacket[]> {
    try {
        const connection = await _connectToDatabase()
        const [result] = await connection.query(queryString)
        const res = result as RowDataPacket[]
        connection.end()
        return res
    } catch (error) {
        logger.error('Failed to query from MySQL', error)
        throw error
    }
}

export {
    query,
}
