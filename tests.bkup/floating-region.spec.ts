import { test } from '@playwright/test';
import { ApplitoolsConfig, TVBatchInfo } from '../src/batch-info';
import { BatchInfo, Configuration, EyesRunner, FloatingMatchSettings, Region,VisualGridRunner, BrowserType, DeviceName, ScreenOrientation, Eyes, Target, ClassicRunner } from '@applitools/eyes-playwright';
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

test.describe('This test is to demonstrate floating region', () => {
    test.beforeEach(async ({ page }) => {
        await eyes.open(page, TVBatchInfo.appName, 'Test to demonstrate floating region');
    });
    

    // AT link match - https://eyes.applitools.com/app/test-results/00000251676818726101/?accountId=l9D0456laE6IwyZgopBlJg__
    // https://applitools.com/tutorials/guides/advanced-use-cases/match-levels-&-regions

      test('Demonstrate Floating Region', async ({ page }) => {
        await page.goto('http://sandbox.applitools.com/bank?floatRegion=true');
        await page.waitForTimeout(20000);

        await eyes.check('Demonstrate Floating Region', 
            Target
              .window()
              .floatingRegion('.loginForm_loginFormLogo__wweIT > a:nth-child(1) > svg:nth-child(1)', 250, 10, 80, 10) 
          )
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