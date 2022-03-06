/* eslint-disable camelcase */
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { add, format } from "date-fns";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";
import { HeaderContaponent } from "../../components/HeaderComponent";
import { Loading } from "../../components/Loading";
import { useAuth } from "../../hooks/AuthContext";
import {
  Box,
  ButtonValidar,
  Container,
  TextButtonValidar,
  Title,
} from "./styles";
import { colecao } from "../../collection";

type Props = {
  user_id: string;
  presenca: boolean;
  createdAt: number;
  nome: string;
  avatar: string;
};

export function Valide() {
  const { user } = useAuth();
  const { navigate } = useNavigation();
  const [data, setData] = useState("");
  const [load, setLoad] = useState(false);
  const [presenca, setPresenca] = useState<Props[]>([]);

  const db = getFirestore();
  const colect = collection(db, "presença");

  const hanldeValidar = useCallback(async () => {
    if (Presenca) {
      setLoad(false);
      return Alert.alert(
        "Presença",
        "você nao pode marcar presença mais de uma vez no mesmo horário",
      );
    }
    addDoc(colect, {
      user_id: user.id,
      presenca: false,
      createdAt: Date.now(),
      nome: user.nome,
      avatar: user.avatarUrl,
    })
      .finally(() => setLoad(false))
      .catch(err => console.log(err));
    setLoad(false);
    navigate("Inicio");
  }, [navigate, presenca, user.avatarUrl, user.id, user.nome]);

  const Data = useCallback(() => {
    const dt = new Date(Date.now());
    setData(format(dt, "dd/MM/yyyy - HH:mm"));
  }, []);

  useEffect(() => {
    const load = onSnapshot(colect, h => {
      const response = h.docs.map(h => h.data() as Props);

      setPresenca(response);
    });
    Data();

    return () => load();
  }, []);

  const Presenca = useMemo(() => {
    if (!presenca) {
      setLoad(true);
    }

    const res = presenca.find(h => {
      const dataN = new Date(Date.now()).getHours();
      const dataCurrente = new Date(h.createdAt).getHours();

      if (h.nome === user.nome && dataN === dataCurrente) {
        return h;
      }
    });

    return res;
  }, []);

  return (
    <Container>
      <HeaderContaponent
        title="Valide sua presença"
        type="tipo1"
        onMessage="of"
      />

      <Box>
        <Title>{data} </Title>
      </Box>

      <ButtonValidar onPress={hanldeValidar}>
        {load ? <Loading /> : <TextButtonValidar>validar</TextButtonValidar>}
      </ButtonValidar>
    </Container>
  );
}
