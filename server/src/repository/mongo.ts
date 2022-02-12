import { MongoClient, Filter, WithId, Document, Collection, ObjectId } from 'mongodb'
import { IRepository } from './IRepository'

export interface ConnectionConfig {
    connectionString: string
    databaseName: string
    collectionName: string
}

export class Repository implements IRepository {
    private config: ConnectionConfig

    constructor(config: ConnectionConfig) {
        this.config = { ...config }
    }

    private async getClient(): Promise<MongoClient> {
        const { connectionString: mongoUrl } = this.config
        const client = new MongoClient(mongoUrl)

        return new Promise((resolve, reject) => {
            try {
                client.connect((err) => {
                    if (err) {
                        reject(err)
                    }

                    resolve(client)
                })
            } catch (e) {
                reject(e)
            }
        })
    }

    private async execute<T>(
        operation: (collection: Collection) => Promise<T>
    ): Promise<T> {
        const client = await this.getClient()
        try {
            const { databaseName, collectionName } = this.config
            const database = client.db(databaseName)
            const collection = database.collection(collectionName)

            return await operation(collection)
        } finally {
            client.close()
        }
    }

    async getAll<T extends Document>(): Promise<WithId<T>[]> {
        return this.execute(
            async (collection) => collection.find().toArray() as Promise<WithId<T>[]>
        )
    }

    async getById<T extends Document>(id: string): Promise<WithId<T> | null> {
        return this.execute(
            async (collection) => collection.findOne({ id }) as Promise<WithId<T> | null>
        )
    }

    async getOneBy<T extends Document>(filter: Filter<Document>): Promise<WithId<T> | null> {
        return this.execute(
            async (collection) => collection.findOne(filter) as Promise<WithId<T> | null>
        )
    }

    async getManyBy<T extends Document>(filter: Filter<Document>): Promise<WithId<T>[]> {
        return this.execute(
            async (collection) => collection.find(filter).toArray() as Promise<WithId<T>[]>
        )
    }

    async insert<T extends Document>(data: T): Promise<ObjectId | undefined> {
        return await this.execute(async (collection) => {
            const { insertedId } = await collection.insertOne(data)
            return insertedId
        })
    }

    async upsert<T extends Document>(data: T): Promise<ObjectId | undefined> {
        return await this.execute(async (collection) => {
            const existing = await collection.findOne({ id: data['id'] })
            if (!existing) {
                const insertResult = await collection.insertOne(data)
                return insertResult.insertedId
            } else {
                const updateResult = await collection.updateOne({ id: data['id'] }, { $set: data })
                return (updateResult.modifiedCount === 1 || updateResult.matchedCount === 1)
                    ? data['id']
                    : undefined
            }
        })
    }

    async updateNested<T extends Document>(id: string, path: string, data: T | undefined): Promise<boolean> {
        const result = await this.execute(async (collection) =>
            await collection.updateOne({ id }, { '$set': { [path]: data } })
        )
        return result.modifiedCount === 1 || result.matchedCount === 1
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.execute(async (collection) => collection.deleteOne({ id }))
        return result.deletedCount === 1
    }

    async deleteNested(id: string, path: string): Promise<boolean> {
        const result = await this.execute(async (collection) =>
            await collection.updateOne({ id }, { '$unset': { [path]: 1 } })
        )
        return result.modifiedCount === 1
    }
}
