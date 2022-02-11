import { Filter, WithId, Document } from 'mongodb'

export interface IRepository {
    getAll<T extends Document>(): Promise<WithId<T>[]>
    getById<T extends Document>(id: string): Promise<WithId<T> | null>
    getOneBy<T extends Document>(filter: Filter<Document>): Promise<WithId<T> | null>
    getManyBy<T extends Document>(filter: Filter<Document>): Promise<WithId<T>[]>
    insert<T extends Document>(data: T): Promise<string | undefined>
    upsert<T extends Document>(data: T): Promise<void>
    delete(id: string): Promise<void>
}
