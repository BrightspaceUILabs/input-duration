import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/icons/icon.js';
import '@brightspace-ui/core/components/inputs/input-fieldset.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { LabelledMixin } from '@brightspace-ui/core/mixins/labelled-mixin.js';
import LocalizeMixin from './mixins/localize-mixin';

class InputDurationWrapper extends LabelledMixin(LocalizeMixin(LitElement)) {
	static get properties() {
		return {
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
			.d2l-input-duration-wrapper {
				align-items: center;
				border: solid 1px var(--d2l-color-corundum);
				border-radius: 5px;
				display: inline-flex;
			}
			.d2l-input-duration-wrapper-icon {
				padding: 5px 5px 5px 10px;
			}
			::slotted(*) {
				padding: 5px 5px 5px 0px;
			}
		`;
	}

	constructor() {
		super();

		this.labelHidden = false;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		if (!this.label) {
			console.warn('d2l-labs-input-duration-wrapper component requires label text');
		}
	}

	render() {
		return html`
			<d2l-input-fieldset
				label=${ifDefined(this.label)}
				?label-hidden=${this.labelHidden}
			>
				<span
					class="d2l-input-duration-wrapper"
					@click=${this._handleWrapperClick}
				>
					<d2l-icon class="d2l-input-duration-wrapper-icon" icon="tier1:time"></d2l-icon>
					<slot></slot>
				</span>
			</d2l-input-fieldset>
		`;
	}

	_handleWrapperClick(e) {
		const slotElement = this.shadowRoot.querySelector('slot');

		// If a click event is coming from something other than the slot,
		// find the first slotted element and focus on it.
		// Elements within the slot are expected to trigger their own focus if needed.
		if (!e.composedPath().includes(slotElement)) {
			const slottedElements = slotElement.assignedElements();
			if (slottedElements.length > 0 && slottedElements[0].focus) slottedElements[0].focus();
		}
	}
}
customElements.define('d2l-labs-input-duration-wrapper', InputDurationWrapper);
