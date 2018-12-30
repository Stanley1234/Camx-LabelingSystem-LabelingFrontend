import {Image, View} from "react-native";
import React, {Component} from "react"
import {BUFFER, INITIAL_IMAGEBODIES, NAME} from "../utils/Constants";
import * as UriUtils from "../utils/UriUtils";

class ImagePoolService extends Component {

    constructor(props) {
        super(props);

        const initialImageBodies = this.props[INITIAL_IMAGEBODIES];
        const curImageBody = (initialImageBodies === null ? null : initialImageBodies[0]);

        this.state = {
            imageBodies: initialImageBodies,
            curImageBody: curImageBody
        };
    }

    getCurImageName() {
        if (this.state.curImageBody === null) {
            return null;
        }
        return this.state.curImageBody[NAME];
    }

    /**
     * Render the next image if available.
     * */
    nextImage() {
        // drop the first image
        let stateCopy = this.state;
        stateCopy.imageBodies = stateCopy.imageBodies.shift();

        if (stateCopy.imageBodies.length === 0) {
            stateCopy.curImageBody = null;
        } else {
            stateCopy.curImageBody = stateCopy.imageBodies[0];
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
        let stateCopy = this.state;
        stateCopy.imageBodies = stateCopy.imageBodies.concat(images);
        this.setState(stateCopy);
    }

    render() {
        const prefix = UriUtils.generateBase64ImagePrefix(this.state.curImageBody[NAME]);
        return (
            <View>
                <Image
                    source = {`${prefix}${this.state.curImageBody[BUFFER]}`}
                />
            </View>
        );
    }
}

export default ImagePoolService;
