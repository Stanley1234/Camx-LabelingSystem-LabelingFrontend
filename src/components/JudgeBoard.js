import React, {Component} from "react"
import {Button, Text, View} from "react-native";
import {
    IMAGE_QUALITY_BAD,
    IMAGE_QUALITY_GOOD,
    IMAGE_QUALITY_UNKNOWN,
    INITIAL_IMAGEBODIES,
    NAME,
    QUALITY
} from "../utils/Constants";
import * as ImageFetchUtils from "../utils/ImageFetchUtils";
import ImagePoolService from "./ImagePoolService";

class JudgeBoard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            labeledNum: 0,
            unlabeledNum: 0
        };

        console.debug("Judge board: " + this.props[INITIAL_IMAGEBODIES] );

        this.imagePoolService = React.createRef();
        this._downloadOneImages = this._downloadOneImages.bind(this);
    }

    _fetchCount() {
        const accept = (unlabeledCount, labeledCount) => {
            let stateCopy = this.state;
            stateCopy.labeledNum = unlabeledCount;
            stateCopy.unlabeledNum = labeledCount;
            this.setState(stateCopy);
        };

        const reject = (err1, err2) => {
            console.log(`fetching unlabeled: ${err1}`);
            console.log(`fetching labeled: ${err2}`);
        };

        ImageFetchUtils.fetchCountOfLabeledAndUnlabeled(accept, reject);
    }

    _fetchImages() {
        const accept = (imageBody) => {
            this.imagePoolService.current.addImage([imageBody]);
        };

        ImageFetchUtils.downloadOneImage(accept);
    }

    _downloadOneImages() {
        this._fetchCount();
        this._fetchImages();
    }

    _labelImage(name, quality) {
        const imageMeta = {
            [NAME]: name,
            [QUALITY]: quality
        };
        const accept = (msg) => {
            console.log(msg);
        };
        const reject = (err) => {
            console.error(err);
        };

        // send request to server
        ImageFetchUtils.labelImage(imageMeta, accept, reject);

        // download one more image
        this._downloadOneImages();

        this.imagePoolService.current.nextImage();
    }

    render() {
        let curImageName = this.imagePoolService.current.getCurImageName();
        if (curImageName === null) {
            curImageName = '';
        }

        return (
            <View>
                <View>
                    <Text>Now labeled: {this.state.labeledNum}</Text>
                    <Text>Still unlabeled: {this.state.unlabeledNum}</Text>
                </View>

                <ImagePoolService
                    initialImageBodies = {this.props[INITIAL_IMAGEBODIES]}
                    ref = {this.imagePoolService}
                />

                <View>
                    <Button title='Good' onPress={() => this._labelImage(curImageName, IMAGE_QUALITY_GOOD)}/>
                    <Button title='Bad' onPress={() => this._labelImage(curImageName, IMAGE_QUALITY_BAD)} />
                    <Button title='Unknown' onPress={() => this._labelImage(curImageName, IMAGE_QUALITY_UNKNOWN)} />
                </View>
            </View>
        );
    }
}

export default JudgeBoard;
