import {Image, View} from "react-native";
import React, {Component} from "react"
import * as UriUtils from "../../libs/UriUtils";
import {BUFFER, NAME} from "../../configs/Field";
import * as ImagePoolService from "./ImagePoolService";

class ImageSlide extends Component {

    constructor(props) {
        super(props);

        console.log("Calling constructor ImagePoolService completes");
    }

    render() {
        const curImageBody = ImagePoolService.getCurImageBody();

        // render nothing if no images are available
        if (curImageBody === null) {
            return (<View/>);
        }

        const prefix = UriUtils.generateBase64ImagePrefix(curImageBody[NAME]);
        return (
            <View>
                <Image
                    source = {{uri: `${prefix}${curImageBody[BUFFER]}`}}
                    style = {{width: 300, height: 150}}
                />
            </View>
        );
    }
}

export default ImageSlide;
