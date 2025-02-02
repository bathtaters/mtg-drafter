import { LOG_DELIM } from "assets/constants"

export const getBanName = (logData: string | null) => logData && logData.split(LOG_DELIM, 2)[1] || null

export const getBanSession = (logData: string | null) => (logData && logData.split(LOG_DELIM, 2)[0]) || undefined
