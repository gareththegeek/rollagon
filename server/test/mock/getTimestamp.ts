jest.mock('../../src/factories/getTimestamp')
import * as factory from '../../src/factories/getTimestamp'

export const mockGetTimestamp = (): jest.SpyInstance<string, []> => jest.spyOn(factory, 'getTimestamp')
