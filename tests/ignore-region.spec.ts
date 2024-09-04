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

test.describe('This test is to demonstrate the ignore a particular region considering '+
    'the comparison with baseline.', () => {
    test.beforeEach(async ({ page }) => {
        await eyes.open(page, BatchInfoLocal.appName, 'Test to demonstrate ignore region');
    });
    

    // AT link match - https://eyes.applitools.com/app/test-results/00000251676870099467/?accountId=l9D0456laE6IwyZgopBlJg__
    // AT link mismatch - https://eyes.applitools.com/app/test-results/00000251676869575838/?accountId=l9D0456laE6IwyZgopBlJg__
    test('Test to demonstrate ignore region', async ({ page }) => {
        await page.goto('https://coinmarketcap.com/currencies/sui/');
        await page.waitForTimeout(1000);

        // asking eyes to ignore the region while comparing with the baseline
        await eyes.check('Test to demonstrate ignore region', Target.region('[data-test="section-chart"]')
        .ignoreRegion('rect.highcharts-background') 
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