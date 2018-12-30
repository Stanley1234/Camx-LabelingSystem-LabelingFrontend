import React, {Component} from "react"
import * as ImageFetchUtils from "../../utils/ImageFetchUtils";
import {IMAGE_DOWNLOAD_SIZE_SMALL} from "../../utils/Constants";
import {ActivityIndicator, View} from "react-native";

export class InitialLoadingScreen extends Component {
    constructor(props) {
        super(props);
    }

    _prefetchImages() {
        const accept = (size, imageBodies) => {
            console.log(`pre-fetching ${size} images`);

            // TODO: pass imageBodies to next scene
            this.navigation.navigate('LABELING');
        };
        ImageFetchUtils.downloadManyImages(IMAGE_DOWNLOAD_SIZE_SMALL, accept);
    }

    componentDidMount() {
        // prefetch images from server
        this._prefetchImages();
    }

    render() {
        // TODO: add fetching xxx images. Please wait
        return (
            <View>
                <ActivityIndicator/>
            </View>
        );
    }
}
