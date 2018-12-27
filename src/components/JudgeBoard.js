import React, {Component} from "react"
import {Button, Image, Text, View} from "react-native";
import {
    COUNT_LABELED_URI,
    COUNT_UNLABELED_URI,
    DOWNLOAD_URI,
    generateLabelUri,
    IMAGE_QUALITY_BAD,
    IMAGE_QUALITY_GOOD,
    IMAGE_QUALITY_UNKNOWN
} from "../utils/Constants";

class JudgeBoard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            curImageName: null,
            curImageBuffer: null,
            labeledNum: 0,
            unlabeledNum: 0
        };

        this.labelImage = this.labelImage.bind(this);
    }

    async fetchImage() {
        try {
            const unlabeledResponse = await fetch(COUNT_UNLABELED_URI, {method: 'get'});
            const unlabeledResJson = await unlabeledResponse.json();

            if (unlabeledResponse.status !== 200) {
                // fatal unknown error
                alert(`Fatal unknown error when checking number of unlabeled images: ${unlabeledResJson.error}`);
            }

            const labeledResponse = await fetch(COUNT_LABELED_URI, {method: 'get'});
            const labeledResJson = await labeledResponse.json();

            if (labeledResponse.status !== 200) {
                // fatal unknown error
                alert(`Fatal unknown error when checking number of labeled images:${labeledResJson.error} `);
            }

            let stateCopy = this.state;
            stateCopy.labeledNum = labeledResJson.number;
            stateCopy.unlabeledNum = unlabeledResJson.number;

            this.setState(stateCopy);

            if (unlabeledResponse.number === 0) {
                return;
            }

        } catch (e) {
            alert(`Fatal unknown error when checking number of unlabeled images. Error message: ${e}`);
        }

        try {
            const downloadResponse = await fetch(DOWNLOAD_URI, {method: 'get'});
            const downloadResJson = await downloadResponse.json();

            if (downloadResponse.status !== 200) {
                alert(`Error when retrieving image. Error message: ${downloadResJson.error}`);
            }

            const name = downloadResJson.name;
            const buffer = downloadResJson.buffer;

            let stateCopy = this.state;
            stateCopy.curImageName = name;
            stateCopy.curImageBuffer = buffer;
            this.setState(stateCopy);

        } catch (e) {
            alert(`Error when retrieving image. Error message: ${e}`);
        }
    }

    componentDidMount() {
        this.fetchImage();
    }

    async labelImage(name, quality) {
        try {
            let labelResponse = await fetch(generateLabelUri(name, quality), {method: 'put'});
            if (labelResponse.status !== 200) {
                alert('Error when labeling image');
            }
        } catch (e) {
            alert(`Error when labeling image: ${e}`);
        }
        this.fetchImage();
    }

    reload() {
        this.fetchImage();
    }

    render() {
        let imageSrc = {uri: `data:image/jpeg;base64,${this.state.curImageBuffer}`};

        if (this.state.unlabeledNum === 0) {
            imageSrc = {};
        }

        return (
            <View>
                <View>
                    <Text>{this.state.curImageName}</Text>
                    <Text>Now labeled: {this.state.labeledNum}</Text>
                    <Text>Still unlabeled: {this.state.unlabeledNum}</Text>
                    <Image
                        style={{
                            left:30,
                            width:300, height: 300,
                            borderWidth: 1, borderColor: 'red'
                        }}
                        source={imageSrc}
                    />
                </View>

                <View>
                    <Button title='Good' onPress={() => this.labelImage(this.state.curImageName, IMAGE_QUALITY_GOOD)}/>
                    <Button title='Bad' onPress={() => this.labelImage(this.state.curImageName, IMAGE_QUALITY_BAD)} />
                    <Button title='Unknown' onPress={() => this.labelImage(this.state.curImageName, IMAGE_QUALITY_UNKNOWN)} />
                </View>

                <View>
                    <Button title='reload' onPress={this.reload.bind(this)}/>
                </View>
            </View>
        );
    }
}

export default JudgeBoard;
