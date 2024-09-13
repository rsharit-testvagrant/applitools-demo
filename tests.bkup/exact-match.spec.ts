import { test } from '@playwright/test';
import { TVBatchInfo, ApplitoolsConfig } from '../src/batch-info';
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

test.describe('Exact match case - Bank Dashboard Visual Tests', () => {
    test.beforeEach(async ({ page }) => {
        // Open Eyes for the test
        //await eyes.open(page, BatchInfoLocal.appName, `Bank Dashboard Exact Match Test`);
    });
    /*
    AT Link Match - https://eyes.applitools.com/app/test-results/00000251676821522068/?accountId=l9D0456laE6IwyZgopBlJg__
    */
    test('Negative: Exact Match Test - Bank Dashboard', async ({ page }) => {
        await eyes.open(page, TVBatchInfo.appName, `Negative: Bank Dashboard Exact Match Test`);
        await page.goto('https://sandbox.applitools.com/bank/dashboard?layoutAlgo=true');
        await page.waitForTimeout(3000);

        // Perform visual check with Exact Match Level on the whole page
        await eyes.check('Bank Dashboard - Exact Match', 
            Target.window().fully().exact() // Exact match level
        );
    });

    /*
    AT Link Match - https://eyes.applitools.com/app/test-results/00000251676822103766/?accountId=l9D0456laE6IwyZgopBlJg__
    */
    test('Positive: Exact Match Test - Dashboard Overview Header', async ({ page }) => {
        await eyes.open(page, BatchInfoLocal.appName, `Positive: Bank Dashboard Exact Match Test`);
        await page.goto('https://sandbox.applitools.com/bank/dashboard?layoutAlgo=true');
        await page.waitForTimeout(3000);

        // Perform visual check with Exact Match Level on the specific section
        await eyes.check('Dashboard Overview Header - Exact Match', 
            Target.region('.dashboardOverview_warning__Nxry8 span').exact() 
        );
    });

    test.afterEach(async () => {
        // End Applitools Visual AI Test
        await eyes.closeAsync();
    });
});

test.afterAll(async() => {
    const results = await Runner.getAllTestResults();
    console.log('Visual test results', results.getAllResults());
});