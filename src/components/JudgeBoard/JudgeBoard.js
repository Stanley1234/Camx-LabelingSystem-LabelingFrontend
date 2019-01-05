import React, {Component} from "react"
import {ActivityIndicator, Button, Text, View} from "react-native";
import ImageSlide from "./ImageSlide";
import {IMAGE_QUALITY_BAD, IMAGE_QUALITY_GOOD, IMAGE_QUALITY_UNKNOWN} from "../../configs/ImageQuality";
import {NAME, QUALITY} from "../../configs/Field";
import * as RequestPoolService from "./RequestPoolService";
import {IMAGES_DOWNLOAD_SIZE, MAXIMUM_CACHED_NUM} from "../../configs/Fetch";
import {FINISH_SCREEN} from "../../configs/Route";
import * as ImagePoolService from "./ImagePoolService";

class JudgeBoard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            unlabeledNum: this.props.initialNameList.length + this.props.initialImageBodies.length,
            labeledNum: 0,
            fetching: false,
            submittingLabeling: false,
            disabled: false
        };

        this.navigation = this.props.navigation;
        this.nameList = this.props.initialNameList;

        this._startLabelImage = this._startLabelImage.bind(this);

        ImagePoolService.initializeImagePool(this.props.initialImageBodies);
        RequestPoolService.initWorkers();

        console.log("Calling constructor JudgeBoard completes");
    }

    _updateCount() {
        this.setState({
            labeledNum: this.state.labeledNum + 1,
            unlabeledNum: this.state.unlabeledNum - 1
        });
    }

    _startFetchingImage() {
        console.log("Start fetching image");

        const actualRequestSize = Math.min(IMAGES_DOWNLOAD_SIZE, this.nameList.length);

        const names = this.nameList.slice(0, actualRequestSize);

        this.nameList = this.nameList.slice(actualRequestSize);

        RequestPoolService.addFetchingJobs(names);
    }

    _timeToFetch() {
        const cachedNum = ImagePoolService.getNumOfCachedImages();

        if (cachedNum >= MAXIMUM_CACHED_NUM) {
            return false;
        }
        return this.nameList.length > 0;
    }

    static _timeToFinish() {
        return ImagePoolService.getNumOfCachedImages() === 0
            && !RequestPoolService.hasFetchingJobsProcessing();
    }

    async _waitUntilImageCached() {
        const cachedNum = ImagePoolService.getNumOfCachedImages();
        if (cachedNum > 1) {
            return;
        }
        if (!RequestPoolService.hasFetchingJobsProcessing()) {
            return;
        }

        this.setState({fetching: true});
        await RequestPoolService.waitOnFetchingEvent();
        this.setState({fetching: false});
    }

    async _waitUntilLabelingFinish() {
        this.setState({submittingLabeling: true});
        await RequestPoolService.waitOnLabelingEvents();
    }

    async _startLabelImage(name, quality) {
        console.log("Start labeling image");

        const imageMeta = {
            [NAME]: name,
            [QUALITY]: quality
        };

        this.setState({disabled: true});

        this._updateCount();

        RequestPoolService.addLabelingJobs(imageMeta);

        if (this._timeToFetch()) {
            this._startFetchingImage();
        }

        await this._waitUntilImageCached();

        // display next image
        ImagePoolService.nextImage();

        if (JudgeBoard._timeToFinish()) {
            // wait until all labeling requests finished
            await this._waitUntilLabelingFinish();
            this.navigation.navigate(FINISH_SCREEN);
            return;
        }

        this.setState({disabled: false});
    }

    render() {
        return (
            <View>
                <View>
                    <Text>Now labeled: {this.state.labeledNum}</Text>
                    <Text>Still unlabeled: {this.state.unlabeledNum}</Text>
                </View>

                <ImageSlide/>

                {   this.state.fetching &&
                    <View>
                        <Text>Fetching images from server to local</Text>
                        <ActivityIndicator/>
                    </View>
                }
                {   this.state.submittingLabeling &&
                    <View>
                        <Text>Submitting all labeling requests</Text>
                        <ActivityIndicator/>
                    </View>
                }
                <View>
                    <View style={{margin: 20}}>
                        <Button title='Good'
                                disabled={this.state.disabled}
                                onPress={() => this._startLabelImage(ImagePoolService.getCurImageName(), IMAGE_QUALITY_GOOD)}/>
                    </View>
                    <View style={{margin: 20}}>
                        <Button title='Bad'
                                disabled={this.state.disabled}
                                onPress={() => this._startLabelImage(ImagePoolService.getCurImageName(), IMAGE_QUALITY_BAD)} />
                    </View>
                    <View style={{margin: 20}}>
                        <Button title='Unknown'
                                disabled={this.state.disabled}
                                onPress={() => this._startLabelImage(ImagePoolService.getCurImageName(), IMAGE_QUALITY_UNKNOWN)} />
                    </View>
                </View>
            </View>
        );
    }
}

export default JudgeBoard;
