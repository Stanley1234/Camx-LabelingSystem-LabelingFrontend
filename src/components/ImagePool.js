import {Image, View} from "react-native";
import React, {Component} from "react"
import {BUFFER, INITIAL_IMAGEBODIES, NAME} from "../utils/Constants";
import * as UriUtils from "../utils/UriUtils";

class ImagePool extends Component {

    constructor(props) {
        super(props);

        const initialImageBodies = this.props[INITIAL_IMAGEBODIES];
        const curImageBody = (initialImageBodies === null ? null : initialImageBodies[0]);

        this.state = {
            imageBodies: initialImageBodies,
            curImageBody: curImageBody,
        };
    }

    getNumOfCachedImages() {
        return this.state.imageBodies.length;
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
    nextImage() {
        const cachedNum = this.getNumOfCachedImages();

        // TODO: remove debug
        this.state.imageBodies.forEach((image) => console.log(image.name));

        if (cachedNum === 0) {
            return false;
        }

        let stateCopy = this.state;
        stateCopy.imageBodies.shift();

        if (cachedNum === 1) {

            stateCopy.curImageBody = null;
            this.setState(stateCopy);

            return false;

        } else {

            stateCopy.curImageBody = stateCopy.imageBodies[0];
            // cause the component to refresh
            this.setState(stateCopy);

            return true;
        }

    }

    /**
     * @param images
     *        List of images to be added. Each image is an object that must have
     *        two fields, namely 'name' and 'encodedImage'
     * */
    addImage(images) {

        // filter duplicates
        images.forEach((newImage) => {
            let exist = false;
            this.state.imageBodies.forEach((oldImage) => {
                 if (newImage[NAME] === oldImage[NAME]) {
                     exist = true;
                 }
            });
            if (!exist) {
                // add images
                this.state.imageBodies.push(newImage);
            }
        });
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
