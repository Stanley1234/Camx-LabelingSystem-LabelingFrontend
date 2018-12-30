import {InitialLoadingScreen} from "./InitialLoadingScreen";
import LabelingScreen from "./LabelingScreen";
import {createSwitchNavigator} from "react-navigation";

const ROUTE_CONFIG = {
    INITIAL: {
        screen: InitialLoadingScreen
    },
    LABELING: {
        screen: LabelingScreen
    }
};

const SWITCH_NAVIGATOR_CONFIG = {
    initialRouteName: "Initial"
};

export default createSwitchNavigator(ROUTE_CONFIG, SWITCH_NAVIGATOR_CONFIG);

