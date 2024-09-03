import { test } from '@playwright/test';
import { BatchInfoLocal } from '../src/batch-info';
import { BatchInfo, Configuration, EyesRunner, VisualGridRunner, BrowserType, DeviceName, ScreenOrientation, Eyes, Target, ClassicRunner } from '@applitools/eyes-playwright';
import { generateUUID } from '../src/utils/uuid';

export let Batch: BatchInfo;
export let Config: Configuration;
export let Runner: EyesRunner;
export let eyes: Eyes;

test.beforeAll(async() => {

    // Configure Applitools SDK to run on the Ultrafast Grid
    Runner = new VisualGridRunner({ testConcurrency: 5 });
    //Batch = new BatchInfo({name: BatchInfoLocal.name});

    Config = new Configuration();
    //Config.setBatch(Batch);

    Config.addBrowsers(
        { name: BrowserType.CHROME, width: 1600, height: 600 }
    )
    eyes = new Eyes(Runner, Config);
});

test.describe('Test to demonstrate ignore color & text during comparision', () => {
    //let eyes: Eyes;
    test.beforeEach(async ({ page }) => {
        await eyes.open(page, BatchInfoLocal.appName, `Test to demonstrate ignore color & text during comparision`, { width: 1500, height: 600 });
    });
    

    test('Ignore color differences', async ({ page }) => {
        await page.goto('https://coinmarketcap.com/');
        await page.waitForTimeout(3000);

        //await page.locator('span.icon-Moon').click();

        // Full Page - Visual AI Assertion
        await eyes.check('Ignore color differences', Target.region('div.sc-7927fd90-0.ghpzpe')
        .ignoreColors()
        
        );
    });

    test.afterEach(async () => {
        // End Applitools Visual AI Test
        await eyes.closeAsync();
    });
});

test.afterAll(async() => {
    // Wait for Ultrast Grid Renders to finish and gather results
    const results = await Runner.getAllTestResults();
    console.log('Visual test results', results.getAllResults());
});