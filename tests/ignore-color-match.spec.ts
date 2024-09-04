import { test } from '@playwright/test';
import { BatchInfoLocal } from '../src/batch-info';
import { BatchInfo, Configuration, EyesRunner, VisualGridRunner, BrowserType, DeviceName, ScreenOrientation, Eyes, Target, ClassicRunner } from '@applitools/eyes-playwright';
import { generateUUID } from '../src/utils/uuid';

export let Batch: BatchInfo;
export let Config: Configuration;
export let Runner: EyesRunner;
export let eyes: Eyes;

test.beforeAll(async() => {

    Runner = new ClassicRunner();
    Config = new Configuration();
    eyes = new Eyes(Runner, Config);
});

/**
 * https://applitools.com/docs/api-ref/sdk-api/playwright/javascript/matchlevel
 */
test.describe('This test is to demonstrate ignore color differences.', () => {

    test.beforeEach(async ({ page }) => {
        await eyes.open(page, BatchInfoLocal.appName, `Test to demonstrate ignore color`);
    });
    

    // applitool link - https://eyes.applitools.com/app/test-results/00000251676950404342/?accountId=l9D0456laE6IwyZgopBlJg__
    test('Ignore color match test', async ({ page }) => {
        await page.goto('https://coinmarketcap.com/');
        await page.waitForTimeout(3000);

        // asking eyes to ignore the color differences
        await eyes.check('Test to demonstrate ignore color', Target.region('div.sc-a27793cf-2.eNKAqm')
        .ignoreColors()
        
        );
    });

    test.afterEach(async () => {
        await eyes.closeAsync();
    });
});

test.afterAll(async() => {
    const results = await Runner.getAllTestResults();
    console.log('Visual test results', results.getAllResults());
});