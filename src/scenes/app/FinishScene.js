import React, {Component} from "react"
import {View} from "react-native";
import FinishLabeling from "../../components/FinishLabeling";

class FinishScene extends Component {
    render() {
        return (
            <View>
                <FinishLabeling
                    navigation = {this.props.navigation}
                />
            </View>
        );
    }
}

export default FinishScene;
