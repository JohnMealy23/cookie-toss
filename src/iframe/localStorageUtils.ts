import { StringifiableRequestData, InfinityToken } from '../common/types'
import { INFINITY_TOKEN } from '../common/constants'

const msInADay = 1000 * 60 * 60 * 24
const thirtyYears = msInADay * 365.25 * 30

export const setWithExpiry = (
	key: string,
	data: StringifiableRequestData,
	expires: number = thirtyYears
): StringifiableRequestData => {

	// Get milliseconds till expiration:
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

	return getWithExpiry(key)
}

const getMsToLive = (daysToLive: number): number | InfinityToken => {

	// LS can't cache 'infinity', so we'll use a placeholder:
	if (daysToLive === Infinity) {
		return INFINITY_TOKEN
	}

	// Return the unix epoch at which point the data expires:
	return Date.now() + (daysToLive * msInADay)
}

export const getWithExpiry = <AppData = StringifiableRequestData>(key: string): AppData | null => {

	// Retrieve item:
	const itemStr = localStorage.getItem(key)

	// If the item doesn't exist, return null
	if (!itemStr) {
		return null
	}

	// Unpack and deal with Infinity:
	let { item: { data, expiry } } = JSON.parse(itemStr)
	if (expiry === INFINITY_TOKEN) {
		expiry = Infinity
	}

	// Compare the expiry time of the item with the current time:
	if (Date.now() > expiry) {
		// If the item is expired, delete the item from storage
		// and return null:
		localStorage.removeItem(key)
		return null
	}
	return data
}
