/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable camelcase */
import React, { useCallback, useState } from "react";
import { AntDesign, Feather } from "@expo/vector-icons";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Image, Modal, TouchableOpacity, View } from "react-native";
import { collection, getFirestore, onSnapshot } from "firebase/firestore";
import {
  Avatar,
  BoxAvatar,
  BoxMail,
  Circle,
  Container,
  Header,
  TextCircli,
  Title,
  TitleHeader,
} from "./styles";
import { useAuth } from "../../hooks/AuthContext";
import theme from "../../global/styles/theme";
import { Menssage } from "../Message";
import logo1 from "../../assets/logo1.png";
import logo from "../../assets/logo.png";

interface Props {
  title: string;
  onMessage: "on" | "of";
  type: "tipo1" | "tipo2" | "tipo3";
}

interface Res {
  prestador_id: string;
  consumidor: string;
  valor: string;
  descricao: string;
  nome: string;
}
export function HeaderContaponent({ title, onMessage, type }: Props) {
  const { user } = useAuth();
  const { navigate } = useNavigation();

  const [response, setResponse] = useState<Response>();
  const [trans, setTrans] = useState<Res[]>([]);
  const [modal, setModal] = useState(false);
  const [count, setCount] = useState(0);
  const [rece, setRece] = useState("");

  const handlePres = React.useCallback(() => {
    navigate("Inicio");
  }, [navigate]);

  const getTransaction = useCallback(async () => {
    const db = getFirestore();
    const colecao = collection(db, "order_transaction");

    const load = onSnapshot(colecao, h => {
      const tras = h.docs.map(h => {
        return h.data() as Res;
      });

      const res = tras.filter(h => h.prestador_id === user.id);

      setTrans(res);
    });

    return () => load();
  }, []);

  React.useEffect(() => {
    getTransaction();
    setCount(trans.length);
  }, [getTransaction, rece, trans.length]);

  // React.useEffect(() => {
  //     async function sock() {
  //         try {
  //             socket.on("trans", (h: Res) => {
  //                 if (h.consumidor_id !== user.id) {
  //                     setRece(h.descricao);
  //                 }
  //             });
  //         } catch (error) {
  //             console.log(error);
  //         }
  //     }
  //     sock();
  // }, [count]);

  const closeModal = useCallback(() => {
    setModal(false);
    setCount(0);
  }, [count]);

  const opemModal = useCallback(async () => {
    setModal(true);
  }, []);

  useFocusEffect(
    useCallback(() => {
      getTransaction();
    }, [getTransaction]),
  );
  return (
    <Container>
      <Header type={type}>
        <TouchableOpacity onPress={() => navigate("Inicio")}>
          {type === "tipo1" && (
            <Feather name="arrow-left" size={35} color={theme.colors.primary} />
          )}

          {type === "tipo2" && (
            <Feather name="arrow-left" size={35} color={theme.colors.focus} />
          )}
        </TouchableOpacity>

        <TitleHeader type={type}>{title} </TitleHeader>
        {count > 0 && onMessage === "on" && (
          <BoxMail onPress={opemModal}>
            <View style={{ flexDirection: "row" }}>
              <AntDesign
                name="mail"
                size={35}
                color={theme.colors.focus_second}
              />
              <Circle>
                <TextCircli>{count}</TextCircli>
              </Circle>
            </View>
          </BoxMail>
        )}
        {type === "tipo1" && (
          <Image
            style={{
              width: RFPercentage(6),
              height: RFPercentage(3.5),
            }}
            source={logo}
          />
        )}

        {type === "tipo2" && (
          <Image
            style={{
              width: RFPercentage(9),
              height: RFPercentage(3),
            }}
            source={logo1}
          />
        )}
      </Header>
      <Modal visible={modal}>
        <Menssage closeModal={closeModal} />
      </Modal>
    </Container>
  );
}
