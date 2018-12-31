import React, {Component} from "react"
import {Button, Text, View} from "react-native";
import {INITIAL_SCREEN} from "../../utils/Constants";

class FinishScene extends Component {

    constructor(props) {
        super(props);

        this.restart = this.restart.bind(this);
    }

    restart() {
        this.props.navigation.navigate(INITIAL_SCREEN);
    }

    render() {
        return (
            <View>
                <Text>You have labeled all images!</Text>
                <Button
                    title="restart"
                    onPress={this.restart}
                />
            </View>
        );
    }

}

export default FinishScene;
