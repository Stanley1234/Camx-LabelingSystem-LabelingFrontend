import queueFactory from 'react-native-queue';
import * as ImageFetchUtils from "../../libs/ImageFetchUtils";
import Semaphore from "semaphore-async-await"
import * as ImagePool from "./ImagePoolService";

const LABELING_WORKER = "labeling";
const FETCHING_WORKER = "fetching";

const LABELING_PRIORITY = 1;
const FETCHING_PRIORITY = 2;

// number of jobs the worker can process concurrently
const LABELING_CONCURRENCY_LEVEL = 2;
const FETCHING_CONCURRENCY_LEVEL = 3;

let queue = null;
let initialized = false;

let context = {
    labelingJobs: 0,
    fetchingJobs: 0,
    fetchingSem: new Semaphore(0),
    labelingSem: new Semaphore(0)
};

async function _label(imageMeta) {
    const accept = (msg) => {
        console.log(`Labeling succeeds: ${msg}`);
    };
    const reject = (err) => {
        console.error(err);
    };
    await ImageFetchUtils.labelImage(imageMeta, accept, reject);
    context.labelingSem.release();
    context.labelingJobs --;
}

async function _fetch(names) {
    const accept = async (imageBodies) => {
        console.log(`Fetching ${imageBodies.length} images`);

        ImagePool.addImage(imageBodies);
    };

    const reject = (err) => {
        console.error(err);
    };

    await ImageFetchUtils.fetchBulkImageByNameList(names, accept, reject);

    context.fetchingSem.release();
    context.fetchingJobs --;
}

export async function initWorkers() {
    if (initialized) {
        return;
    }

    queue = await queueFactory();

    queue.addWorker(LABELING_WORKER, async (id, imageMeta) => {
        _label(imageMeta);
    }, {
        concurrency: LABELING_CONCURRENCY_LEVEL
    });

    queue.addWorker(FETCHING_WORKER, async (id, names) => {
         _fetch(names);
    }, {
        concurrency: FETCHING_CONCURRENCY_LEVEL
    });

    initialized = true;

    console.log("RequestPoolService initialization completes");
}

export function addLabelingJobs(imageMeta) {
    queue.createJob(LABELING_WORKER, imageMeta, {
        priority: LABELING_PRIORITY
    });
    context.labelingJobs ++;
}

export function addFetchingJobs(names) {
    queue.createJob(FETCHING_WORKER, names, {
        priority: FETCHING_PRIORITY
    });
    context.fetchingJobs ++;
}

export function hasFetchingJobsProcessing() {
    return context.fetchingJobs > 0;
}

export async function waitOnFetchingEvent() {
    if (context.fetchingSem.tryAcquire() === true) {
        context.fetchingSem.drainPermits();
    }
    await context.fetchingSem.acquire();
}

export async function waitOnLabelingEvents() {
    if (context.labelingSem.tryAcquire() === true) {
        context.labelingSem.drainPermits();
    }
    while (context.labelingJobs > 0) {
        await context.labelingSem.acquire();
    }
}

