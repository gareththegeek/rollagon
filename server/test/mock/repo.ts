jest.mock('../../src/repository/factory')
import { Document, Filter, ObjectId, WithId } from 'mongodb'
import * as factory from '../../src/repository/factory'
import { IRepository } from '../../src/repository/IRepository'

export interface MockRepository extends IRepository {
    getAll: jest.Mock<Promise<WithId<any>[]>, []>
    getById: jest.Mock<Promise<WithId<any> | null>, [string]>
    getOneBy: jest.Mock<Promise<WithId<any> | null>, [Filter<Document>]>
    getManyBy: jest.Mock<Promise<WithId<any>[]>, [Filter<Document>]>
    insert: jest.Mock<Promise<ObjectId | undefined>, [any]>
    updateNested: jest.Mock<Promise<boolean>, [string, string, any]>
    upsert: jest.Mock<Promise<ObjectId | undefined>, [any]>
    delete: jest.Mock<Promise<boolean>, [string]>
    deleteNested: jest.Mock<Promise<boolean>, [string, string]>
}

export const buildRepo = (): MockRepository =>
({
    getAll: jest.fn().mockResolvedValue([]),
    getById: jest.fn().mockResolvedValue(undefined),
    getOneBy: jest.fn().mockResolvedValue(undefined),
    getManyBy: jest.fn().mockResolvedValue([]),
    insert: jest.fn().mockResolvedValue(undefined),
    updateNested: jest.fn().mockResolvedValue(false),
    upsert: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue(undefined),
    deleteNested: jest.fn().mockResolvedValue(false)
} as MockRepository)

export const mockRepo = (): MockRepository => {
    const result = buildRepo()
    jest.spyOn(factory, 'getRepository').mockReturnValue(result)
    return result
}

export const mockRepos = (collectionNames: string[]): Record<string, MockRepository> => {
    const repositories = collectionNames.reduce((a, n) => {
        a[n] = buildRepo();
        return a
    }, {} as Record<string, MockRepository>)
    jest.spyOn(factory, 'getRepository').mockImplementation(collectionName => repositories[collectionName]!)
    return repositories
}

// type MockRepoCallResult<T extends object> = T | T[] | undefined

// export const mockRepoCall = <T extends object>(fn: jest.Mock, filters: string[], match: MockRepoCallResult<T>, nomatch: MockRepoCallResult<T>): void => {
//     fn.mockImplementation((f: string): Promise<MockRepoCallResult<T>> => {
//         for (const filter of filters) {
//             if (!f.includes(filter)) {
//                 return Promise.resolve(nomatch)
//             }
//         }

//         return Promise.resolve(match)
//     })
// }
