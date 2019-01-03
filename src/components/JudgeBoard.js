import React, {Component} from "react"
import {Button, Text, View} from "react-native";
import {
    FINISH_SCREEN, IMAGE_CACHED_THRESHOLD,
    IMAGE_QUALITY_BAD,
    IMAGE_QUALITY_GOOD,
    IMAGE_QUALITY_UNKNOWN,
    INITIAL_IMAGEBODIES,
    NAME,
    QUALITY
} from "../utils/Constants";
import * as ImageFetchUtils from "../utils/ImageFetchUtils";
import ImagePool from "./ImagePool";

class JudgeBoard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            labeledNum: 0,
            unlabeledNum: 0,
            onLabeling: false,
        };

        this.imagePool = React.createRef();
        this._labelImage = this._labelImage.bind(this);
        this.mounted = true;

        console.log("Calling constructor JudgeBoard completes");
    }

    _fetchCount() {
        console.log("Method - _fetchCount");

        // noinspection ES6BindWithArrowFunction
        const accept = ((unlabeledCount, labeledCount) => {
            console.log(`Fetch count: ${unlabeledCount}, ${labeledCount}`);

            let stateCopy = Object.assign({}, this.state);
            stateCopy.labeledNum = labeledCount;
            stateCopy.unlabeledNum = unlabeledCount;
            this.setState(stateCopy);

        }).bind(this);

        // noinspection ES6BindWithArrowFunction
        const reject = ((err1, err2) => {
            console.error(`fetching unlabeled: ${err1}`);
            console.error(`fetching labeled: ${err2}`);
        }).bind(this);

        ImageFetchUtils.fetchCountOfLabeledAndUnlabeled(accept, reject);
    }

    async _fetchImages(size) {
        console.log("Method - _fetchImage");

        const accept = (size, imageBodies) => {
            console.log(`this.mounted=${this.mounted}`);
            if (this.mounted !== true) {
                return;
            }
            console.log(`Method _fetchImages. Fetch size: ${size}`);
            console.log(`Method _fetchImages. Cached size: ${this.imagePool.current.getNumOfCachedImages()}`);

            this.imagePool.current.addImage(imageBodies);
        };

        await ImageFetchUtils.downloadManyImages(size, accept);
    }

    _timeToFetch() {
        const cachedNum = this.imagePool.current.getNumOfCachedImages();

        return cachedNum <= IMAGE_CACHED_THRESHOLD && cachedNum % 5 === 0;
    }

    _setOnLabeling(onLabeling) {
        let stateCopy = Object.assign({}, this.state);
        stateCopy.onLabeling = onLabeling;
        this.setState(stateCopy);
    }

    async _timeToFinish() {
        // there are two situations to make this happen.
        // 1. there are no images available in local
        // 2. there are no images available on server
        // we only check for case 2 in this case
        // TODO: check case 1
        return await this.imagePool.current.nextImage() === false;
    }

    async _labelImage(name, quality) {
        console.log("Method - _labelImage");

        const imageMeta = {
            [NAME]: name,
            [QUALITY]: quality
        };

        // noinspection ES6BindWithArrowFunction
        const accept = ((msg) => {
            console.log(`Labeling succeeds: ${msg}`);
        }).bind(this);

        const reject = (err) => {
            console.error(err);
        };

        // start to make labeling request
        // all buttons are disabled
        this._setOnLabeling(true);

        // send request to server to label the image
        await ImageFetchUtils.labelImage(imageMeta, accept, reject);

        // update the count
        this._fetchCount();

        // download more images once an image is labeled
        if (this._timeToFetch()) {
            const diff = this.state.unlabeledNum - this.imagePool.current.getNumOfCachedImages();

            if (diff >= 10 || this.state.unlabeledNum <= 15) {
                this._fetchImages(15);
            } else {
                this._fetchImages(5);
            }
        }

        // check if there are no unlabeled images to be fetched from servers
        if (await this._timeToFinish()) {
            console.log("Ready to switch to finishing screen");
            this.props.navigation.navigate(FINISH_SCREEN);
        }

        this._setOnLabeling(false);
    }

    componentWillUnmount() {
        console.log("Component will unmount");
        this.mounted = false;
    }

    componentDidMount() {
        this._setOnLabeling(true);

        // when the component is first mounted,
        // it has image bodies passed in
        this._fetchCount();

        this._setOnLabeling(false);
    }

    render() {
        return (
            <View>
                <View>
                    <Text>Now labeled: {this.state.labeledNum}</Text>
                    <Text>Still unlabeled: {this.state.unlabeledNum}</Text>
                </View>

                <ImagePool
                    initialImageBodies = {this.props[INITIAL_IMAGEBODIES]}
                    ref = {this.imagePool}
                />

                <View>
                    <View style={{margin: 20}}>
                        <Button title='Good'
                                disabled={this.state.onLabeling}
                                onPress={() => this._labelImage(this.imagePool.current.getCurImageName(), IMAGE_QUALITY_GOOD)}/>
                    </View>
                    <View style={{margin: 20}}>
                        <Button title='Bad'
                                disabled={this.state.onLabeling}
                                onPress={() => this._labelImage(this.imagePool.current.getCurImageName(), IMAGE_QUALITY_BAD)} />
                    </View>
                    <View style={{margin: 20}}>
                        <Button title='Unknown'
                                disabled={this.state.onLabeling}
                                onPress={() => this._labelImage(this.imagePool.current.getCurImageName(), IMAGE_QUALITY_UNKNOWN)} />
                    </View>
                </View>
            </View>
        );
    }
}

export default JudgeBoard;
