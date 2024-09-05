import { test } from '@playwright/test';
import { ApplitoolsConfig, BatchInfoLocal } from '../src/batch-info';
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

/**
 * https://applitools.com/docs/api-ref/sdk-api/playwright/javascript/matchlevel
 */
test.describe('this test is to demonstrate match type of layout applied on the page. It checks for various elements, ' + 
    'checks for their relative positions to each other.', () => {
    test.beforeEach(async ({ page }) => {
        await eyes.open(page, BatchInfoLocal.appName, `Test to demonstrate layout match`);
    });
    

    // AT link match- https://eyes.applitools.com/app/test-results/00000251676931231291/?accountId=l9D0456laE6IwyZgopBlJg__
    // AT link  yet to be resolved - https://eyes.applitools.com/app/test-results/00000251676931163592/?accountId=l9D0456laE6IwyZgopBlJg__
    test('Layout match test', async ({ page }) => {
        await page.goto('https://coinmarketcap.com/');
        await page.waitForTimeout(3000);

        // asking eyes to check for layout of the page
        await eyes.check('Test to demonstrate layout match', Target.window()
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