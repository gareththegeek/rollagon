import { IRepository } from './IRepository'
import { Repository } from './mongo'

const CONNECTION_STRING = process.env['COSMOS_CONNECTION_STRING'] ?? ''
const DATABASE_NAME = process.env['COSMOS_DATABASE_NAME'] ?? ''

const isDefined = (value: string | undefined): value is string => value !== undefined

export const getRepository = (collectionName: string): IRepository => {
    if (!isDefined(CONNECTION_STRING)) {
        throw new Error('Server is incorrectly configured: missing connection string')
    }

    return new Repository({
        connectionString: CONNECTION_STRING ?? '',
        databaseName: DATABASE_NAME,
        collectionName
    })
}
