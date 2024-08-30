import { test } from '@playwright/test';
import { BatchInfo, Configuration, EyesRunner, VisualGridRunner, BrowserType, DeviceName, ScreenOrientation, Eyes, Target } from '@applitools/eyes-playwright';

export let Batch: BatchInfo;
export let Config: Configuration;
export let Runner: EyesRunner;

test.beforeAll(async() => {

    // Configure Applitools SDK to run on the Ultrafast Grid
    Runner = new VisualGridRunner({ testConcurrency: 5 });
    Batch = new BatchInfo({name: `floating test`});

    Config = new Configuration();
    Config.setBatch(Batch);
    Config.addBrowsers(
        { name: BrowserType.CHROME, width: 1600, height: 600 }//,
        // { name: BrowserType.FIREFOX, width: 1600, height: 1200 },
        // { name: BrowserType.SAFARI, width: 1024, height: 768 },
        // { chromeEmulationInfo: { deviceName: DeviceName.iPhone_11, screenOrientation: ScreenOrientation.PORTRAIT} },
        // { chromeEmulationInfo: { deviceName: DeviceName.Nexus_10, screenOrientation: ScreenOrientation.LANDSCAPE} }
    )
});

test.describe('Drawing tests', () => {
    let eyes: Eyes;
    test.beforeEach(async ({ page }) => {
        eyes = new Eyes(Runner, Config);

        // Start Applitools Visual AI Test
        // Args: Playwright Page, App Name, Test Name, Viewport Size for local driver
        await eyes.open(page, 'Float', `test`, { width: 1600, height: 600 })
    });
    
    test('Visiting coinmarket home page', async ({ page }) => {
        await page.goto('https://coinmarketcap.com/');
        await page.waitForTimeout(3000);
        await page.locator('span.sc-cd4bdda8-0.iwtfqB.switch-button').click();

        // Full Page - Visual AI Assertion
        await eyes.check('flaot test', Target.region('div.sc-7f53b353-0.sc-7f53b353-2.fHwZkx.cfyfuc')
        .ignoreColors()
        .floatingRegion('span.sc-cd4bdda8-0.iwtfqB.switch-button')
        
        );
    });

    test.afterEach(async () => {
        // End Applitools Visual AI Test
        await eyes.close();
    });
});

test.afterAll(async() => {
    // Wait for Ultrast Grid Renders to finish and gather results
    const results = await Runner.getAllTestResults();
    console.log('Visual test results', results.getAllResults());
});