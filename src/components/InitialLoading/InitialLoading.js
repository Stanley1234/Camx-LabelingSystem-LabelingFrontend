import React, {Component} from "react"
import {DEFAULT_NAMELIST_END, DEFAULT_NAMELIST_START, INITIAL_IMAGES_DOWNLOAD_SIZE} from "../../configs/Fetch";
import * as ImageFetchUtils from "../../libs/ImageFetchUtils";
import {FINISH_SCREEN, LABELING_SCREEN} from "../../configs/Route";
import {ActivityIndicator, Button, Text, TextInput, View} from "react-native";

export default class InitialLoading extends Component {

    constructor(props) {
        super(props);

        this.namesList = [];
        this.imagesBodiesList = [];
        this.navigation = this.props.navigation;

        this.state = {
            start: DEFAULT_NAMELIST_START,
            end: DEFAULT_NAMELIST_END,
            alert: false,
            fetching: false
        };

        this._startLabeling = this._startLabeling.bind(this);
    }

    async _prefetchNames() {
        const accept = (namesList) => {
            this.namesList = namesList;

            console.log(`Fetching name list of length ${this.namesList.length}`);
        };

        const reject = (msg) => {
            console.log(msg);
        };

        await ImageFetchUtils.fetchNamesWithRange(this.state.start, this.state.end, accept, reject);
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

        await this._prefetchImages();
    }

    _isIllegalArgs() {
        return this.state.end < this.state.start
        || this.state.end < 0 || this.state.start < 0;
    }

    async _startLabeling() {
        if (this._isIllegalArgs()) {
            this.setState({alert: true});
            return;
        }
        this.setState({alert: false, fetching: true});

        await this._prefetch();

        this.navigation.navigate(LABELING_SCREEN, {
            initialImageBodies: this.imagesBodiesList,
            initialNameList: this.namesList
        });
    }

    _setStart(text) {
        const num = Number.parseInt(text);
        this.setState({start: num});
    }

    _setEnd(text) {
        const num = Number.parseInt(text);
        this.setState({end: num});
    }

    render() {
        return (
            <View style={{padding: 10}}>
                <View>
                    <Text>Start:</Text>
                    <TextInput
                        onChangeText={(text) => this._setStart(text)}
                        value={`${this.state.start}`}
                    />
                </View>

                <View>
                    <Text>End:</Text>
                    <TextInput
                        onChangeText={(text) => this._setEnd(text)}
                        value={`${this.state.end}`}
                    />
                </View>

                <View>
                    <Button
                        title="Start"
                        disabled={this.state.fetching}
                        onPress={this._startLabeling}>
                    </Button>
                </View>

                {
                    this.state.alert &&
                    <Text style={{color: 'red'}}>Illegal arguments for start and end</Text>
                }

                {   this.state.fetching &&
                    <View>
                        <Text>Pre-fetching images from server</Text>
                        <ActivityIndicator/>
                    </View>
                }
            </View>
        );
    }
}
