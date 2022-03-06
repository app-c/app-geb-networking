/* eslint-disable camelcase */
import React, { useCallback, useEffect, useState } from "react";
import { FlatList } from "react-native";
import { string } from "yup";
import store, {
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { format } from "date-fns";
import { HeaderContaponent } from "../../../components/HeaderComponent";
import { ListMembro } from "../../../components/ListMembro";
import { Container } from "./styles";
import { colecao } from "../../../collection";

export interface ProsPresenca {
  createdAt: string;
  id: string;
  presenca: boolean;
  user_id: string;
  nome: string;
  avatar: string;
  data: string;
}

export function ListPresenca() {
  const [response, setResponse] = useState<ProsPresenca[]>([]);

  const db = getFirestore();
  const colecaoPresenca = collection(db, colecao.presenca);

  useEffect(() => {
    const load = onSnapshot(colecaoPresenca, h => {
      const user = h.docs.map(p => {
        return {
          id: p.id,
          ...p.data(),
        } as ProsPresenca;
      });
      const res = user.filter(h => h.presenca === false);

      setResponse(
        res.map(h => {
          const data = format(new Date(h.createdAt), "dd/MM/yyyy - HH:mm");
          return {
            data,
            ...h,
          };
        }),
      );
    });

    return () => load();
  }, []);

  const handleConfirmar = useCallback(async (id: string) => {
    const ref = doc(colecaoPresenca, id);
    updateDoc(ref, {
      presenca: true,
    }).catch(err => console.log("erro1", err));
  }, []);

  const handleDescartar = useCallback((id: string) => {
    const ref = doc(colecaoPresenca, id);
    deleteDoc(ref);
  }, []);

  return (
    <Container>
      <HeaderContaponent
        type="tipo1"
        onMessage="of"
        title="Confirmar presença"
      />

      <FlatList
        data={response}
        keyExtractor={h => h.id}
        renderItem={({ item: h }) => (
          <ListMembro
            descartar={() => {
              handleDescartar(h.id);
            }}
            confirmar="Confirmar"
            nome={h.nome}
            data={h.data}
            avatar={`https://geb-app.s3.us-east-2.amazonaws.com/avatar/${h.avatar}`}
            pres={() => handleConfirmar(h.id, h.user_id)}
          />
        )}
      />
    </Container>
  );
}
