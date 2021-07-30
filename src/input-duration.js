import './input-duration-unit.js';
import './input-duration-wrapper.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import LocalizeMixin from './mixins/localize-mixin';
import { repeat } from 'lit-html/directives/repeat.js';

const unitTypes = {
	weeks: 'weeks',
	days: 'days',
	hours: 'hours',
	minutes: 'minutes',
	seconds: 'seconds'
};

const defaultUnitMaximums = {
	[unitTypes.weeks]: 52,
	[unitTypes.days]: 7,
	[unitTypes.hours]: 23,
	[unitTypes.minutes]: 59,
	[unitTypes.seconds]: 59
};

// List of units in order of significance from largest unit to smallest
const unitsSignificanceOrder = [
	unitTypes.weeks,
	unitTypes.days,
	unitTypes.hours,
	unitTypes.minutes,
	unitTypes.seconds
];

class InputDuration extends LocalizeMixin(LitElement) {

	static get properties() {
		return {
			units: {
				converter: (value) => {
					if (typeof value !== 'string') return {};

					const unitsMap = value.split(':').reduce((acc, unit) => {
						acc[unit] = true;
						return acc;
					}, {});

					// Only return valid and in the order of significance
					return unitsSignificanceOrder.reduce((acc, unit) => {
						if (unitsMap[unit]) acc.push(unit);

						return acc;
					}, []);
				}
			},
			weeks: {
				type: Number
			},
			days: {
				type: Number
			},
			hours: {
				type: Number
			},
			minutes: {
				type: Number
			},
			seconds: {
				type: Number
			},
			largestUnitMax: {
				type: Number,
				attribute: 'largest-unit-max'
			},
			disabled: {
				type: Boolean
			},
			error: {
				type: Boolean
			},
			label: {
				type: String
			},
			labelHidden: {
				type: Boolean,
				attribute: 'label-hidden'
			}
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
		`;
	}

	constructor() {
		super();

		this.units = [];
		this.largestUnitMax = 99;
		this.disabled = false;
		this.error = false;
		this.labelHidden = false;
	}

	render() {
		return html`
			<d2l-labs-input-duration-wrapper
				?disabled=${this.disabled}
				?error=${this.error}
				label=${ifDefined(this.label)}
				?label-hidden=${this.labelHidden}
			>
				${repeat(this.units, (unit) => unit, (unit, index) => html`
					<d2l-labs-input-duration-unit
						unit-name-short=${this.localize(`unitNameShort:${unit}`)}
						unit-name-full=${this.localize(`unitNameFull:${unit}`)}
						max=${index === 0 ? this.largestUnitMax : defaultUnitMaximums[unit]}
						value=${ifDefined(this._getUnitValue(unit))}
						?disabled=${this.disabled}
						@change=${this._genUnitChangeHandler(unit)}
						@next=${this._genUnitNextHandler(index)}
						@previous=${this._genUnitPreviousHandler(index)}
					></d2l-labs-input-duration-unit>
				`)}
			</d2l-labs-input-duration-wrapper>
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((oldValue, prop) => {
			if (prop === 'units') {
				this.unitElements = this.shadowRoot.querySelectorAll('d2l-labs-input-duration-unit');
			}
		});
	}

	_dispatchChange() {
		const change = new CustomEvent('change', {
			detail: this.units.reduce((acc, unit) => {
				acc[unit] = this._getUnitValue(unit);
				return acc;
			}, {})
		});
		this.dispatchEvent(change);
	}

	_genUnitChangeHandler(unit) {
		return (e) => {
			this._setUnitValue(unit, e.detail.value);
		};
	}

	_genUnitNextHandler(currUnitIndex) {
		return () => {
			if (currUnitIndex === this.units.length - 1) return; // This is already the last unit

			this.unitElements[currUnitIndex + 1].focus();
		};
	}

	_genUnitPreviousHandler(currUnitIndex) {
		return () => {
			if (currUnitIndex === 0) return; // This is already the first unit

			this.unitElements[currUnitIndex - 1].focus();
		};
	}

	_getUnitValue(unit) {
		switch (unit) {
			case unitTypes.weeks:
				return this.weeks;
			case unitTypes.days:
				return this.days;
			case unitTypes.hours:
				return this.hours;
			case unitTypes.minutes:
				return this.minutes;
			case unitTypes.seconds:
				return this.seconds;
		}
	}

	_setUnitValue(unit, value) {
		switch (unit) {
			case unitTypes.weeks:
				this.weeks = value;
				break;
			case unitTypes.days:
				this.days = value;
				break;
			case unitTypes.hours:
				this.hours = value;
				break;
			case unitTypes.minutes:
				this.minutes = value;
				break;
			case unitTypes.seconds:
				this.seconds = value;
				break;
			default:
				return; // Skip firing of change event
		}
		this._dispatchChange();
	}
}
customElements.define('d2l-labs-input-duration', InputDuration);
