import React, {Component} from "react";
import {Button, Text, View} from "react-native";
import {INITIAL_SCREEN} from "../../configs/Route";

class FinishLabeling extends Component {

    constructor(props) {
        super(props);

        this.navigation = this.props.navigation;
        this.restart = this.restart.bind(this);
    }

    restart() {
        this.navigation.navigate(INITIAL_SCREEN);
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

export default FinishLabeling;
