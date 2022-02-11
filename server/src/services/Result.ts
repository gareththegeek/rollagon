export interface Result<T> {
    status: number,
    value: T | { message: string }
}
