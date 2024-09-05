import { test, expect } from '@playwright/test';
import { sandbox_applitools_get_data } from '../src/utils/mocked-strings';
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

test.describe('This test is to demonstrate mocking and taking snapshot for visual testing', () => {
    test.beforeEach(async ({ page }) => {
        await eyes.open(page, BatchInfoLocal.appName, 'Test to demonstrate mocking');
    });
    

    // AT link match(strict, color code used #b71b1b) - https://eyes.applitools.com/app/test-results/00000251676851153185/?accountId=l9D0456laE6IwyZgopBlJg__
    // AT link mismatch(exact, color code used #b61b1b) - https://eyes.applitools.com/app/test-results/00000251676851061123/?accountId=l9D0456laE6IwyZgopBlJg__

    test('Login into the bank portal', async ({ page }) => {
        const urlToIntercept = 'https://sandbox.applitools.com/bank/dashboard?layoutAlgo=true';
        const urlToBlock = 'https://sandbox.applitools.com/_next/static/chunks/pages/bank/dashboard-b2c384e3fdaa69b6.js';

      
        // Intercept the network request and substitute the response with custom HTML
        await page.route(urlToIntercept, async (route) => {
          // Fulfill the request with the custom HTML response
          await route.fulfill({
            status: 200,
            contentType: 'text/html',
            body: sandbox_applitools_get_data,
          });
        });

        await page.route(urlToBlock, (route) => {
            route.abort();
        });
      
        // Navigate to the page that triggers the GET request
        await page.goto('https://sandbox.applitools.com/bank?layoutAlgo=true');

        await page.locator('id=username').fill('user');
        await page.locator('id=password').fill('password');
        await page.locator('id=log-in').click();
        await page.waitForURL('https://sandbox.applitools.com/bank/dashboard?layoutAlgo=true');
        await page.waitForTimeout(1000);
        await eyes.check('After login', Target.window().fully().exact());

      
      });

    test.afterEach(async () => {
        await eyes.closeAsync();
    });
});

test.afterAll(async() => {
    const results = await Runner.getAllTestResults();
    console.log('Visual test results', results.getAllResults());
});
