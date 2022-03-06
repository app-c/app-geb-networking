import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";
import theme from "../../global/styles/theme";

const { colors, fonts } = theme;
export const Container = styled.View`
    flex: 1;
    background-color: ${colors.primary};
`;

export const Title = styled.Text`
    font-family: ${fonts.blac};
    font-size: ${RFValue(18)}px;
    color: ${colors.text_secundary};
`;

export const BoxAvatar = styled.Image`
    width: ${RFPercentage(12)}px;
    height: ${RFPercentage(12)}px;
    background-color: ${colors.secundary};
    border-radius: ${RFPercentage(6)}px;
    margin-top: 20px;
    align-self: center;
`;

export const BoxEventos = styled.View`
    padding: 0 10px;
    margin-top: ${RFPercentage(5)}px;
`;

export const BoxContainer = styled.View`
    width: 70%;
    height: ${RFPercentage(6)}px;
    background-color: ${colors.focus};
    align-items: flex-start;
    justify-content: center;
    padding: 0 20px;
    border-radius: 8px;
`;

export const BoxPosition = styled.View`
    width: 20%;
    height: ${RFPercentage(6)}px;
    background-color: ${colors.focus};
    align-items: center;
    justify-content: center;
    border-radius: 8px;
`;
