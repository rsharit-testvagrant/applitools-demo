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
    Config = new Configuration();
    eyes = new Eyes(Runner, Config);
});

    test.describe('Content region A few home page tests', () => {
        test.beforeEach(async ({ page }) => {
            await eyes.open(page, TVBatchInfo.appName, `Test to demonstrate content region`);
        });

/*  https://ultimateqa.com/applitools-ignore-regions-2/
    AT Link Mismatch - https://eyes.applitools.com/app/test-results/00000251676821257211/?accountId=l9D0456laE6IwyZgopBlJg__
*/
    test('Test to demonstrate Content Region', async ({ page }) => {
        await page.goto('https://coinmarketcap.com/');
        await page.waitForTimeout(3000);

        // asking eyes to focus on particular region while comparing with the baseline
        await eyes.check('Test to demonstrate Content Region', 
            Target.window()
                .contentRegion('h1>span[dir="auto"]') 
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