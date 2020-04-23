/**
 * Naively tests if the given string is in the format of YYYY-MM-DD
 * 
 * TODO: Expand if/when needed. Consider switching to Moment or an actual validation library.
 */
export function isValidDateString(dateString: string): boolean {
	return /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/i.test(dateString);
}