export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const timeout = Number(import.meta.env.VITE_API_TIMEOUT)

export const API_TIMEOUT = Number.isFinite(timeout) && timeout > 0 ? timeout : 10000

export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false'
