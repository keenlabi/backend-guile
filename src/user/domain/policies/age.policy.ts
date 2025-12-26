import { InvalidUserAgeStatusError } from '../errors/user.errors';

export class AgePolicy {
	static isAdult(dob: Date): boolean {
		if (!dob) return false;
		const date = dob instanceof Date ? dob : new Date(dob);
		if (isNaN(date.getTime())) return false;

		const today = new Date();
		let age = today.getFullYear() - date.getFullYear();
		const m = today.getMonth() - date.getMonth();
		if (m < 0 || (m === 0 && today.getDate() < date.getDate())) age--;
		return age >= 18;
	}

	static assertIsAdult(dob: Date): void {
		if (!this.isAdult(dob)) {
			throw new InvalidUserAgeStatusError();
		}
	}
}
