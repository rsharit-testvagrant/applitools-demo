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
 * https://applitools.com/docs/api-ref/sdk-api/playwright/javascript/checksettings#layoutregions-method
 */
test.describe('This test is to demonstrate layout region capability. ' + 
    'This ensures layout functionality within a particular element of the page.', () => {
    test.beforeEach(async ({ page }) => {
        await eyes.open(page, BatchInfoLocal.appName, `Test to demonstrate Layout Region`);
    });
    

    test('Test to demonstrate Layout Region', async ({ page }) => {
        await page.goto('https://coinmarketcap.com/');
        await page.waitForTimeout(10000);

        // asking the eye to check the layout of given region
        await eyes.check('Test to demonstrate Layout Region', Target.window()
        .layoutRegion('div.sc-c50d2aab-9.sc-c50d2aab-12.glmmxK.jpSSgp')
        .layout()
        );
    });

    test.afterEach(async () => {
        await eyes.closeAsync();
    });
});

test.afterAll(async() => {
    // Wait for Ultrast Grid Renders to finish and gather results
    const results = await Runner.getAllTestResults();
    console.log('Visual test results', results.getAllResults());
});