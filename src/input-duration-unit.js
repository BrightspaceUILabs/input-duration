import '@brightspace-ui/core/components/colors/colors.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { classMap } from 'lit-html/directives/class-map.js';
import LocalizeMixin from './mixins/localize-mixin';
import { styleMap } from 'lit-html/directives/style-map.js';

const HORIZONTAL_PADDING = 8;
const VERTICAL_PADDING = 6;
const INPUT_UNIT_SPACING = 5;

function clamp(value, min, max) {
	return Math.min(Math.max(value, min), max);
}

// Counts the number of digits in an integer
// Decimal values are truncated before counting
function getDigitCount(value) {
	const intValue = Math.trunc(value);

	if (intValue === 0) return 1;

	return Math.trunc(Math.log10(Math.abs(intValue))) + 1;
}

class InputDurationUnit extends LocalizeMixin(LitElement) {

	static get properties() {
		return {
			max: {
				type: Number
			},
			min: {
				type: Number
			},
			unitLabel: {
				type: String,
				attribute: 'unit-label'
			},
			value: {
				type: Number
			},
			_unitContainerWidth: { type: Number, attribute: false },
			_focused: { type: Boolean, attribute: false },
			_hovered: { type: Boolean, attribute: false }
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
			.d2l-input-duration-unit {
				background-color: var(--d2l-color-regolith);
				border: none;
				border-radius: 5px;
				caret-color: transparent;
				font-family: inherit;
				font-size: 0.8rem;
				font-weight: bold;
				height: 1rem;
				line-height: 1rem;
				padding: ${VERTICAL_PADDING}px ${HORIZONTAL_PADDING}px;
				text-align: right;
			}
			.d2l-input-duration-unit::placeholder {
				font-weight: bold;
			}
			.d2l-input-duration-unit:focus,
			.d2l-input-duration-unit-focus {
				background-color: var(--d2l-color-celestine);
				color: white;
				outline-style: none;
				outline-width: 0;
			}
			.d2l-input-duration-unit:focus::placeholder,
			.d2l-input-duration-unit-focus::placeholder {
				color: white;
			}
			.d2l-input-duration-unit-wrapper {
				align-items: center;
				display: inline-flex;
				position: relative;
			}
			.d2l-input-duration-unit-label-container {
				position: absolute;
				right: ${HORIZONTAL_PADDING}px;
			}
			.d2l-input-duration-unit-label-container-focus {
				color: white;
			}
		`;
	}

	constructor() {
		super();

		this.max = 99;
		this.min = 0;
		this.unitLabel = null;
		this.value = null;
		this._unitContainerWidth = 0;
		this._focused = false;
	}

	get max() { return this._max; }
	set max(val) {
		const oldMax = this._max;

		let newMax = Math.trunc(val); // Only integers are supported
		newMax = Math.max(newMax, 0); // Negative numbers are not supported
		this._max = newMax;

		this.requestUpdate('max', oldMax);
	}

	get min() { return this._min; }
	set min(val) {
		const oldMin = this._min;

		let newMin = Math.trunc(val); // Only integers are supported
		newMin = Math.max(newMin, 0); // Negative numbers are not supported
		this._min = newMin;

		this.requestUpdate('min', oldMin);
	}

	get value() { return this._value; }
	set value(val) {
		const oldValue = this._value;

		if (!val && val !== 0) {
			this._value = null;
		} else {
			this._value = val;
		}

		if (this._value !== oldValue) {
			this.requestUpdate('value', oldValue);
			this._dispatchChangeEvent(this._value);
		}
	}

	get highestMaxDigitsNumber() {
		return (10 ** this.maxDigits) - 1;
	}

	get maxDigits() {
		return getDigitCount(this.max);
	}

	render() {
		const inputClass = {
			'd2l-input-duration-unit': true,
			'd2l-input-duration-unit-focus': this._focused
		};
		const inputStyles = {
			width: `${this.maxDigits}ch`,
			paddingRight: `${this._unitContainerWidth + HORIZONTAL_PADDING + INPUT_UNIT_SPACING}px`
		};

		const unitLabelContainerClass = {
			'd2l-input-duration-unit-label-container': true,
			'd2l-input-duration-unit-label-container-focus': this._focused
		};

		return html`
			<span class="d2l-input-duration-unit-wrapper">
				<input
					type="text"
					class=${classMap(inputClass)}
					style=${styleMap(inputStyles)}
					placeholder=${'–'.repeat(this.maxDigits)}
					.value=${this.value !== null ? this.value.toString() : ''}
					@beforeinput=${this._handleBeforeInput}
					@blur=${this._handleBlur}
					@focus=${this._handleFocus}
					@keydown=${this._handleKeyDown}
				></input>
				<span class=${classMap(unitLabelContainerClass)}
					@click=${this.focus}
				>${this.unitLabel}</span>
			</span>
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((oldVal, prop) => {
			if (prop === 'unitLabel') {
				this._updateInputLayout();
			}
		});
	}

	focus() {
		const elem = this.shadowRoot.querySelector('input');
		if (elem) elem.focus();
	}

	_clear() {
		this.value = null;
	}

	_decrementValue() {
		const newValue = this.value === null ? 0 : this.value - 1;

		if (newValue >= this.min) {
			this.value = newValue;
		}
	}

	_dispatchChangeEvent(value) {
		const change = new CustomEvent('change', {
			detail: {
				value
			},
			bubbles: false,
			composed: false
		});
		this.dispatchEvent(change);
	}

	_dispatchNextEvent() {
		const next = new CustomEvent('next', {
			bubbles: false,
			composed: false
		});
		this.dispatchEvent(next);
	}

	_dispatchPreviousEvent() {
		const previous = new CustomEvent('previous', {
			bubbles: false,
			composed: false
		});
		this.dispatchEvent(previous);
	}

	_enterNewNumbers(newNums) {
		// Shift the current value by the number of digits the new numbers have (eg. 12 -> 1200)
		let newValue = this.value * (10 ** getDigitCount(newNums));
		// Add the new numbers (e.g. 1200 -> 1234)
		newValue += newNums;
		// Cut off the digits over the max (e.g. 1234 -> 34)
		this.value = newValue % (10 ** this.maxDigits);
	}

	_handleBeforeInput(e) {
		e.preventDefault();

		if (!e.data) return this._clear();

		let num = Number(e.data);

		if (isNaN(num)) return;

		num = clamp(num, 0, this.highestMaxDigitsNumber);

		this._enterNewNumbers(num);
	}

	_handleBlur() {
		this._focused = false;
		if (this.value !== null) {
			this.value = clamp(this.value, this.min, this.max);
		}
	}

	_handleFocus(e) {
		this._focused = true;

		// This prevents the contets of the input from being selected by default when tabbing into it
		e.target.setSelectionRange(0, 0);
	}

	_handleKeyDown(e) {
		switch (e.key) {
			case 'ArrowUp':
				this._incrementValue();
				e.preventDefault();
				break;
			case 'ArrowDown':
				this._decrementValue();
				e.preventDefault();
				break;
			case 'ArrowLeft':
				this._dispatchPreviousEvent();
				e.preventDefault();
				break;
			case 'ArrowRight':
				this._dispatchNextEvent();
				e.preventDefault();
				break;
		}
	}

	_incrementValue() {
		const newValue = (this.value || 0) + 1;

		if (newValue <= this.max) {
			this.value = newValue;
		}
	}

	_updateInputLayout() {
		this._unitContainerWidth = this.shadowRoot.querySelector('.d2l-input-duration-unit-label-container').getBoundingClientRect().width;
	}
}
customElements.define('d2l-labs-input-duration-unit', InputDurationUnit);
