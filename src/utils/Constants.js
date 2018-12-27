export const SERVER_ADDR = "http://172.20.144.244:8080";

export const DOWNLOAD_URI = SERVER_ADDR + "/download";
export const COUNT_UNLABELED_URI = SERVER_ADDR + "/count/unlabeled";
export const COUNT_LABELED_URI = SERVER_ADDR + "/count/labeled";

export const IMAGE_QUALITY_GOOD = "GOOD";
export const IMAGE_QUALITY_BAD = "BAD";
export const IMAGE_QUALITY_UNKNOWN = "UNKNOWN";

export function generateLabelUri(imageName, quality) {
    return `${SERVER_ADDR}/label/${imageName}/${quality}`;
}
