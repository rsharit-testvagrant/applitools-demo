import { test } from '@playwright/test';
import { ApplitoolsConfig, TVBatchInfo } from '../src/batch-info';
import { BatchInfo, Configuration, EyesRunner, VisualGridRunner, BrowserType, DeviceName, ScreenOrientation, Eyes, Target, ClassicRunner } from '@applitools/eyes-playwright';
import { generateUUID } from '../src/utils/uuid';

export let Batch: BatchInfo;
export let Config: Configuration;
export let Runner: EyesRunner;
export let eyes: Eyes;

test.beforeAll(async() => {
    process.env.APPLITOOLS_API_KEY = ApplitoolsConfig.APPLITOOLS_API_KEY;
    process.env.APPLITOOLS_SERVER_URL = ApplitoolsConfig.APPLITOOLS_SERVER_URL;
    
    Runner = new ClassicRunner();
    Batch = new BatchInfo({name: TVBatchInfo.name});
    Config = new Configuration();
    Config.setBatch(Batch)
    eyes = new Eyes(Runner, Config);
});
/**
 * https://applitools.com/tutorials/guides/advanced-use-cases/match-levels-&-regions#ignore-regions
 * Ignore regions should only be used as a last resort and most cases can be handled by Layout regions or Ignore Colors regions.
 * or as per your use case
 */
test.describe('This test is to demonstrate to ignore a particular region considering '+
    'the comparison with baseline.', () => {
    test.beforeEach(async ({ page }) => {
        await eyes.open(page, TVBatchInfo.appName, 'Test to demonstrate ignore region');
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