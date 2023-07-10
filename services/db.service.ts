// Internal Dependencies
const logger = require('../services/logger.service')

// External Dependencies
import * as dotenv from 'dotenv'
import { Connection, RowDataPacket, createConnection as createMySQLConnection } from 'mysql2/promise'
// import { Account } from '../Interfaces/account.interface'
import { PartnerUser } from '../Interfaces/user.interface'
import { hashPassword } from '../api/auth/auth.service'

dotenv.config()

async function _connectToDatabase() {
    try {
        const db: Connection = await createMySQLConnection({
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

// ----------------Create DB, Tables & demo data functions----------------------------------- //

async function _createDatabase() {
    try {
        const connection = await createMySQLConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PWD,
        })

        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`)
        logger.info(`Database ${process.env.DB_NAME} created successfully!`)

        connection.end()
    } catch (error) {
        logger.error('Failed to create the database', error)
        throw error
    }
}

async function _createTables() {
    try {
        const connection = await _connectToDatabase()

        // Create 'partners' table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS partners (
        _id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) COLLATE utf8_unicode_ci DEFAULT NULL,
        PRIMARY KEY (_id)
      )
    `)
        logger.info('Table partners created successfully!')

        // Create 'partner_users' table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS partner_users (
        _id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
        partner_id INT(11) UNSIGNED NOT NULL,
        email VARCHAR(255) COLLATE utf8_unicode_ci NOT NULL,
        password VARCHAR(255) COLLATE utf8_unicode_ci NOT NULL,
        PRIMARY KEY (_id),
        KEY fk_partner_user_partner_id (partner_id),
        CONSTRAINT fk_partner_user_partner_id FOREIGN KEY (partner_id) REFERENCES partners (_id) ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `)
        logger.info('Table partner_users created successfully!')

        // Create 'account' table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS account (
        _id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
        url_code TEXT COLLATE utf8_unicode_ci,
        name VARCHAR(255) COLLATE utf8_unicode_ci DEFAULT NULL,
        partner_id INT(11) UNSIGNED DEFAULT NULL,
        PRIMARY KEY (_id),
        KEY partner_id (partner_id),
        CONSTRAINT account_ibfk_1 FOREIGN KEY (partner_id) REFERENCES partners (_id) ON DELETE SET NULL ON UPDATE NO ACTION
      )
    `)
        logger.info('Table account created successfully!')

        connection.end()
    } catch (error) {
        logger.error('Failed to create the tables', error)
        throw error
    }
}

async function _createDemoData() {
    try {
        const connection = await _connectToDatabase();

        // Insert demo data into the partners table
        //     await connection.query(`
        //     INSERT INTO partners (name)
        //     VALUES
        //       ('Partner A'),
        //       ('Partner B'),
        //       ('Partner C'),
        //       ('Partner D')
        //   `);
        logger.info('Demo data inserted into the partners table!');

        // Get the generated partner IDs
        const [partnerRows] = await connection.query('SELECT _id FROM partners');
        const partners = partnerRows as { _id: number }[];

        // Insert demo data into the partner_users table
        const partnerUsersData: PartnerUser[] = [
            { _id: '', partner_id: partners[0]._id.toString(), email: 'user1@example.com', password: await hashPassword('pass123') },
            { _id: '', partner_id: partners[1]._id.toString(), email: 'user1@example.com', password: await hashPassword('pass123') },
            { _id: '', partner_id: partners[2]._id.toString(), email: 'user2@example.com', password: await hashPassword('pass123') },
            { _id: '', partner_id: partners[3]._id.toString(), email: 'user3@example.com', password: await hashPassword('pass123') }
        ];
        await connection.query('INSERT INTO partner_users (partner_id, email, password) VALUES ?', [partnerUsersData.map(user => [user.partner_id, user.email, user.password])]);
        logger.info('Demo data inserted into the partner_users table!');

        // Insert demo data into the accounts table
        // const accountsData: Account[] = [];
        // const urlCode = 'https://www.google.com/';
        // for (let i = 1; i <= 10; i++) {
        //     const partnerId = partners[(i - 1) % partners.length]._id.toString();
        //     const account: Account = {
        //         _id: '',
        //         url_code: urlCode,
        //         name: `Account ${i}`,
        //         partner_id: partnerId
        //     };
        //     accountsData.push(account);
        // }
        // await connection.query('INSERT INTO account (url_code, name, partner_id) VALUES ?', [accountsData.map(account => [account.url_code, account.name, account.partner_id])]);
        // logger.info('Demo data inserted into the account table!');

        connection.end();
    } catch (error) {
        logger.error('Failed to insert the demo data', error);
        throw error;
    }
}


// async function createDatabaseTablesDemoData() {
//     let connection;
//     try {
//       // Create the database
//       await _createDatabase();

//       // Connect to the database and create tables
//       connection = await _connectToDatabase();
//       await _createTables();

//       // Insert demo data into tables
//       await _createDemoData();

//       connection.end();
//     } catch (error) {
//       logger.error('Failed to create the database, tables, and demo data', error);
//       if (connection) {
//         connection.end();
//       }
//       throw error;
//     }
//   }

export {
    query,
}
