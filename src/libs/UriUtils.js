import {SERVER_ADDR} from "../configs/Servers";

export function generateLabelUri(imageName, quality) {
    return `${SERVER_ADDR}/label/${imageName}/${quality}`;
}

export function generateDownloadManyUri(size) {
    return `${SERVER_ADDR}/download/${size}`;
}

export function generateFetchNameListUri(size) {
    return `${SERVER_ADDR}/download/namelist/${size}`;
}

export function generateBase64ImagePrefix(name) {
    const suffix = name.split('.')[1];
    return `data:image/${suffix};base64,`;
}
