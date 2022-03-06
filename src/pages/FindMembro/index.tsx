import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Linking, View } from "react-native";
import { Form } from "@unform/mobile";
import store from "firebase/firestore";
import { FindMembroComponent } from "../../components/FindMembro";
import { IUserDto } from "../../DtosUser";
import { Box, Container, Flat, Title } from "./styles";
import { HeaderContaponent } from "../../components/HeaderComponent";
import { InputCasdastro } from "../../components/InputsCadastro";

export function FindUser() {
  const [membro, setMembro] = useState<IUserDto[]>([]);
  const [value, setValue] = useState("");
  const [lista, setLista] = useState<IUserDto[]>([]);

  useEffect(() => {
    const load = store()
      .collection("users")
      .onSnapshot(h => {
        const re = h.docs.map(p => {
          return p.data() as IUserDto;
        });
        setMembro(re);
      });
    return () => load();
  }, []);

  const handlePress = useCallback(async (url: string) => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, []);

  useEffect(() => {
    if (value === "") {
      setLista(membro);
    } else {
      setLista(
        membro.filter(h => {
          return h.nome.indexOf(value) > -1;
        }),
      );
    }
  }, [membro, value]);

  return (
    <Container>
      <HeaderContaponent
        title="Localizar membros"
        type="tipo1"
        onMessage="of"
      />

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

      <FlatList
        // contentContainerStyle={{ paddingBottom: 150 }}
        data={lista}
        keyExtractor={h => h.id}
        renderItem={({ item: h }) => (
          <View>
            <FindMembroComponent
              avatar={h.avatarUrl}
              name={h.nome}
              workName={h.workName}
              whats={() => handlePress(h.links[0])}
              face={() => handlePress(h.links[1])}
              insta={() => handlePress(h.links[2])}
              maps={() => handlePress(`https://${h.links[3]}`)}
            />
          </View>
        )}
      />
    </Container>
  );
}
