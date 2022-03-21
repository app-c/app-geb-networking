/* eslint-disable array-callback-return */
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList } from "react-native";
import { HeaderContaponent } from "../../../components/HeaderComponent";
import { MembrosComponents } from "../../../components/MembrosCompornents";
import { db } from "../../../config";
import { IUserDto } from "../../../DtosUser";
import { Container, Title, Touch } from "./styles";

const cole = collection(db, "users");

export function Inativo() {
  const [users, setUsers] = useState<IUserDto[]>([]);
  useEffect(() => {
    onSnapshot(cole, h => {
      const res = h.docs
        .map(p => p.data() as IUserDto)
        .sort((a, b) => {
          if (a.nome < b.nome) {
            return -1;
          }
        });
      setUsers(res);
    });
  }, []);

  const handleInativar = useCallback((id: string, inativo: boolean) => {
    const cole = collection(db, "users");
    const ref = doc(cole, id);

    updateDoc(ref, {
      inativo: !inativo,
    });
  }, []);

  return (
    <Container>
      <HeaderContaponent
        title="Inativar um membro"
        type="tipo1"
        onMessage="of"
      />

      <FlatList
        data={users}
        keyExtractor={h => h.id}
        renderItem={({ item: h }) => (
          <MembrosComponents
            userName={h.nome}
            user_avatar={h.avatarUrl}
            oficio={h.workName}
            imageOfice={h.logoUrl}
            pres={() => {
              handleInativar(h.id, h.inativo);
            }}
            inativo={h.inativo}
          />
        )}
      />
    </Container>
  );
}
