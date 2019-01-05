import {Image, View} from "react-native";
import React, {Component} from "react"
import * as UriUtils from "../../libs/UriUtils";
import {BUFFER, NAME} from "../../configs/Field";

class ImageSlide extends Component {

    constructor(props) {
        super(props);

        const initialImageBodies = this.props.initialImageBodies;
        const curImageBody = (initialImageBodies === null ? null : initialImageBodies[0]);

        this.state = {
            curImageBody: curImageBody,
        };

        this.availImages = initialImageBodies;

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
    nextImage() {
        console.log("Method - nextImage");

        const cachedNum = this.getNumOfCachedImages();

        // TODO: remove debug
        //console.log(`====== ${cachedNum - 1} Image stored in local =====`);
        //this.availImages.forEach((image) => console.log(image.name));
        //console.log("==================================");

        if (cachedNum === 0) {
            //this.mutex.release();
            return;
        }

        this.availImages.shift();

        // update the state
        let stateCopy = Object.assign({}, this.state);

        if (cachedNum === 1) {
            stateCopy.curImageBody = null;
        } else {
            stateCopy.curImageBody = this.availImages[0];
        }

        // cause the component to refresh
        this.setState(stateCopy);
    }

    /**
     * @param images
     *        List of images to be added. Each image is an object that must have
     *        two fields, namely 'name' and 'encodedImage'
     * */
    addImage(images) {
        console.log("Method - addImage");

        this.availImages = this.availImages.concat(images);

        //console.log(`====== Added Image stored in local =====`);
        //this.availImages.forEach((image) => console.log(image.name));
        //console.log("==================================");
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

export default ImageSlide;
