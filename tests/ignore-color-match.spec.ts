import { test } from '@playwright/test';
import { ApplitoolsConfig, CloseEyesBatch, TVBatchInfo, TV_Eyes } from '../src/batch-info';
import { BatchInfo, Configuration, EyesRunner, VisualGridRunner, BrowserType, DeviceName, ScreenOrientation, Eyes, Target, ClassicRunner } from '@applitools/eyes-playwright';
import { generateUUID } from '../src/utils/uuid';


let eyesInstance: Eyes; 
let runnerInstance: ClassicRunner;

test.beforeAll(async() => {
    const tvEyes = TV_Eyes();
    eyesInstance = tvEyes.eyesInstance;
    runnerInstance = tvEyes.runnerInstance;
});

/**
 * https://applitools.com/docs/api-ref/sdk-api/playwright/javascript/matchlevel
 */
test.describe('This test is to demonstrate ignore color differences.', () => {

    test.beforeEach(async ({ page }) => {
        await eyesInstance.open(page, TVBatchInfo.appName, `Test to demonstrate ignore color`);
    });
    

    // applitool link - https://eyes.applitools.com/app/test-results/00000251676950404342/?accountId=l9D0456laE6IwyZgopBlJg__
    test('Ignore color match test', async ({ page }) => {
        await page.goto('https://coinmarketcap.com/');
        await page.waitForTimeout(3000);

        // asking eyes to ignore the color differences
        await eyesInstance.check('Test to demonstrate ignore color', Target.region('div.sc-a27793cf-2.eNKAqm')
        .ignoreColors()
        
        );
    });

    test.afterEach(async () => {
        await eyesInstance.closeAsync();
    });
});

test.afterAll(async() => {
    const results = await runnerInstance.getAllTestResults();
    console.log('Visual test results', results.getAllResults());
    //await CloseEyesBatch();
});