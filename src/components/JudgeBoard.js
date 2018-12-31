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
            fetchingSubscriptions: []
        };

        this.imagePool = React.createRef();
        this._labelImage = this._labelImage.bind(this);
    }

    _fetchCount() {
        // noinspection ES6BindWithArrowFunction
        const accept = ((unlabeledCount, labeledCount) => {
            console.log(`Fetch count: ${unlabeledCount}, ${labeledCount}`);

            let stateCopy = this.state;
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
        const accept = (size, imageBodies) => {
            console.log(`Method _fetchImages. Fetch size: ${size}`);
            console.log(`Method _fetchImages. Cached size: ${this.imagePool.current.getNumOfCachedImages()}`);

            console.log(`All images in local`);
            imageBodies.forEach((b) => console.log(b.name));

            this.imagePool.current.addImage(imageBodies);
        };

        await ImageFetchUtils.downloadManyImages(size, accept);
    }

    _addSubscription(promise) {
        this.state.fetchingSubscriptions.push(promise);
    }

    _timeToFetch() {
        const cachedNum = this.imagePool.current.getNumOfCachedImages();

        return cachedNum <= IMAGE_CACHED_THRESHOLD && cachedNum % 5 === 0;
    }

    _setOnLabeling(onLabeling) {
        let stateCopy = this.state;
        stateCopy.onLabeling = onLabeling;
        this.setState(stateCopy);
    }

    _timeToFinish() {
        // there are two situations to make this happen.
        // 1. there are no images available in local
        // 2. there are no images available on server
        // we only check for case 2 in this case
        // TODO: check case 1
        return this.imagePool.current.nextImage() === false;
    }

    async _labelImage(name, quality) {
        const imageMeta = {
            [NAME]: name,
            [QUALITY]: quality
        };

        // noinspection ES6BindWithArrowFunction
        const accept = ((msg) => {
            console.log(`Success message: ${msg}`);

            // update the count
            this._fetchCount();

            // download more images once an image is labeled
            if (this._timeToFetch()) {
                this._addSubscription(this._fetchImages(5));
            }
        }).bind(this);

        const reject = (err) => {
            console.error(err);
        };

        // start to make labeling request
        // all buttons are disabled
        this._setOnLabeling(true);

        // send request to server to label the image
        await ImageFetchUtils.labelImage(imageMeta, accept, reject);

        // check if there are no unlabeled images to be fetched from servers
        if (this._timeToFinish()) {
            console.log("Ready to switch to finishing screen");
            this.props.navigation.navigate(FINISH_SCREEN);
        }

        this._setOnLabeling(false);
    }

    componentWillUnmount() {
        // cancel all subscriptions
        /*for (const promise in this.state.fetchingSubscriptions) {
            promise.cancel();
        }*/
    }

    componentDidMount() {
        // when the component is first mounted,
        // it has image bodies passed in
        this._fetchCount();
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
