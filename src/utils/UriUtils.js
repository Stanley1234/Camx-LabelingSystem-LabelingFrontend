import {SERVER_ADDR} from "./Constants";

export function generateLabelUri(imageName, quality) {
    return `${SERVER_ADDR}/label/${imageName}/${quality}`;
}

export function generateDownloadManyUri(size) {
    return `${SERVER_ADDR}/download/${size}`;
}
