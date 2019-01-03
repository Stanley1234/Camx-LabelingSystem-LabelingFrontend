import {Image, View} from "react-native";
import React, {Component} from "react"
import {BUFFER, INITIAL_IMAGEBODIES, NAME} from "../utils/Constants";
import * as UriUtils from "../utils/UriUtils";
import Semaphore from "semaphore-async-await"

class ImagePool extends Component {

    constructor(props) {
        super(props);

        const initialImageBodies = this.props[INITIAL_IMAGEBODIES];
        const curImageBody = (initialImageBodies === null ? null : initialImageBodies[0]);

        this.state = {
            curImageBody: curImageBody,
        };

        this.availImages = initialImageBodies;
        this.removedImages = new Set();
        this.mutex = new Semaphore(1);

        console.log("Calling constructor ImagePool completes");
    }

    getNumOfCachedImages() {
        return this.availImages.length;
    }


    getCurImageName() {
        if (this.state.curImageBody === null) {
            return null;
        }
        return this.state.curImageBody[NAME];
    }

    /**
     * Render the next image if available. Return true if there is an image available.
     * Return false if there are no images available.
     * */
    async nextImage() {
        console.log("Method - nextImage");

        await this.mutex.acquire();
        console.log("nextImage - take lock");

        const cachedNum = this.getNumOfCachedImages();

        const removed = this.availImages.shift();
        this.removedImages.add(removed[NAME]);

        // TODO: remove debug
        //console.log(`====== ${cachedNum} Image stored in local =====`);
        //this.availImages.forEach((image) => console.log(image.name));
        //console.log("==================================");

        if (cachedNum === 0) {
            this.mutex.release();
            return false;
        }

        // update the state
        let stateCopy = Object.assign({}, this.state);
        let ret;

        if (cachedNum === 1) {
            stateCopy.curImageBody = null;
            ret = false;
        } else {
            stateCopy.curImageBody = this.availImages[0];
            ret = true;
        }

        // cause the component to refresh
        this.setState(stateCopy);
        this.mutex.release();
        return ret;

    }

    /**
     * @param images
     *        List of images to be added. Each image is an object that must have
     *        two fields, namely 'name' and 'encodedImage'
     * */
    async addImage(images) {
        console.log("Method - addImage");

        await this.mutex.acquire();
        console.log("addImage - take lock");

        // filter duplicates
        images.forEach((newImage) => {
            let exist = false;
            this.availImages.forEach((oldImage) => {
                 if (newImage[NAME] === oldImage[NAME]) {
                     exist = true;
                 }
            });
            if (!exist && !this.removedImages.has(newImage[NAME])) {
                // add images
                console.log(`Add image: ${newImage[NAME]}`);
                this.availImages.push(newImage);
            }
        });
        this.mutex.release();
    }

    render() {
        // render nothing if no images are available
        if (this.state.curImageBody === null) {
            return (<View/>);
        }

        const prefix = UriUtils.generateBase64ImagePrefix(this.state.curImageBody[NAME]);
        return (
            <View>
                <Image
                    source = {{uri: `${prefix}${this.state.curImageBody[BUFFER]}`}}
                    style = {{width: 300, height: 150}}
                />
            </View>
        );
    }
}

export default ImagePool;
