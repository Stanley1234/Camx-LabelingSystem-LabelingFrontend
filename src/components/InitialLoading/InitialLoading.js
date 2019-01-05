import React, {Component} from "react"
import {FETCH_NAMES_SIZE, INITIAL_IMAGES_DOWNLOAD_SIZE} from "../../configs/Fetch";
import * as ImageFetchUtils from "../../libs/ImageFetchUtils";
import {FINISH_SCREEN, LABELING_SCREEN} from "../../configs/Route";
import {ActivityIndicator, Text, View} from "react-native";

export default class InitialLoading extends Component {

    constructor(props) {
        super(props);

        this.namesList = [];
        this.imagesBodiesList = [];
        this.navigation = this.props.navigation;

        this.state = {
            steps: 0,
        };
    }

    _increaseSteps(percent) {
        let stateCopy = Object.assign({}, this.state);
        stateCopy.steps += percent;
        this.setState(stateCopy);
    }

    async _prefetchNames() {
        const accept = (namesList) => {
            this.namesList = namesList;

            console.log(`Fetching name list of length ${this.namesList.length}`);
        };

        const reject = (msg) => {
            console.log(msg);
        };

        await ImageFetchUtils.fetchNames(FETCH_NAMES_SIZE, accept, reject);
    }

    async _prefetchImages() {

        const accept = (imageBodies) => {
            console.log(`Fetching bulk of images size: ${imageBodies.length}`);
            this.imagesBodiesList = imageBodies;
        };

        const reject = (msg) => {
            console.error(msg);
        };

        console.log("pre-fetching images");

        const actualRequestSize = Math.min(INITIAL_IMAGES_DOWNLOAD_SIZE, this.namesList.length);

        const initialNameList = this.namesList.slice(0, actualRequestSize);

        await ImageFetchUtils.fetchBulkImageByNameList(initialNameList, accept, reject);

        this.namesList = this.namesList.slice(actualRequestSize);
    }

    async _prefetch() {
        console.log("start pre-fetching");

        await this._prefetchNames();

        if (this.namesList.length === 0) {
            this.navigation.navigate(FINISH_SCREEN);
            return;
        }

        this._increaseSteps(0.1);

        await this._prefetchImages();

        // TODO: make it as an animation
        this._increaseSteps(0.9);

        this.navigation.navigate(LABELING_SCREEN, {
            initialImageBodies: this.imagesBodiesList,
            initialNameList: this.namesList
        });
    }

    componentDidMount() {
        this._prefetch();
    }

    render() {
        return (
            <View>
                <Text>Pre-fetching images from server</Text>
                <ActivityIndicator/>
            </View>
        );
    }
}
