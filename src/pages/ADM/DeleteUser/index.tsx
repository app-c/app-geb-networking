import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, View } from "react-native";
import { collection, doc, getFirestore, onSnapshot } from "firebase/firestore";
import { getAuth, deleteUser } from "firebase/auth";
import { HeaderContaponent } from "../../../components/HeaderComponent";
import { ListMembro } from "../../../components/ListMembro";

import { Container, Title } from "./styles";

interface PropsResponse {
  id: string;
  nome: string;
  avatarUrl: string;
}

export function DeletUser() {
  const [respnse, setResponse] = useState<PropsResponse[]>([]);
  const { goBack } = useNavigation();

  const db = getFirestore();
  const auth = getAuth();
  const colecaoUsers = collection(db, "users");

  useEffect(() => {
    const load = onSnapshot(colecaoUsers, h => {
      const res = h.docs.map(p => p.data());
      setResponse(
        res.map(h => {
          return {
            id: h.id,
            nome: h.nome,
            avatarUrl: h.avatarUrl,
          };
        }),
      );
    });
    return () => load();
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    Alert.alert("Aviso", "você está preste a excluir um membro", [
      {
        text: "Ok",
        onPress: () => {
          store().collection("users").doc(id).delete();
          //     api.delete(`/user/delete/${id}`).finally(() => {
          //         setResponse(respnse.filter(h => h.id !== id));
          //     });
          // },
        },
      },

      {
        text: "Cancelar",
        style: "cancel",
      },
    ]);
  }, []);

  return (
    <Container>
      <HeaderContaponent
        title="Excluir um membro"
        onMessage="of"
        type="tipo1"
      />
      <View>
        <FlatList
          contentContainerStyle={{ paddingBottom: 200 }}
          data={respnse}
          keyExtractor={h => h.id}
          renderItem={({ item: h }) => (
            <ListMembro
              confirmar="Excluir"
              avatar={h.avatarUrl}
              nome={h.nome}
              pres={() => {
                handleDelete(h.id);
              }}
              descartar={() => {
                goBack();
              }}
            />
          )}
        />
      </View>
    </Container>
  );
}
