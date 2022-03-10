/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import {
  AntDesign,
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { Modalize } from "react-native-modalize";
import { format } from "date-fns";
import theme from "../../global/styles/theme";
import { useAuth } from "../../hooks/AuthContext";
import {
  Avatar,
  Box,
  BoxIco,
  BoxPrice,
  Container,
  FontAwes,
  IconAnt,
  IconFont,
  IconFoundation,
  IconIoncic,
  IConSimple,
  Line,
  Scroll,
  Title,
  TitleName,
  TitlePrice,
} from "./styles";
// import { registerForPushNotificationsAsync } from "../../components/Notification/Notification";
import handImage from "../../assets/hand.png";
import { ModalOrderIndication } from "../../components/ModalOrderIndication";
import { IUserDto } from "../../DtosUser";

interface IOrder_Indication {
  id: string;
  createdAt: string;
  descricao: string;
  quemIndicou: string;
  userId: string;
  quemIndicouName: string;
  quemIndicouWorkName: string;
  nomeCliente: string;
  telefoneCliente: string;
}

interface Propssuce {
  id: string;
  data: string;
  nome: string;
  quemIndicou: string;
}

export function Inicio() {
  const { user, signOut } = useAuth();
  const modalRef = useRef<Modalize>(null);
  const modalSucess = useRef<Modalize>(null);
  const [sucess, setSucess] = useState<Propssuce[]>([]);
  const navigate = useNavigation();

  const [price, setPrice] = useState("");
  const [montante, setMontante] = useState("");
  const [montanteP, setMontanteP] = useState("");
  const [orderIndication, setOrderIndication] = useState<IOrder_Indication[]>(
    [],
  );

  const db = getFirestore();
  const colecaoOrderIndication = collection(db, "order_indication");
  const colecaoSucessIndication = collection(db, "sucess_indication");
  const colecaoTransaction = collection(db, "transaction");
  const colecaoUsers = collection(db, "users");

  useEffect(() => {
    const load = onSnapshot(colecaoOrderIndication, h => {
      const order = h.docs.map(p => {
        return {
          id: p.id,
          ...p.data(),
        } as IOrder_Indication;
      });

      setOrderIndication(order.filter(h => h.userId === user.id));
    });
    return () => load();
  }, []);

  useEffect(() => {
    const load = onSnapshot(colecaoSucessIndication, suce => {
      const res = suce.docs.map(p => {
        return {
          id: p.id,
          ...p.data(),
        } as Propssuce;
      });
      const fil = res.filter(h => h.quemIndicou === user.id);
      setSucess(fil);
    });

    return () => load();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (orderIndication.length > 0) {
        modalRef.current.open();
      }
      if (sucess.length > 0) {
        modalSucess.current.open();
      }
    }, [orderIndication.length, sucess.length]),
  );

  const ClosedModal = useCallback(() => {
    modalRef.current.close();
  }, []);

  const ClosedModalSucess = useCallback(() => {
    modalSucess.current.close();
  }, []);

  const HandShak = useCallback(
    (quemIndicou: string, id: string) => {
      navigate.navigate("indication", { quemIndicou, id });
    },
    [navigate],
  );

  const HandFailTransaction = useCallback(
    async (id: string, quemIndicou: string) => {
      const orderIndicationRef = doc(colecaoOrderIndication, id);
      const userRef = doc(colecaoUsers, quemIndicou);
      deleteDoc(orderIndicationRef);
      addDoc(colecaoSucessIndication, {
        createdAt: format(new Date(Date.now()), "dd/MM - HH:mm"),
        nome: user.nome,
        quemIndicou,
      });

      await getDoc(userRef)
        .then(h => {
          let { indicacao } = h.data() as IUserDto;
          updateDoc(userRef, {
            indicacao: (indicacao += 1),
          });
        })
        .catch(() =>
          Alert.alert("Algo deu errado", "dados do usuário nao recuperado"),
        );
    },
    [],
  );

  const handleSucess = useCallback(async (id: string) => {
    const sucessRef = doc(colecaoSucessIndication, id);
    await deleteDoc(sucessRef);
  }, []);

  useEffect(() => {
    const load = onSnapshot(colecaoTransaction, h => {
      const res = h.docs.map(p => p.data());
      const data = res.filter(h => {
        if (h.prestador_id === user.id && h.type === "entrada") {
          return h;
        }
      });

      const MontatePass = res
        .filter(h => {
          const [dia, mes, ano, hora, min] = h.createdAt.split("-").map(Number);
          const DateN = new Date(Date.now()).getFullYear() - 1;
          if (h.type === "entrada" && ano === DateN) {
            return h;
          }
        })
        .reduce((acc, item) => {
          return acc + Number(item.valor);
        }, 0);

      const MontateAtual = res
        .filter(h => {
          const [dia, mes, ano, hora, min] = h.createdAt.split("-").map(Number);
          const DateN = new Date(Date.now()).getFullYear();
          if (h.type === "entrada" && ano === DateN) {
            return h;
          }
        })
        .reduce((acc, item) => {
          return acc + Number(item.valor);
        }, 0);

      setMontanteP(
        MontatePass.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
      );

      setMontante(
        MontateAtual.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
      );

      const total = data.reduce((acc, item) => {
        return acc + Number(item.valor);
      }, 0);

      setPrice(
        total.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
      );
    });

    return () => load();
  }, [user.id]);

  const anoPass = new Date(Date.now()).getFullYear() - 1;
  const anoAtual = new Date(Date.now()).getFullYear();

  return (
    <Container>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity onPress={() => signOut()}>
          <FontAwesome
            name="power-off"
            size={30}
            color={theme.colors.focus_second}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigate.navigate("perfil")}>
          <MaterialCommunityIcons
            name="cog-outline"
            size={40}
            color={theme.colors.focus}
          />
        </TouchableOpacity>
      </View>

      {user.avatarUrl ? (
        <Avatar source={{ uri: user.avatarUrl }} />
      ) : (
        <BoxIco>
          <Feather name="user" size={100} />
        </BoxIco>
      )}

      <TitleName> {} </TitleName>

      <BoxPrice>
        <TitlePrice>{price}</TitlePrice>
      </BoxPrice>

      <View style={{ flexDirection: "row" }}>
        <Text style={{ marginLeft: 16 }}>Total de negócios até {anoPass}</Text>
        <Text style={{ marginLeft: 16 }}>
          {montanteP === "R$0,00" ? "R$3.242.222,78" : montanteP}
        </Text>
      </View>

      <View style={{ flexDirection: "row" }}>
        <Text style={{ marginLeft: 16 }}>Total de negócios de {anoAtual}</Text>
        <Text style={{ marginLeft: 16 }}>{montante}</Text>
      </View>

      <Line />

      <Modalize
        ref={modalSucess}
        snapPoint={300}
        modalHeight={450}
        modalStyle={{
          width: "90%",
          alignSelf: "center",
        }}
      >
        <View>
          <TouchableOpacity
            onPress={ClosedModalSucess}
            style={{
              alignSelf: "flex-end",
              marginRight: 10,
              padding: 10,
            }}
          >
            <AntDesign
              name="closecircle"
              size={30}
              color={theme.colors.focus}
            />
          </TouchableOpacity>

          {sucess.map(h => (
            <View key={h.id} style={{ padding: 20 }}>
              <Text>
                Sucesso! {h.nome} esta negociando com o cliente que voce indicou
              </Text>

              <TouchableOpacity
                onPress={() => {
                  handleSucess(h.id);
                }}
                style={{
                  width: 80,
                  height: 30,
                  alignSelf: "center",
                  alignItems: "center",
                  backgroundColor: theme.colors.focus,
                  justifyContent: "center",
                  borderRadius: 7,
                }}
              >
                <Text style={{ color: theme.colors.primary }}>OK</Text>
              </TouchableOpacity>

              <Line />
            </View>
          ))}
        </View>
      </Modalize>

      <Modalize
        handlePosition="inside"
        ref={modalRef}
        snapPoint={400}
        modalStyle={{
          width: "90%",
          alignSelf: "center",
        }}
      >
        <View>
          <TouchableOpacity
            onPress={ClosedModal}
            style={{
              alignSelf: "flex-end",
              marginRight: 10,
              padding: 10,
            }}
          >
            <AntDesign
              name="closecircle"
              size={30}
              color={theme.colors.focus}
            />
          </TouchableOpacity>
          {orderIndication.map(h => (
            <View key={h.id}>
              <ModalOrderIndication
                description={h.descricao}
                clientName={h.nomeCliente}
                telefone={h.telefoneCliente}
                handShak={() => {
                  HandShak(h.quemIndicou, h.id);
                }}
                failTransaction={() => HandFailTransaction(h.id, h.quemIndicou)}
                quemIndicouName={h.quemIndicouName}
                quemIndicouWorkName={h.quemIndicouWorkName}
              />
            </View>
          ))}
        </View>
      </Modalize>

      <Scroll
        nestedScrollEnabled
        showsVerticalScrollIndicator
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Box onPress={() => navigate.navigate("valide")}>
          <Image
            source={handImage}
            style={{
              width: 30,
              height: 30,
            }}
          />
          <Title>Valide sua presença</Title>
        </Box>

        <Box onPress={() => navigate.navigate("home")}>
          <IconIoncic name="home" color={theme.colors.focus} />
          <Title>Menu inicial</Title>
        </Box>

        <Box onPress={() => navigate.navigate("negociar")}>
          <FontAwes name="handshake-o" color={theme.colors.focus} />

          <Title>Negociar</Title>
        </Box>

        <Box onPress={() => navigate.navigate("consumo")}>
          <IConSimple name="graph" color={theme.colors.focus} />
          <Title>Extrato de negócios</Title>
        </Box>

        <Box onPress={() => navigate.navigate("indicacao")}>
          <IconAnt name="swap" color={theme.colors.focus} />

          <Title>Indicações</Title>
        </Box>

        {user.adm && (
          <View>
            <Box onPress={() => navigate.navigate("ranking")}>
              <IconIoncic name="ios-podium" color={theme.colors.focus_second} />
              <Title>Ranking</Title>
            </Box>

            <Box onPress={() => navigate.navigate("user")}>
              <FontAwes name="user-plus" color={theme.colors.focus_second} />
              <Title>Cadastrar membro</Title>
            </Box>

            <Box onPress={() => navigate.navigate("presenca")}>
              <FontAwes
                name="check-square-o"
                color={theme.colors.focus_second}
              />
              <Title>Confirmar presença dos membros</Title>
            </Box>

            <Box onPress={() => navigate.navigate("updateSenha")}>
              <IconAnt name="user" color={theme.colors.focus_second} />
              <Title>Alterar senha de um membro</Title>
            </Box>

            <Box onPress={() => navigate.navigate("delete")}>
              <FontAwes name="user-times" color={theme.colors.focus_second} />
              <Title>Excluir um membro</Title>
            </Box>
          </View>
        )}

        <Box onPress={() => navigate.navigate("findUser")}>
          <IconFont name="map-marker-alt" color={theme.colors.focus} />
          <Title>Localize os membros</Title>
        </Box>

        <Box>
          <IconFoundation name="clipboard-notes" color={theme.colors.focus} />
          <Title>Regras do projeto</Title>
        </Box>

        <Box onPress={() => navigate.navigate("classificaçao")}>
          <IconIoncic name="ios-podium" color={theme.colors.focus} />
          <Title>Minha classificação</Title>
        </Box>
      </Scroll>
    </Container>
  );
}
