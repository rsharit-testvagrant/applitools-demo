import { BatchInfo, ClassicRunner, Configuration, Eyes, BatchClose } from "@applitools/eyes-playwright";

export const TVBatchInfo = {
    name : "Applitools demo",
    appName: "CoinMarketCap",
    batchId: "bdaa19fc-6399-4d32-b006-09db4afc70ac"
}

export const ApplitoolsConfig = {
    APPLITOOLS_API_KEY : "WPn4qfQxOcBknA111YGDB1i8CIftXGKDnmUDmgSlcbsHc110",
    APPLITOOLS_SERVER_URL: "https://eyes.applitools.com",
    APPLITOOLS_BATCH_ID: 'D9685422-A1DA-4D02-A33D-JG61D8E8F152'

}

interface EyesRunner {
    eyesInstance:Eyes,
    runnerInstance:ClassicRunner
}

let eyesInstance: Eyes;
let runnerInstance: ClassicRunner;

export function TV_Eyes(): EyesRunner {
  if (!eyesInstance && !runnerInstance) {
    // setting env variables
    process.env.APPLITOOLS_BATCH_ID=ApplitoolsConfig.APPLITOOLS_BATCH_ID;
    process.env.APPLITOOLS_API_KEY = ApplitoolsConfig.APPLITOOLS_API_KEY;
    process.env.APPLITOOLS_SERVER_URL = ApplitoolsConfig.APPLITOOLS_SERVER_URL;

    // Initialize the runner and batch info only once
    runnerInstance = new ClassicRunner();
    
    const batch = new BatchInfo({name: TVBatchInfo.name});
    batch.setId(ApplitoolsConfig.APPLITOOLS_BATCH_ID);
    
    // Configure the Eyes instance
    const eyesConfig = new Configuration();
    eyesConfig.setDontCloseBatches(true);

    eyesConfig.setBatch(batch);
    
    // Create the Eyes instance
    eyesInstance = new Eyes(runnerInstance, eyesConfig);
  }

  // Return the singleton instance
  return {eyesInstance, runnerInstance} ;
}

export async function CloseEyesBatch(){
    const batchids:string[]=[] ;
    batchids.push(process.env.APPLITOOLS_BATCH_ID as string);
    const batchClose = new BatchClose();
    batchClose.setBatchIds(batchids);
    await batchClose.close()
}