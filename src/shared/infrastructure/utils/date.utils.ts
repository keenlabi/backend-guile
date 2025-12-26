export class DateUtils {
	static addDays(days: number, from: Date = new Date()): Date {
		const result = new Date(from);
		result.setDate(result.getDate() + days);
		return result;
	}

	static addMinutes(minutes: number, from: Date = new Date()): Date {
		const result = new Date(from);
		result.setMinutes(result.getMinutes() + minutes);
		return result;
	}

	static addHours(hours: number, from: Date = new Date()): Date {
		const result = new Date(from);
		result.setHours(result.getHours() + hours);
		return result;
	}

	static addSeconds(seconds: number, from: Date = new Date()): Date {
		const result = new Date(from);
		result.setSeconds(result.getSeconds() + seconds);
		return result;
	}
}
