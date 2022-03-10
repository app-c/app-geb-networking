/* eslint-disable camelcase */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, FlatList, View } from "react-native";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";
import { format } from "date-fns";
import { MessageComponent } from "../MessageComponent";
import { Bot, Container, Flat, Text } from "./styles";
import { useAuth } from "../../hooks/AuthContext";

interface Props {
  closeModal: () => void;
}

export interface ResTransaction {
  id: string;
  prestador_id: string;
  consumidor: string;
  valor: string;
  description: string;
  nome: string;
}

export function Menssage({ closeModal }: Props) {
  const [trans, setTrans] = useState<ResTransaction[]>([]);
  const { user } = useAuth();
  const db = getFirestore();
  const colecao = collection(db, "order_transaction");
  const colecaoTransaction = collection(db, "transaction");

  useEffect(() => {
    const clear = onSnapshot(colecao, h => {
      const trans = h.docs.map(p => {
        return {
          id: p.id,
          ...p.data(),
        } as ResTransaction;
      });
      const res = trans.filter(h => h.prestador_id === user.id);

      setTrans(res);
    });

    return () => clear();
  }, []);

  const Confirmation = useCallback(
    async (
      prestador_id: string,
      descricao: string,
      valor: string,
      consumidor_id: string,
      id: string,
    ) => {
      addDoc(colecaoTransaction, {
        prestador_id,
        descricao,
        type: "entrada",
        valor,
        createdAt: format(new Date(Date.now()), "dd-MM-yyy-HH-mm"),
      });

      addDoc(colecaoTransaction, {
        consumidor_id,
        descricao,
        type: "saida",
        valor,
        createdAt: format(new Date(Date.now()), "dd-MM-yyy-HH-mm"),
      });

      const ref = doc(colecao, id);
      deleteDoc(ref).then(() => Alert.alert("Transação confirmada"));

      // store()
      //   .collection("order_transaction")
      //   .doc(id)
      //   .delete()
      //   .then(() => Alert.alert("Transação confirmada"));
    },
    [],
  );

  const DeleteTransaction = useCallback(async (id: string) => {
    const ref = doc(colecao, id);
    deleteDoc(ref).then(() => Alert.alert("Transação deletada"));
  }, []);

  return (
    <Container>
      <Text>HELLO</Text>

      <FlatList
        data={trans}
        keyExtractor={h => h.id}
        renderItem={({ item: h }) => (
          <MessageComponent
            confirmar={() => {
              Confirmation(
                h.prestador_id,
                h.description,
                h.valor,
                h.consumidor,
                h.id,
              );
            }}
            rejeitar={() => DeleteTransaction(h.id)}
            nome={h.nome}
            valor={h.valor}
          />
        )}
      />

      <Bot onPress={closeModal}>
        <Text>FECHAR</Text>
      </Bot>
    </Container>
  );
}
