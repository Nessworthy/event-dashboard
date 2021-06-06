import { Sequelize } from "sequelize";

import { defineEventModel } from './models/Event'

import util from "util";

const setTimeoutPromise = util.promisify(setTimeout)

export async function createDb() {

    const sequelize = new Sequelize( {
        // TODO: Configuration
        host: 'event-storage',
        port: 3306,
        username: 'test_user',
        password: 'test_password',
        database: 'event_storage',
        dialect: 'mysql'
    })

    defineEventModel(sequelize)

    let connected: boolean = false
    while (!connected) {
        try {
            await sequelize.authenticate()

            connected = true
        } catch (error) {
            console.warn(error)
            console.warn('Unable to connect to the DB. Retrying, as it might just be initializing.')
            await setTimeoutPromise(3000)
        }
    }

    return { sequelize }
}

