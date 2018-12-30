
export const PROTOCOL = "http";
export const SERVER_IP = "172.20.144.244";
export const SERVER_PORT = "8080";
export const SERVER_ADDR = `${PROTOCOL}://${SERVER_IP}:${SERVER_PORT}`;

export const DOWNLOAD_URI = SERVER_ADDR + "/download";
export const DOWNLOAD_METHOD = "GET";
export const DOWNLOAD_MANY_METHOD = "GET";
export const COUNT_UNLABELED_URI = SERVER_ADDR + "/count/unlabeled";
export const COUNT_UNLABELED_METHOD = "GET";
export const COUNT_LABELED_URI = SERVER_ADDR + "/count/labeled";
export const COUNT_LABELED_METHOD = "GET";
export const LABELING_METHOD = "PUT";

export const IMAGE_QUALITY_GOOD = "GOOD";
export const IMAGE_QUALITY_BAD = "BAD";
export const IMAGE_QUALITY_UNKNOWN = "UNKNOWN";

export const IMAGE_DOWNLOAD_SIZE_SMALL = 25;


// TODO: find the prefix
export const BASE64_ENCODED_IMAGE_PREFIX = "";
