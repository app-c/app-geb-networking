/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-alert */
/* eslint-disable camelcase */
import { AntDesign, Feather } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { FormHandles } from "@unform/core";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import { Modalize } from "react-native-modalize";
import { Form } from "@unform/mobile";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  uploadString,
} from "firebase/storage";
import storage, {
  collection,
  doc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import * as ImagePiker from "expo-image-picker";
import theme from "../../global/styles/theme";
import { useAuth } from "../../hooks/AuthContext";
import {
  Avatar,
  Box,
  BoxButton,
  BoxCamera,
  BoxFormularios,
  BoxHeader,
  BoxInput,
  BoxLogo,
  BoxTogle,
  Camera,
  Container,
  FlatLink,
  InpuMask,
  LogoImage,
  TextTogle,
  TitleButton,
  TitleHeader,
} from "./styles";
import { ToglleRamo } from "../../components/ToglleRamo";
import { IUserDto } from "../../DtosUser";
import { InputCasdastro } from "../../components/InputsCadastro";
import { Loading } from "../../components/Loading";
import { LinksComponents } from "../../components/LinksComponents";
import { Input } from "../../components/Inputs";
import { HeaderContaponent } from "../../components/HeaderComponent";
import { ToglleEnquadramento } from "../../components/ToglleEnquadramento";
import { FindUser } from "../FindMembro";
import { api } from "../../vervices/api";

export interface Props {
  id: string;
  nome: string;
  sobrenome: string;
  whats: number;
  workName: string;
  CNPJ: number;
}

interface Res {
  avatarUrl: string;
  logoUrl: string;
  user: IUserDto;
}

interface ITypes {
  type: "custom" | "cpf";
}

export function Profile() {
  const { user, updateUser, signOut } = useAuth();
  const { navigate } = useNavigation();
  const formRef = useRef<FormHandles>(null);
  const modalizeRefRamo = useRef<Modalize>(null);
  const modalizeRefEnquadramento = useRef<Modalize>(null);

  const [loading, setLoading] = useState(true);

  // TODO USER
  const [avatar, serAvatar] = useState<any>(user.avatarUrl);
  const [logo, setLogo] = useState<any>();

  // TODO FORMULARIOS
  const [nome, setNome] = useState(user.nome);
  const [whats, setWhats] = useState("");
  const [email, setEmail] = useState("");
  const [workName, setWorkName] = useState("");
  const [CPF, setCpf] = useState(user.CPF);
  const [cnpj, setCnpj] = useState(user.CNPJ);
  const [linkW, setLinkW] = useState(user.links[0]);
  const [linkF, setLinkF] = useState(user.links[1]);
  const [linkI, setLinkI] = useState(user.links[2]);
  const [linkMaps, setLinkMaps] = useState(user.links[3]);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [logoUrl, setLogorUrl] = useState(user.logoUrl);
  const [uri, setUri] = useState("");

  // TODO MODAL
  const [ramo, setRamo] = useState(user.ramo);
  const [enquadramento, setEnquadramento] = useState(user.enquadramento);
  const [modal, setModal] = useState(false);

  const db = getFirestore();
  const dbStorage = getStorage();
  const colectUsers = collection(db, "users");

  const handleModalOpenRamo = useCallback(() => {
    modalizeRefRamo.current?.open();
    setModal(!modal);
  }, [modal]);

  const handleModalOpenEnquadramento = useCallback(() => {
    modalizeRefEnquadramento.current?.open();
  }, []);

  const SelectItemRamo = useCallback(
    (item: string) => {
      setRamo(item);
      setModal(!modal);

      modalizeRefRamo.current?.close();
    },
    [modal],
  );

  const SelectItemEnquadramento = useCallback((item: string) => {
    setEnquadramento(item);
    modalizeRefEnquadramento.current?.close();
  }, []);

  useEffect(() => {
    setEmail(user.email);
    setWhats(user.whats);
    setWorkName(user.workName);
    setCnpj(String(user.CNPJ));
    setCpf(String(user.CPF));
    setLinkW(user.links[0] ? user.links[0] : "");
    setLinkF(user.links[1] ? user.links[1] : "");
    setLinkI(user.links[2] ? user.links[2] : "");
    setLinkMaps(user.links[3] ? user.links[3] : "");
  }, [user.CNPJ, user.CPF, user.email, user.links, user.whats, user.workName]);

  const handleImagePiker = useCallback(async () => {
    setLoading(true);
    const permissionResult =
      await ImagePiker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePiker.launchImageLibraryAsync({
      mediaTypes: ImagePiker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (result.cancelled) {
      setLoading(false);
    }

    if (!result.cancelled) {
      const img = result.uri;
      const data = new FormData();
      data.append("avatar", {
        type: "image/jpg",
        name: `${user.id}.jpg`,
        uri: img,
      });
      await api.patch("user/avatar", data).then(h => {
        setAvatarUrl(h.data);
        setLoading(false);
      });
    }
  }, [user.id]);

  const handleLogo = useCallback(async () => {
    setLoading(true);
    const { status } = await ImagePiker.requestMediaLibraryPermissionsAsync();

    // alert("Permission to access camera roll is required!");
    if (status === "granted") {
      const result = await ImagePiker.launchImageLibraryAsync({
        mediaTypes: ImagePiker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.cancelled) {
        const img = result.uri;
        const data = new FormData();
        data.append("logo", {
          type: "image/jpg",
          name: `${user.id}.jpg`,
          uri: img,
        });
        await api.patch("user/logo", data).then(h => {
          setLogorUrl(h.data);
          setLoading(false);
        });
      }
    }

    setLoading(false);
  }, []);

  const handleSubmit = useCallback(async () => {
    formRef.current?.setErrors({});

    const formData = {
      id: user.id,
      nome,
      adm: user.adm,
      whats: String(whats),
      workName,
      CNPJ: String(cnpj),
      CPF: String(CPF),
      email,
      ramo,
      enquadramento,
      padrinhQuantity: user.padrinhQuantity,
      links: [linkF, linkI, linkMaps],
      avatarUrl,
      logoUrl,
    };

    const ref = doc(colectUsers, user.id);

    updateDoc(ref, {
      id: user.id,
      nome,
      adm: user.adm,
      whats: String(whats),
      workName,
      CPF: String(CPF),
      CNPJ: String(cnpj),
      email,
      ramo,
      enquadramento,
      links: [linkF, linkI, linkMaps],
      avatarUrl,
      logoUrl,
    })
      .finally(() => updateUser(formData))

      .catch(err => console.log(err.code));

    Alert.alert("Perfil alterado com sucesso!");
    navigate("Inicio");
  }, [
    CPF,
    avatarUrl,
    cnpj,
    email,
    enquadramento,
    linkF,
    linkI,
    linkMaps,
    logoUrl,
    navigate,
    nome,
    ramo,
    updateUser,
    user.adm,
    user.id,
    user.padrinhQuantity,
    whats,
    workName,
  ]);

  return (
    <Container>
      <Modalize ref={modalizeRefRamo} snapPoint={530}>
        <ToglleRamo selectItem={(item: string) => SelectItemRamo(item)} />
      </Modalize>

      <Modalize ref={modalizeRefEnquadramento} snapPoint={530}>
        <ToglleEnquadramento
          selectItem={(item: string) => SelectItemEnquadramento(item)}
        />
      </Modalize>
      <HeaderContaponent type="tipo1" title="MEU PERFIL" onMessage="of" />

      <View
        style={{
          height: RFPercentage(80),
        }}
      >
        <ScrollView
          contentContainerStyle={{
            paddingTop: RFValue(10),
            paddingBottom: RFValue(30),
          }}
        >
          <Box>
            <Avatar
              style={{ resizeMode: "cover" }}
              source={{ uri: avatarUrl }}
            />
            <BoxCamera onPress={handleImagePiker}>
              <Camera name="camera" />
            </BoxCamera>
          </Box>

          <Form
            initialData={{
              nome: user.nome,
              email: user.email,
              workName: user.workName,
            }}
          >
            <BoxFormularios>
              <BoxInput>
                <TitleHeader style={{ right: 10 }}>NOME</TitleHeader>
                <InputCasdastro
                  icon=""
                  name="nome"
                  autoCapitalize="words"
                  type="custom"
                  options={{
                    mask: "***********************************",
                  }}
                  onChangeText={h => setNome(h)}
                  value={nome}
                />
              </BoxInput>

              <BoxInput>
                <TitleHeader style={{ right: 10 }}>E-MAIL</TitleHeader>
                <InputCasdastro
                  name="email"
                  icon=""
                  autoCapitalize="none"
                  type="custom"
                  keyboardType="email-address"
                  options={{
                    mask: "**************************",
                  }}
                  onChangeText={h => setEmail(h)}
                  value={email}
                />
              </BoxInput>

              <BoxInput>
                <TitleHeader style={{ right: 10 }}>WHATS</TitleHeader>
                <InputCasdastro
                  name="whats"
                  icon=""
                  type="cel-phone"
                  onChangeText={(mask, unmas) => {
                    setWhats(mask);
                    console.log(mask);
                  }}
                  value={whats!}
                />
              </BoxInput>

              <BoxInput>
                <TitleHeader style={{ right: 10 }}>RAZÃO SOCIAL</TitleHeader>
                <InputCasdastro
                  name="workName"
                  icon=""
                  autoCapitalize="none"
                  type="custom"
                  options={{
                    mask: "**************************",
                  }}
                  onChangeText={h => setWorkName(h)}
                  value={workName!}
                />
              </BoxInput>
            </BoxFormularios>
            <BoxFormularios>
              <BoxInput>
                <TitleHeader style={{ right: 10 }}>CPF</TitleHeader>
                <InputCasdastro
                  name="cpf"
                  icon=""
                  type="cpf"
                  onChangeText={h => setCpf(h)}
                  value={String(CPF)}
                />
              </BoxInput>

              <BoxInput>
                <TitleHeader style={{ right: 10 }}>CNPJ</TitleHeader>
                <InputCasdastro
                  type="cnpj"
                  name="cnpj"
                  icon=""
                  onChangeText={h => setCnpj(h)}
                  value={String(cnpj)}
                />
              </BoxInput>

              <View
                style={{
                  alignSelf: "flex-start",
                  marginLeft: 20,
                  marginTop: 20,
                  marginBottom: 20,
                }}
              >
                <TitleHeader>RAMO DE ATIVIDADE</TitleHeader>
                <BoxTogle onPress={handleModalOpenRamo}>
                  <TextTogle>{ramo}</TextTogle>
                  <AntDesign
                    name="caretdown"
                    size={25}
                    color={theme.colors.focus}
                  />
                </BoxTogle>
              </View>

              <View
                style={{
                  alignSelf: "flex-start",
                  marginLeft: 20,
                  marginTop: 20,
                }}
              >
                <TitleHeader>ENQUADRAMENTO</TitleHeader>
                <BoxTogle onPress={handleModalOpenEnquadramento}>
                  <TextTogle>{enquadramento}</TextTogle>
                  <AntDesign
                    name="caretdown"
                    size={25}
                    color={theme.colors.focus}
                  />
                </BoxTogle>
              </View>
            </BoxFormularios>
            <BoxFormularios>
              <TitleHeader>LINK WHATS</TitleHeader>
              <Input
                value={linkW}
                onChangeText={h => setLinkW(h)}
                name="whatLind"
                icon=""
              />

              <TitleHeader>LINK FACE</TitleHeader>
              <Input
                value={linkF}
                onChangeText={h => setLinkF(h)}
                name="linkFace"
                icon=""
              />

              <TitleHeader>LINK INSTA</TitleHeader>
              <Input
                value={linkI}
                onChangeText={h => setLinkI(h)}
                name="linkInsta"
                icon=""
              />

              <TitleHeader>LINK ENDEREÇO</TitleHeader>
              <Input
                value={linkMaps}
                onChangeText={h => setLinkMaps(h)}
                name="linkMap"
                icon=""
              />
            </BoxFormularios>
          </Form>

          <View
            style={{
              flexDirection: "row",
            }}
          >
            <BoxLogo>
              <TitleButton style={{ textAlign: "center" }}>
                LOGO EMPRESA
              </TitleButton>
              <LogoImage source={{ uri: logoUrl }} />
            </BoxLogo>
            <TouchableOpacity
              onPress={handleLogo}
              style={{ top: RFPercentage(10), marginLeft: 20 }}
            >
              <TitleHeader>ALTERAR LOGO</TitleHeader>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <BoxButton onPress={handleSubmit}>
        <TitleButton>Alterar</TitleButton>
      </BoxButton>
    </Container>
  );
}
