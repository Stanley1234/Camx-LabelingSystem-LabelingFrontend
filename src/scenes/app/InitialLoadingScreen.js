import React, {Component} from "react"
import {View} from "react-native";
import InitialLoading from "../../components/InitialLoading";

export class InitialLoadingScreen extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View>
                <InitialLoading
                    navigation={this.props.navigation}
                />
            </View>
        );
    }
}
