export const PROTOCOL = "http";
export const SERVER_IP = "192.168.1.177";
export const SERVER_PORT = "8080";
export const SERVER_ADDR = `${PROTOCOL}://${SERVER_IP}:${SERVER_PORT}`;

export const DOWNLOADONE_URI = `${SERVER_ADDR}/download`;
export const COUNT_UNLABELED_URI = `${SERVER_ADDR}/count/unlabeled`;
export const COUNT_LABELED_URI = `${SERVER_ADDR}/count/labeled`;
export const FETCH_URI = `${SERVER_ADDR}/fetch`;

export const DOWNLOADONE_METHOD = "GET";
export const DOWNLOAD_MANY_METHOD = "GET";
export const COUNT_UNLABELED_METHOD = "GET";
export const COUNT_LABELED_METHOD = "GET";
export const LABELING_METHOD = "PUT";
export const FETCH_METHOD = "POST";

export const FETCH_NAMELIST_METHOD = "GET";
