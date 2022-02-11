export interface ServiceError {
    status: number
    value: { message: string }
}

export type Result<T> = {
    status: 200
    value: T
} | ServiceError

export const isError = <T>(result: Result<T>): result is ServiceError => result.status !== 200
