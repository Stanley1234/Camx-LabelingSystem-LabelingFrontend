import {
    COUNT_LABELED_METHOD,
    COUNT_LABELED_URI,
    COUNT_UNLABELED_METHOD,
    COUNT_UNLABELED_URI, DOWNLOAD_MANY_METHOD,
    DOWNLOAD_METHOD,
    DOWNLOAD_URI, ERROR, IMAGES, LABELING_METHOD, MESSAGE, NAME, NUMBER, QUALITY
} from "./Constants";
import * as URIUtils from "./UriUtils";

/**
 * @param accept
 *        Callback that accepts two parameters (c1, c2). Both parameters are integers
 *        saving the value of count of the unlabeled and labeled respectively.
 * @param reject
 *        Callback that accepts two parameters (err1, err2). The first parameter
 *        is the error message of fetching count of unlabeled. The second parameter
 *        is the error message of fetching count of labeled.
 *        Note that only one of err1 and err2 will be non-null, i.e. if being rejected
 *        when fetching count of unlabeled, then err2 will be null.
 * */
export async function fetchCountOfLabeledAndUnlabeled(accept, reject) {
    let unlabeledResJson, labeledResJson;

    // fetch unlabeled count
    try {
        const unlabeledResponse = await fetch(COUNT_UNLABELED_URI, {method: COUNT_UNLABELED_METHOD});
        unlabeledResJson = await unlabeledResponse.json();

        if (unlabeledResponse.status !== 200) {
            // fatal unknown error
            if (reject !== null) {
                reject(unlabeledResJson[ERROR], null);
            }
        }
    }
    catch (e) {
        if (reject !== null) {
            reject(e, null);
        }
        return;
    }

    // fetch labeled count
    try {
        const labeledResponse = await fetch(COUNT_LABELED_URI, {method: COUNT_LABELED_METHOD});
        labeledResJson = await labeledResponse.json();

        if (labeledResJson.status !== 200) {
            // fatal unknown error
            if (reject !== null) {
                reject(null, labeledResJson[ERROR]);
            }
            return;
        }

    } catch (e) {
        if (reject !== null) {
            reject(null, e);
        }
        return;
    }

    accept(unlabeledResJson[NUMBER], labeledResJson[NUMBER]);
}

/**
 * Download one image from server
 * @param accept
 *        Callback that accepts one parameter.
 * @param reject
 *
 * */
export async function downloadOneImage(accept, reject) {
    try {
        const downloadResponse = await fetch(DOWNLOAD_URI, {method: DOWNLOAD_METHOD});
        const downloadResJson = await downloadResponse.json();

        if (downloadResponse.status !== 200) {
            if (reject !== null) {
                reject(downloadResJson[ERROR]);
            }
            return;
        }

        accept(downloadResJson);

    } catch (e) {
        if (reject !== null) {
            reject(e);
        }
    }
}

/**
 * @param size
 *        Number of images requested to download
 * @param accept
 *        Callback that accepts two parameters. The first parameter
 *        is number of images actually received on the client side.
 *        The second parameter is a list of object with fields
 *        [NAME] and [BUFFER]
 * @param reject
 *        Callback that accepts one parameter
 * */
export async function downloadManyImages(size, accept, reject) {
    const uri = URIUtils.generateDownloadManyUri(size);
    try {
        const response = await fetch(uri, {
            method: DOWNLOAD_MANY_METHOD
        });
        const responseJson = await response.json();

        if (responseJson.status !== 200) {
            if (reject !== null) {
                reject(responseJson[ERROR]);
            }
        }

        accept(responseJson[IMAGES].length, responseJson[IMAGES]);
    } catch (e) {
        if (reject !== null) {
            reject(e);
        }
    }
}

/**
 *
 * @param imageMeta
 *        Description of the image where 'name' and 'quality' fields
 *        are important
 * @param accept
 *        Callback that accepts one parameter which saves plain-text
 *        message from server
 * @param reject
 *
 * */
export async function labelImage(imageMeta, accept, reject) {
    const name = imageMeta[NAME];
    const quality = imageMeta[QUALITY];

    try {
        if (name === null || quality === null || name === undefined
                || quality === undefined) {
            // noinspection ExceptionCaughtLocallyJS
            throw new Error(`Illegal argument: ${name}, ${quality}`);
        }
    } catch (e) {
        reject(e);
        return;
    }

    try {
        let labelResponse = await fetch(URIUtils.generateLabelUri(name, quality), {
            method: LABELING_METHOD
        });

        let labelResJson = await labelResponse.json();
        if (labelResponse.status !== 200) {
            if (reject !== null) {
                reject(labelResJson[ERROR]);
            }
            return;
        }

        accept(labelResJson[MESSAGE]);
    } catch (e) {
        if (reject !== null) {
            reject(e);
        }
    }
}

