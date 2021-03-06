import {InitialLoadingScreen} from "./InitialLoadingScreen";
import LabelingScreen from "./LabelingScreen";
import {createAppContainer, createSwitchNavigator} from "react-navigation";
import FinishScene from "./FinishScene";
import {FINISH_SCREEN, INITIAL_SCREEN, LABELING_SCREEN} from "../../configs/Route";


const ROUTE_CONFIG = {
    [INITIAL_SCREEN]: {
        screen: InitialLoadingScreen
    },
    [LABELING_SCREEN]: {
        screen: LabelingScreen
    },
    [FINISH_SCREEN]: {
        screen: FinishScene
    }
};

const SWITCH_NAVIGATOR_CONFIG = {
    initialRouteName: INITIAL_SCREEN
};

const switchNavigator = createSwitchNavigator(ROUTE_CONFIG, SWITCH_NAVIGATOR_CONFIG);

export default createAppContainer(switchNavigator);

