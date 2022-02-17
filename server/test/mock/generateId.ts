jest.mock('../../src/factories/generateId')
import * as factory from '../../src/factories/generateId'

export const mockGenerateId = (): jest.SpyInstance<string, []> => jest.spyOn(factory, 'generateId')
