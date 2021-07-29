import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-labs-input-duration', () => {

	const visualDiff = new VisualDiff('input-duration', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/test/input-duration.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
	});

	after(async() => await browser.close());

	[
		'basic',
		'disabled',
		'error',
		'label-hidden',
		'all-units',
		'all-units-all-values'
	].forEach((test) => {
		it(`[${test}] passes visual-diff comparison`, async function() {
			const rect = await visualDiff.getRect(page, `#${test}`);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	it('[basic focus] passes visual-diff comparison', async function() {
		const rect = await visualDiff.getRect(page, '#basic');
		const elem = await page.$('#basic');
		const elemBounds = await elem.boundingBox();
		await page.mouse.click(elemBounds.x + 10, elemBounds.y + elemBounds.height - 10);
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});
});
