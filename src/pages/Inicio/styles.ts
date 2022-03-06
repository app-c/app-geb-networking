import {
    AntDesign,
    FontAwesome,
    FontAwesome5,
    Foundation,
    Ionicons,
    SimpleLineIcons,
} from "@expo/vector-icons";
import { he } from "date-fns/locale";
import { Dimensions } from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";
import theme from "../../global/styles/theme";

const { colors, fonts } = theme;
const { height, width } = Dimensions.get("screen");

export const Container = styled.View`
    flex: 1;
    background-color: ${colors.primary};
    padding: ${width / 15.5}px;
`;

export const Title = styled.Text`
    font-family: ${fonts.BarRegular};
    font-size: ${RFValue(20)}px;
    margin-left: 15px;
    color: ${colors.text};
`;

export const Box = styled.TouchableOpacity`
    flex-direction: row;
    padding: 10px;

    width: 100%;
    height: ${width * 0.12}px;
    align-items: center;
    /* background-color: red; */
    margin-bottom: ${RFPercentage(0.1)}px;
`;

export const Avatar = styled.Image`
    width: ${RFValue(150)}px;
    height: ${RFValue(150)}px;
    border-radius: ${RFValue(75)}px;
    align-self: center;
`;

export const BoxIco = styled.View`
    align-items: center;
    justify-content: center;
    background-color: ${theme.colors.focus_light};
    width: ${height * 0.15}px;
    height: ${height * 0.15}px;
    border-radius: ${RFValue(100)}px;
    align-self: center;
`;

export const TitleName = styled.Text`
    margin-top: ${width / 29}px;
    font-family: ${fonts.BarRegular};
    font-size: ${RFValue(26)}px;
    align-self: center;
    color: ${theme.colors.text};
`;

export const BoxPrice = styled.View.attrs({
    shadowColor: colors.focus,
    shadowOffset: {
        width: 0,
        height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
})`
    width: ${width * 0.5}px;
    height: ${width * 0.1}px;
    background-color: ${theme.colors.focus};
    align-self: center;
    justify-content: center;
    align-items: center;
    border-radius: ${RFValue(10)}px;
    margin-top: ${RFValue(15)}px;
    margin-bottom: ${RFValue(15)}px;
`;
export const TitlePrice = styled.Text`
    font-family: ${fonts.blac};
    font-size: ${RFValue(18)}px;
    color: ${theme.colors.text_secundary};
`;

export const Scroll = styled.ScrollView`
    padding: 20px 0;
`;

export const Line = styled.View.attrs({
    shadowColor: colors.focus,
    shadowOffset: {
        width: 0,
        height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
})`
    height: 2px;
    width: 80%;
    background-color: ${colors.text};
    align-self: center;
    margin-top: ${width / 29}px;
    margin-bottom: ${width / 20}px;
`;

export const IConSimple = styled(SimpleLineIcons)`
    font-size: ${width / 16}px;
`;

export const IconIoncic = styled(Ionicons)`
    font-size: ${width / 16}px;
`;

export const IconAnt = styled(AntDesign)`
    font-size: ${width / 16}px;
`;

export const IconFont = styled(FontAwesome5)`
    font-size: ${width / 16}px;
`;

export const IconFoundation = styled(Foundation)`
    font-size: ${width / 16}px;
`;

export const FontAwes = styled(FontAwesome)`
    font-size: ${width / 16}px;
`;
