export const getRandom = jest.fn()
jest.mock('../../src/factories/getRandom', () => ({
    getRandom
}))
//import * as factory from '../../src/factories/getRandom'

//export const mockGetRandom = (): jest.SpyInstance<number, []> =>  jest.spyOn(factory, 'getRandom')
