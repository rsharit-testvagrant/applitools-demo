import { test } from '@playwright/test';
import { BatchInfoLocal } from '../src/batch-info';
import { BatchInfo, Configuration, EyesRunner, VisualGridRunner, BrowserType, DeviceName, ScreenOrientation, Eyes, Target, ClassicRunner } from '@applitools/eyes-playwright';
import { generateUUID } from '../src/utils/uuid';

export let Batch: BatchInfo;
export let Config: Configuration;
export let Runner: EyesRunner;
export let eyes: Eyes;

test.beforeAll(async() => {
    process.env.APPLITOOLS_API_KEY = 'WPn4qfQxOcBknA111YGDB1i8CIftXGKDnmUDmgSlcbsHc110';
    Runner = new ClassicRunner();
    Config = new Configuration();
    eyes = new Eyes(Runner, Config);
});

    test.describe('This test case is to demonstrate a strict match case', () => {
        test.beforeEach(async ({ page }) => {
            await eyes.open(page, BatchInfoLocal.appName, `Test to demonstrate strict case`);
        });

/* 
    AT Link Mismatch - https://eyes.applitools.com/app/test-results/00000251676820823771/?accountId=l9D0456laE6IwyZgopBlJg__
*/
    
    test('Strict Match Test - Bank Dashboard', async ({ page }) => {
        await page.goto('https://sandbox.applitools.com/bank/dashboard?layoutAlgo=true');
        await page.waitForTimeout(3000);

        // Perform visual check with Strict Match Level on the whole page
        await eyes.check('Bank Dashboard - Strict Match', 
            Target.window().fully().strict() // Strict match level
        );
    })

    test.afterEach(async () => {
        await eyes.closeAsync();
    });
});

test.afterAll(async() => {
    const results = await Runner.getAllTestResults();
    console.log('Visual test results', results.getAllResults());
});