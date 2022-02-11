import { ObjectId, MongoClient, Filter, WithId, Document, Collection } from 'mongodb'
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
            async (collection) => collection.findOne({ id: new ObjectId(id) }) as Promise<WithId<T> | null>
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

    async insert<T extends Document>(data: T): Promise<string | undefined> {
        return await this.execute(async (collection) => {
            const { insertedId } = await collection.insertOne(data)
            return insertedId?.toString()
        })
    }

    async upsert<T extends Document>(data: T): Promise<void> {
        await this.execute(async (collection) => {
            const existing = await collection.findOne({ id: data['id'] })
            if (!existing) {
                await collection.insertOne(data)
            } else {
                await collection.updateOne({ id: data['id'] }, { $set: data })
            }
        })
    }

    async delete(id: string): Promise<void> {
        await this.execute(async (collection) => collection.deleteOne({ id }))
    }
}
