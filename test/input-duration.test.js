import '../src/input-duration.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

const fixtures = {
	basic: html`
		<d2l-labs-input-duration
			label="Duration"
			units="hours:minutes"
		></d2l-labs-input-duration>
	`,
	basicDisabled: html`
		<d2l-labs-input-duration
			label="Duration"
			units="hours:minutes"
			disabled
		></d2l-labs-input-duration>
	`,
	allUnits: html`
		<d2l-labs-input-duration
			label="Duration"
			units="weeks:days:hours:minutes:seconds"
		></d2l-labs-input-duration>
	`,
	allUnitsDisabled: html`
		<d2l-labs-input-duration
			label="Duration"
			units="weeks:days:hours:minutes:seconds"
			disabled
		></d2l-labs-input-duration>
	`,
	allUnitsAllValues: html`
		<d2l-labs-input-duration
			label="Duration"
			units="weeks:days:hours:minutes:seconds"
			largest-unit-max="999"
			weeks="999"
			days="7"
			hours="23"
			minutes="59"
			seconds="59"
		></d2l-labs-input-duration>
	`
};

describe('InputDuration', () => {

	describe('accessibility', () => {
		Object.keys(fixtures).forEach((fixtureName) => {
			it(`[${fixtureName}] should pass all aXe tests`, async() => {
				const el = await fixture(fixtures[fixtureName]);
				await expect(el).to.be.accessible();
			});
		});

		it('[basic focus] should pass all aXe tests', async() => {
			const el = await fixture(fixtures.basic);
			setTimeout(() => el.shadowRoot.querySelector('d2l-labs-input-duration-unit').focus());
			await oneEvent(el, 'focus');
			await expect(el).to.be.accessible();
		});
	});

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-labs-input-duration');
		});
	});

});
