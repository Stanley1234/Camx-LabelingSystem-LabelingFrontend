import {NAME} from "../../configs/Field";

let availImageBodies = [];

let context = {
    curImageBody: null
};

export function initializeImagePool(initialImageBodies) {
    availImageBodies = initialImageBodies;
    if (availImageBodies.length > 0) {
        context.curImageBody = availImageBodies[0];
    }

    console.log("Initialized image pool");
}

export function getNumOfCachedImages() {
    return availImageBodies.length;
}

export function getCurImageBody() {
    if (context.curImageBody === null) {
        return null;
    }
    return context.curImageBody;
}

export function getCurImageName() {
    if (context.curImageBody === null) {
        return null;
    }
    return context.curImageBody[NAME];
}

export function nextImage() {
    console.log("Method - nextImage");

    const cachedNum = getNumOfCachedImages();

    if (cachedNum === 0) {
        return;
    }

    availImageBodies.shift();

    if (cachedNum === 1) {
        context.curImageBody = null;
    } else {
        context.curImageBody = availImageBodies[0];
    }
}

export function addImage(images) {
    console.log("Method - addImage");

    availImageBodies = availImageBodies.concat(images);
}



