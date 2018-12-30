import {Image, View} from "react-native";
import React from "react";
import {BASE64_ENCODED_IMAGE_PREFIX} from "../utils/Constants";

class ImagePoolService extends Component {

    constructor(props) {
        super(props);

        this.state = {
            imageBodies: [],
            curImageName: null,
            curImageBuffer: null
        };
    }

    /**
     * Render the next image if available.
     * */
    nextImage() {
        // TODO: drop the first image of the current buffer
    }

    /**
     * @param images
     *        List of images to be added. Each image is an object that must have
     *        two fields, namely 'name' and 'encodedImage'
     * */
    addImage(images) {
        // TODO: add to the end of the list

    }

    render() {
        return (
            <View>
                <Image
                    source = {`${BASE64_ENCODED_IMAGE_PREFIX}${this.state.curImageBuffer}`}
                />
            </View>
        );
    }
}

export default ImagePoolService;
