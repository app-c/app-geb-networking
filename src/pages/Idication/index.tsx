import React, { useCallback, useRef, useState } from "react";
import { Alert, View } from "react-native";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { format } from "date-fns";
import { useNavigation, useRoute } from "@react-navigation/native";
import { HeaderContaponent } from "../../components/HeaderComponent";
import {
  Box,
  BoxInput,
  BoxTextInput,
  Buton,
  Container,
  Input,
  TextBoton,
  Title,
} from "./styles";
import { useAuth } from "../../hooks/AuthContext";
import { InputText } from "../Transaction/styles";
import { OrderNavigationIndication } from "../../@types/navigation";
import { IUserDto } from "../../DtosUser";
import { colecao } from "../../collection";

export function Indication() {
  const { user } = useAuth();
  const { quemIndicou, id } = useRoute().params as OrderNavigationIndication;
  const { navigate } = useNavigation();

  const [description, setDescription] = useState("");
  const [valor, setValor] = useState("");

  const db = getFirestore();
  const colectUsers = collection(db, colecao.users);
  const colectOrderSucess = collection(db, "sucess_indication");
  const colectTransaction = collection(db, colecao.transaction);
  const colectOrderIndicarion = collection(db, colecao.orderIndication);

  const handleFecharNegocio = useCallback(() => {
    if (!description) {
      return Alert.alert("Transação", "Falta a descrição");
    }

    if (!valor || valor === "0.00") {
      return Alert.alert("Transação", "Falta o valor");
    }
    addDoc(colectTransaction, {
      prestador_id: user.id,
      descricao: description,
      type: "entrada",
      valor,
      createdAt: format(new Date(Date.now()), "dd-MM-yyy-HH-mm"),
    })
      .then(() => {
        const ref = doc(colectOrderIndicarion, id);
        const refUser = doc(colectUsers, quemIndicou);
        deleteDoc(ref);

        getDoc(refUser)
          .then(h => {
            let { indicacao } = h.data() as IUserDto;
            updateDoc(refUser, {
              indicacao: (indicacao += 1),
            });
          })
          .catch(err =>
            Alert.alert("Algo deu errado", "dados do usuário nao recuperado"),
          );
        Alert.alert("Transação", "Transação realizada com sucesso!");
      })
      .catch(err => Alert.alert("Algo deu errado!", "transação nao concluida"));

    store()
      .collection("sucess_indication")
      .add({
        createdAt: format(new Date(Date.now()), "dd/MM - HH:mm"),
        nome: user.nome,
        quemIndicou,
      });

    navigate("Inicio");
  }, [description, id, navigate, quemIndicou, user.id, user.nome, valor]);

  return (
    <Container>
      <HeaderContaponent
        title="Fechar negocio da indicação"
        type="tipo1"
        onMessage="of"
      />

      <Box>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 10,
          }}
        >
          <Title>Descrição</Title>
          <Title>{description.length}/14</Title>
        </View>
        <BoxTextInput>
          <Input
            onChangeText={setDescription}
            value={description}
            maxLength={14}
          />
        </BoxTextInput>

        <Title style={{ marginTop: 10, marginLeft: 10 }}>Valor</Title>
        <BoxInput>
          <InputText
            type="money"
            options={{
              precision: 2,
              separator: ".",
              delimiter: ",",
              unit: "",
            }}
            keyboardType="numeric"
            onChangeText={setValor}
            multiline
            value={valor}
            placeholder="Valor consumido R$"
          />
        </BoxInput>

        <Buton onPress={handleFecharNegocio}>
          <TextBoton>ENVIAR</TextBoton>
        </Buton>
      </Box>
    </Container>
  );
}
