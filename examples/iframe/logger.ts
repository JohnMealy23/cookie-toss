type LogTypes = 'log' | 'error'

export const logger = (
    shouldLog: boolean,
    logType: LogTypes,
    ...rest: any[]
) => shouldLog && console[logType](...rest)
