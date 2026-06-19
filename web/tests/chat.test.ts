import {
	afterAll,
	afterEach,
	beforeAll,
	beforeEach,
	describe,
	expect,
	it,
} from "vitest";
import { chromium, type Browser, type BrowserContext } from "playwright";

describe("Test the chat", () => {
	let browser: Browser;
	let context: BrowserContext;

	beforeAll(async () => {
		browser = await chromium.launch({ headless: true });
	});

	beforeEach(async () => {
		context = await browser.newContext();
	});

	afterEach(async () => {
		await context.close();
	});

	afterAll(async () => {
		await browser.close();
	});

	it("Website should open", async () => {
		const page = await context.newPage();
		await page.goto("http://localhost");

		const heading = page.locator("h1");
		const isVisible = await heading.isVisible();
		expect(isVisible).toBe(true);
	});

	it("Tab should show number of participants", async () => {
		const pageOne = await context.newPage();
		await pageOne.goto("http://localhost");

		const pageTwo = await context.newPage();
		await pageTwo.goto("http://localhost");

		await pageOne.waitForTimeout(200);

		const participantsText = pageOne.locator(
			"#radix-_r_0_-trigger-participants",
		);
		const text = await participantsText.innerText();
		expect(text).toBe("Participants (2)");
	});

	it("Chat sent from page 1 should be visible on page 2", async () => {
		const pageOne = await context.newPage();
		await pageOne.goto("http://localhost");

		const pageTwo = await context.newPage();
		await pageTwo.goto("http://localhost");

		await pageOne.waitForTimeout(200);

		const textarea = pageOne.locator("#main-textarea");
		if (!(await textarea.isVisible())) {
			console.error("Textarea is not visible");
		}

		const sendButton = pageOne.locator("#send-button");

		await textarea.fill("Hello world!");
		await sendButton.click();

		await pageTwo.waitForTimeout(200);
		const chat = pageTwo.getByText("Hello world!");

		const isVisible = await chat.isVisible();

		expect(isVisible).toBe(true);
	});
});
