import React, {Component} from "react"
import * as ImageFetchUtils from "../../utils/ImageFetchUtils";
import {FINISH_SCREEN, IMAGE_INITIAL_DOWNLOAD_SIZE, INITIAL_IMAGEBODIES, LABELING_SCREEN} from "../../utils/Constants";
import {ActivityIndicator, View} from "react-native";

export class InitialLoadingScreen extends Component {
    constructor(props) {
        super(props);
    }

    _prefetchImages() {
        const accept = (size, imageBodies) => {
            console.log(`Initially load ${size} images`);

            this.props.navigation.navigate(LABELING_SCREEN, {
                [INITIAL_IMAGEBODIES]: imageBodies
            });
        };

        const reject = () => {
            console.log("No image available");
            this.props.navigation.navigate(FINISH_SCREEN);
        };

        ImageFetchUtils.downloadManyImages(IMAGE_INITIAL_DOWNLOAD_SIZE, accept, reject);
    }

    componentDidMount() {
        // prefetch images from the server
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
