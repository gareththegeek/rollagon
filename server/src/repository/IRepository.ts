import { Filter, WithId, Document, ObjectId } from 'mongodb'

export interface IRepository {
    getAll<T extends Document>(): Promise<WithId<T>[]>
    getById<T extends Document>(id: string): Promise<WithId<T> | null>
    getOneBy<T extends Document>(filter: Filter<Document>): Promise<WithId<T> | null>
    getManyBy<T extends Document>(filter: Filter<Document>): Promise<WithId<T>[]>
    insert<T extends Document>(data: T): Promise<ObjectId | undefined>
    updateNested<T extends Document>(id: string, path: string, data: T | undefined): Promise<boolean>
    upsert<T extends Document>(data: T): Promise<ObjectId | undefined>
    delete(id: string): Promise<boolean>
    deleteNested(id: string, path: string): Promise<boolean>
}
