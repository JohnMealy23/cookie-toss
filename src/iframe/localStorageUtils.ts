import { StringifiableRequestData } from '../types'

const msInADay = 1000 * 60 * 60 * 24
const thirtyYears = msInADay * 365.25 * 30

export const setWithExpiry = (
	key: string,
	data: StringifiableRequestData,
	expires: number = thirtyYears
): StringifiableRequestData => {

	const expiry = getMsToLive(expires)

	if (data === undefined) {
		throw new Error(`Request to set ${key} contained no data.`)
	}
	// Package data to save with expiry:
	const item = {
		data,
		expiry
	}
	localStorage.setItem(key, JSON.stringify({ item }))

	return data
}

const getMsToLive = (daysToLive: number): number => {
	// LS can't cache 'infinity', so we'll reduce it to 30 years:
	if (daysToLive === Infinity) {
		daysToLive = thirtyYears
	}
	return Date.now() + (daysToLive * msInADay)
}

export const getWithExpiry = <AppData = StringifiableRequestData>(key: string): AppData | null => {
	const itemStr = localStorage.getItem(key)
	// if the item doesn't exist, return null
	if (!itemStr) {
		return null
	}
	const { item: { data, expiry } } = JSON.parse(itemStr)
	// compare the expiry time of the item with the current time
	if (Date.now() > expiry) {
		// If the item is expired, delete the item from storage
		// and return null
		localStorage.removeItem(key)
		return null
	}
	return data
}
