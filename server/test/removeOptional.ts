export const removeOptional = <T extends object>(object: T): Partial<T> =>
    JSON.parse(JSON.stringify(object))
