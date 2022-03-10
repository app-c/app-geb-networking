/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import { AntDesign, Feather, FontAwesome } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { RFValue } from "react-native-responsive-fontsize";
import { Alert, ScrollView, Text, TextInput, View } from "react-native";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import store, { addDoc, collection, getFirestore } from "firebase/firestore";
import AppLoading from "expo-app-loading";
import {
  Avatar,
  Box,
  BoxAvatar,
  Boxcons,
  BoxElement,
  BoxInput,
  BoxProvider,
  Buton,
  Container,
  ContainerInput,
  ImageOfice,
  ImageProviderOfice,
  InputText,
  Title,
} from "./styles";
import theme from "../../global/styles/theme";
import { useAuth } from "../../hooks/AuthContext";
import { IUserDto } from "../../DtosUser";
import { HeaderContaponent } from "../../components/HeaderComponent";
import { Loading } from "../../components/Loading";
import { colecao } from "../../collection";

interface IRoute {
  prestador_id: string;
  avatar_url: string;
  avatar: string | null;
  logoUrl: string;
  nome: string;
  workName: string;
}

export function Transaction() {
  const { navigate, reset } = useNavigation();
  const moneyRef = useRef(null);
  const { user } = useAuth();
  const route = useRoute();
  const { prestador_id, avatar_url, nome, workName, logoUrl } =
    route.params as IRoute;

  const [value, setValue] = useState("");
  const [prestador, setPrestador] = useState<IUserDto>();
  const [description, setDescription] = useState("");
  const [mon, setMon] = useState(0);

  const db = getFirestore();
  const colect = collection(db, colecao.orderTransaction);

  const navigateToOk = useCallback(async () => {
    if (mon === 0) {
      Alert.alert("Transação", "informe o valor que foi consumido");
      return;
    }

    if (!description) {
      Alert.alert("Transação", "informe uma descrição ");
      return;
    }

    const { nome, workName } = user;

    addDoc(colect, {
      prestador_id,
      consumidor: user.id,
      valor: String(mon),
      description,
      nome: user.nome,
      data: new Date(Date.now()),
    }).catch(err => console.log(err));

    navigate("sucess", { workName, description, nome });
  }, [description, mon, navigate, prestador_id, user]);

  useEffect(() => {
    const mo = moneyRef.current?.getRawValue();
    setMon(mo);
  }, [value]);

  return (
    <Container>
      <HeaderContaponent type="tipo1" title="" onMessage="of" />
      <Box>
        <Title style={{ marginBottom: 30, textAlign: "center" }}>
          Vocẽ está consumindo de: {nome}, da empresa {workName}
          {prestador?.workName}
        </Title>
        <BoxElement>
          <BoxAvatar>
            {user.avatarUrl ? (
              <Avatar source={{ uri: user.avatarUrl }} />
            ) : (
              <Feather name="user" size={60} color={theme.colors.focus} />
            )}

            {user.logoUrl ? (
              <ImageOfice source={{ uri: user.logoUrl }} />
            ) : (
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: theme.colors.focus,
                  alignSelf: "flex-end",
                }}
              />
            )}
          </BoxAvatar>

          <Boxcons>
            <AntDesign
              style={{ left: -30, position: "absolute" }}
              name="caretright"
              size={RFValue(18)}
            />
            <Title style={{ fontSize: 14 }}>R${value}</Title>
            <AntDesign
              style={{ right: -30, position: "absolute" }}
              name="caretright"
              size={RFValue(18)}
            />
          </Boxcons>

          <BoxProvider>
            {avatar_url ? (
              <Avatar source={{ uri: avatar_url }} />
            ) : (
              <Feather name="user" size={85} color={theme.colors.focus} />
            )}

            {logoUrl ? (
              <ImageProviderOfice source={{ uri: logoUrl }} />
            ) : (
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: theme.colors.focus,
                  alignSelf: "flex-start",
                }}
              />
            )}
          </BoxProvider>
        </BoxElement>
      </Box>

      <ScrollView>
        <View style={{ paddingBottom: 50 }}>
          <BoxInput
            style={{
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowOpacity: 0.57,
              shadowRadius: 4.65,

              elevation: 6,
            }}
          >
            <ContainerInput style={{ height: RFValue(100) }}>
              <Text style={{ alignSelf: "flex-end" }}>
                {description.length}/14
              </Text>
              <InputText
                type="custom"
                options={{
                  mask: "**************",
                }}
                multiline
                value={description}
                placeholder="Digite o produto/serviço a ser consumido"
                onChangeText={h => setDescription(h)}
              />
            </ContainerInput>

            <ContainerInput style={{ marginTop: RFValue(50) }}>
              <InputText
                type="money"
                options={{
                  precision: 2,
                  separator: ".",
                  delimiter: ",",
                  unit: "",
                }}
                keyboardType="numeric"
                onChangeText={text => setValue(text)}
                multiline
                value={value}
                placeholder="Valor consumido R$"
                ref={moneyRef}
              />
            </ContainerInput>
          </BoxInput>

          <Buton onPress={navigateToOk}>
            <Title style={{ color: theme.colors.text_secundary }}>Enviar</Title>
          </Buton>
        </View>
      </ScrollView>
    </Container>
  );
}
