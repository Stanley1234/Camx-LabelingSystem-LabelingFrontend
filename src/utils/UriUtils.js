import {SERVER_ADDR} from "./Constants";

export function generateLabelUri(imageName, quality) {
    return `${SERVER_ADDR}/label/${imageName}/${quality}`;
}

export function generateDownloadManyUri(size) {
    return `${SERVER_ADDR}/download/${size}`;
}

export function generateBase64ImagePrefix(name) {
    const suffix = name.split('.')[1];
    console.debug(`suffix: ${suffix}`);
    return `data:image/${suffix};base64,`;
}
