import React, {Component} from "react"
import JudgeBoard from "../../components/JudgeBoard";
import {INITIAL_IMAGEBODIES} from "../../utils/Constants";

export default class LabelingScreen extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
           <JudgeBoard
               initialImageBodies = {this.props.navigation.state.params[INITIAL_IMAGEBODIES]}
               navigation = {this.props.navigation}
           />
        )
    }
}
