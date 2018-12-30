import React, {Component} from "react"
import * as ImageFetchUtils from "../../utils/ImageFetchUtils";
import {IMAGE_DOWNLOAD_SIZE_SMALL, INITIAL_IMAGEBODIES} from "../../utils/Constants";
import {ActivityIndicator, View} from "react-native";

export class InitialLoadingScreen extends Component {
    constructor(props) {
        super(props);
    }

    _prefetchImages() {
        const accept = (size, imageBodies) => {
            console.log(`pre-fetching ${size} images`);

            this.props.navigation.navigate('LABELING', {
                [INITIAL_IMAGEBODIES]: imageBodies
            });
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
