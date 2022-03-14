/* eslint-disable no-alert */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { AntDesign, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import storage, {
  getBytes,
  getDownloadURL,
  getStorage,
  ref,
  updateMetadata,
  uploadBytes,
  uploadBytesResumable,
  uploadString,
} from "firebase/storage";
import store, { addDoc, collection, getFirestore } from "firebase/firestore";
import {
  launchImageLibraryAsync,
  MediaTypeOptions,
  requestMediaLibraryPermissionsAsync,
} from "expo-image-picker";

import {
  Box,
  BoxAvatar,
  BoxImage,
  BoxInput,
  ButonImage,
  Button,
  Container,
  Header,
  Image,
  Input,
  TexBoton,
  Titl,
} from "./styled";
import { useAuth } from "../../hooks/AuthContext";
import { Loading } from "../../components/Loading";
import { HeaderContaponent } from "../../components/HeaderComponent";
import { colecao } from "../../collection";
import { api } from "../../vervices/api";
import { buck, db } from "../../config";

export function Post() {
  const { goBack } = useNavigation();
  const { user } = useAuth();

  const [img, setImage] = useState("of");
  const [descricao, setDescricao] = useState("");
  const [load, setLoad] = useState(false);

  // const db = getFirestore();
  const colect = collection(db, colecao.post);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const ImagePicker = useCallback(async () => {
    const { status } = await requestMediaLibraryPermissionsAsync();

    // alert("Permission to access camera roll is required!");
    if (status === "granted") {
      const result = await launchImageLibraryAsync({
        mediaTypes: MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.cancelled) {
        setImage(result.uri);
      }
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (img === "of") {
      Alert.alert("Erro", "Escolha uma imagem para realizar o post");
      return;
    }
    setLoad(true);

    const data = new FormData();
    data.append("post", {
      type: "image/jpg",
      name: `${user.id}.jpg`,
      uri: img,
    });

    await api.patch("post", data).then(h => {
      addDoc(colect, {
        nome: user.nome,
        avater: user.avatarUrl,
        descricao,
        post: h.data,
        like: 0,
      });
      setLoad(false);
      Alert.alert("Post", "post criado com sucesso!");
      goBack();
    });
  }, [colect, descricao, goBack, img, user.avatarUrl, user.id, user.nome]);

  return (
    <Container>
      <HeaderContaponent title="Post" type="tipo1" onMessage="on" />
      <Box>
        <BoxInput>
          <Input onChangeText={setDescricao} placeholder="Descrição do poste" />
        </BoxInput>

        <ButonImage onPress={ImagePicker}>
          <TexBoton style={{ fontSize: RFValue(16) }}>Escolher image</TexBoton>
        </ButonImage>

        <BoxImage>
          {img === "of" && <Feather name="image" size={100} />}
          {img !== "of" && (
            <Image style={{ resizeMode: "contain" }} source={{ uri: img }} />
          )}
        </BoxImage>

        <Button enabled={!load} onPress={handleSubmit}>
          {load ? <Loading /> : <TexBoton>Criar</TexBoton>}
        </Button>
      </Box>
    </Container>
  );
}
