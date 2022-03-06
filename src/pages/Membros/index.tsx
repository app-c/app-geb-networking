/* eslint-disable camelcase */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, ScrollView, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import store, {
  collection,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";
import { Form } from "@unform/mobile";
import { HeaderContaponent } from "../../components/HeaderComponent";
import { Container } from "./styles";
import { MembrosComponents } from "../../components/MembrosCompornents";
import { useAuth } from "../../hooks/AuthContext";
import { IUserDto } from "../../DtosUser";
import { Box } from "../FindMembro/styles";
import { InputCasdastro } from "../../components/InputsCadastro";
import { colecao } from "../../collection";
import { Loading } from "../../components/Loading";

export function Membros() {
  const { navigate } = useNavigation();
  const { user } = useAuth();
  const db = getFirestore();
  const colectUsers = collection(db, colecao.users);

  const [membros, setMembros] = useState<IUserDto[]>([]);
  const [value, setValue] = useState("");
  const [lista, setLista] = useState<IUserDto[]>([]);
  const [load, setLoad] = useState(true);

  const hanldeTransaction = useCallback(
    (
      prestador_id: string,
      avatar_url: string,
      logoUrl: string,
      nome: string,
      workName: string,
    ) => {
      navigate("Transaction", {
        prestador_id,
        avatar_url,
        logoUrl,
        nome,
        workName,
      });
    },
    [navigate],
  );

  useEffect(() => {
    const load = onSnapshot(colectUsers, h => {
      const user = h.docs.map(h => {
        return h.data() as IUserDto;
      });

      setMembros(user);
      setLoad(false);
    });
    return () => load();
  }, []);

  useEffect(() => {
    if (value === "") {
      setLista(membros);
    } else {
      setLista(
        membros.filter(h => {
          return h.nome.indexOf(value) > -1;
        }),
      );
    }
  }, [membros, value]);

  return (
    <>
      {load ? (
        <Loading />
      ) : (
        <Container>
          <HeaderContaponent type="tipo1" onMessage="of" title="MEMBROS" />

          <Form>
            <Box>
              <InputCasdastro
                name="find"
                icon="search"
                type="custom"
                options={{ mask: "****************************" }}
                onChangeText={text => setValue(text)}
                value={value}
              />
            </Box>
          </Form>

          <View style={{ paddingBottom: RFPercentage(20) }}>
            <FlatList
              data={lista}
              keyExtractor={h => h.id}
              renderItem={({ item: h }) => (
                <>
                  <MembrosComponents
                    icon="necociar"
                    pres={() =>
                      hanldeTransaction(
                        h.id,
                        h.avatarUrl,
                        h.logoUrl,
                        h.nome,
                        h.workName,
                      )
                    }
                    userName={h.nome}
                    user_avatar={h.avatarUrl}
                    oficio={h.workName}
                    imageOfice={h.logoUrl}
                  />
                </>
              )}
            />
          </View>
        </Container>
      )}
    </>
  );
}
