import { test } from '@playwright/test';
import { BatchInfoLocal } from '../src/batch-info';
import { BatchInfo, Configuration, EyesRunner, VisualGridRunner, ClassicRunner, BrowserType, DeviceName, ScreenOrientation, Eyes, Target } from '@applitools/eyes-playwright';

export let Batch: BatchInfo;
export let visualGridConfig: Configuration;
export let classicConfig: Configuration;
export let visualGridRunner: EyesRunner;
export let classicRunner: EyesRunner;
export let eyes: Eyes;

test.beforeAll(async() => {
    // Initialize runners
    visualGridRunner = new VisualGridRunner({ testConcurrency: 5 });
    classicRunner = new ClassicRunner();

    // Set up the batch info
    Batch = new BatchInfo({ name: BatchInfoLocal.name });

    // Configure for Visual Grid
    visualGridConfig = new Configuration();
    visualGridConfig.setBatch(Batch);
    visualGridConfig.addBrowsers(
        { name: BrowserType.CHROME, width: 1600, height: 600 },
        { name: BrowserType.FIREFOX, width: 1600, height: 1200 }
        // Add more configurations as needed
    );

    // Configure for Classic Runner
    classicConfig = new Configuration();
    classicConfig.setBatch(Batch);
    classicConfig.setViewportSize({ width: 1200, height: 800 });

    // You can define other configurations for classicConfig if necessary
});

test.describe('A few home page tests', () => {

    test.beforeEach(async ({ page }) => {
        // Decide which runner to use for the test
        const useVisualGrid = true; // Set this flag based on your criteria

        if (useVisualGrid) {
            eyes = new Eyes(visualGridRunner, visualGridConfig);
        } else {
            eyes = new Eyes(classicRunner, classicConfig);
        }

        // Start Applitools Visual AI Test
        await eyes.open(page, BatchInfoLocal.appName, `test`, { width: 1500, height: 600 });
    });

    test.skip('Toggle highlight button', async ({ page }) => {
        await page.goto('https://coinmarketcap.com/');
        await page.waitForTimeout(3000);

        // Full Page - Visual AI Assertion
        await eyes.check('Toggle button', Target.region('div.sc-7f53b353-0.sc-7f53b353-2.fHwZkx.cfyfuc')
            .ignoreColors()
            .floatingRegion('span.sc-cd4bdda8-0.iwtfqB.switch-button')
        );
    });

    test('Theme change to test color change', async ({ page }) => {
        await page.goto('https://coinmarketcap.com/');
        await page.waitForTimeout(3000);

        await page.locator('span.icon-Moon').click();

        // Full Page - Visual AI Assertion
        await eyes.check('Theme change', Target.region('div.sc-7927fd90-0.ghpzpe')
            .ignoreColors().ignoreRegion('div.sc-7927fd90-0.ghpzpe>button')
        );
    });

    test.afterEach(async () => {
        // End Applitools Visual AI Test
        await eyes.close();
    });
});

test.afterAll(async() => {
    // Wait for both runners to finish and gather results
    const visualResults = await visualGridRunner.getAllTestResults();
    console.log('Visual Grid test results', visualResults.getAllResults());

    const classicResults = await classicRunner.getAllTestResults();
    console.log('Classic test results', classicResults.getAllResults());
});
