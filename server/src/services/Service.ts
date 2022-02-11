import { Result } from './Result'

export interface Service<T> {
    getOne?: (params: any) => Promise<Result<T>>
    getMany?: (params: any) => Promise<Result<T[]>>
    add?: (params: any, entity: T) => Promise<Result<T>>
    remove?: (params: any) => Promise<Result<{}>>
}
