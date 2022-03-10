/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import { AntDesign } from "@expo/vector-icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import store, {
  collection,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { FlatList } from "react-native";
import { useAuth } from "../../hooks/AuthContext";
import { ButonPost, Container, Flat } from "./styles";
import { HeaderContaponent } from "../../components/HeaderComponent";
import { ListPost } from "../../components/ListPost";
import theme from "../../global/styles/theme";
import { Loading } from "../../components/Loading";
import { colecao } from "../../collection";

export interface Res {
  id: string;
  descricao: string;
  post: string;
  like: number;
  nome: string;
  avater: string;
}
export function Home() {
  const { user, updateUser } = useAuth();
  const navigation = useNavigation();
  const db = getFirestore();
  const colectPost = collection(db, colecao.post);

  const [post, setPost] = useState<Res[]>([]);
  const [state, setState] = useState(false);
  const [msg, setMsg] = useState("");
  const [expoPushToken, setExpoPushToken] = useState<any>();
  const [load, setLoad] = useState(true);

  // const updateToken = useCallback(async () => {
  //     try {
  //         const res = await api.put('/user/upToken', {
  //             token: expoPushToken,
  //         });
  //         updateUser(res.data);
  //     } catch (err: any) {
  //         console.log(err.response);
  //     }
  // }, [expoPushToken, updateUser]);

  // useEffect(() => {
  //     registerForPushNotificationsAsync().then(token =>
  //         setExpoPushToken(token),
  //     );
  //     updateToken();
  // }, [updateToken]);

  const navigateToPost = useCallback(() => {
    navigation.navigate("Post");
  }, [navigation]);

  useEffect(() => {
    const asy = onSnapshot(colectPost, h => {
      const post = h.docs.map(p => {
        return {
          id: p.id,
          ...p.data(),
        } as Res;
      });

      setPost(post);
      setLoad(false);
    });

    return () => asy();
  }, []);

  const handleLike = useCallback(async (id: string) => {
    const ref = doc(colectPost, id);
    getDoc(ref).then(h => {
      const { like } = h.data();
      updateDoc(ref, {
        like: like + 1,
      });
    });
  }, []);

  return (
    <Container>
      <HeaderContaponent type="tipo1" onMessage="on" title="POSTS" />

      {load ? (
        <Loading />
      ) : (
        <>
          <FlatList
            data={post}
            keyExtractor={h => h.id}
            renderItem={({ item: h }) => (
              <ListPost
                state={state}
                presLike={() => handleLike(h.id)}
                avater={h.avater}
                user_name={h.nome}
                image={h.post}
                descriçao={h.descricao}
                like={h.like}
              />
            )}
          />
          <ButonPost onPress={navigateToPost}>
            <AntDesign name="plus" size={35} color={theme.colors.primary} />
          </ButonPost>
        </>
      )}
    </Container>
  );
}
