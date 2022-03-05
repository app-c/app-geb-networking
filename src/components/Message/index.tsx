/* eslint-disable camelcase */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, FlatList, View } from "react-native";
import store from "firebase/firestore";
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
  const db = store.getFirestore();
  const colecao = store.collection(db, "order_transaction");

  useEffect(() => {
    const clear = store.onSnapshot(colecao, h => {
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
      store.addDoc(colecao, {
        prestador_id,
        descricao,
        type: "entrada",
        valor,
        createdAt: format(new Date(Date.now()), "dd-MM-yyy-HH-mm"),
      });

      store.addDoc(colecao, {
        consumidor_id,
        descricao,
        type: "saida",
        valor,
        createdAt: format(new Date(Date.now()), "dd-MM-yyy-HH-mm"),
      });

      // store()
      //   .collection("order_transaction")
      //   .doc(id)
      //   .delete()
      //   .then(() => Alert.alert("Transação confirmada"));
    },
    [],
  );

  const DeleteTransaction = useCallback(async (id: string) => {
    // store()
    //   .collection("order_transaction")
    //   .doc(id)
    //   .delete()
    //   .then(() => Alert.alert("Transação confirmada"));
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
