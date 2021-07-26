import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/icons/icon.js';
import '@brightspace-ui/core/components/inputs/input-fieldset.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import LocalizeMixin from './mixins/localize-mixin';

class InputDurationWrapper extends LocalizeMixin(LitElement) {
	static get properties() {
		return {
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
			.d2l-input-duration-wrapper {
				align-items: center;
				border: solid 1px var(--d2l-color-corundum);
				border-radius: 5px;
				display: inline-flex;
				padding: 5px 5px 5px 10px;
			}
			::slotted(*) {
				margin-left: 5px;
			}
		`;
	}

	constructor() {
		super();

		this.labelHidden = false;
	}

	render() {
		return html`
			<d2l-input-fieldset
				label=${ifDefined(this.label)}
				?label-hidden=${this.labelHidden}
			>
				<span class="d2l-input-duration-wrapper">
					<d2l-icon icon="tier1:time"></d2l-icon>
					<slot></slot>
				</span>
			</d2l-input-fieldset>
		`;
	}
}
customElements.define('d2l-labs-input-duration-wrapper', InputDurationWrapper);
