import moment from 'moment'

export const getTimestamp = () => moment().utc().toISOString()
