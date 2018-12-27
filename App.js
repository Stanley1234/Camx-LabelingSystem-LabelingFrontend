import React, {Component} from 'react';
import JudgeBoard from "./src/components/JudgeBoard";
import {View} from "react-native";

export default class App extends Component {
    render() {
        return (
            <View>
                <JudgeBoard/>
            </View>
        );
    }
}
