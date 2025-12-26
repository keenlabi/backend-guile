import {
	InvalidEmailError,
	InvalidEmailFormatError,
} from '../errors/email.errors';

export class Email {
	private readonly _value: string;

	constructor(value: string) {
		this.validate(value);
		this._value = value.toLowerCase().trim();
	}

	get value(): string {
		return this._value;
	}

	private validate(email: string): void {
		if (!email) {
			throw new InvalidEmailError();
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			throw new InvalidEmailFormatError();
		}
	}

	equals(other: Email): boolean {
		return this._value === other._value;
	}
}
