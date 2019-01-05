import React, {Component} from "react"
import JudgeBoard from "../../components/JudgeBoard";
import {View} from "react-native";

export default class LabelingScreen extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View>
               <JudgeBoard
                   initialImageBodies = {this.props.navigation.state.params.initialImageBodies}
                   initialNameList = {this.props.navigation.state.params.initialNameList}
                   navigation = {this.props.navigation}
               />
            </View>
        )
    }
}
