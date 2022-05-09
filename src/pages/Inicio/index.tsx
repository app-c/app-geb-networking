/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import {
  AntDesign,
  Feather,
  FontAwesome,
  FontAwesome5,
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
  getDocs,
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
  ComprasText,
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
  TitleP,
  TitlePrice,
} from "./styles";
// import { registerForPushNotificationsAsync } from "../../components/Notification/Notification";
import handImage from "../../assets/hand.png";
import { ModalOrderIndication } from "../../components/ModalOrderIndication";
import { IUserDto } from "../../DtosUser";
import { ModalB2b } from "../../components/ModalB2b";
import { Menssage } from "../../components/Message";
import { MessageComponent } from "../../components/MessageComponent";

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

interface PropsB2b {
  id: string;
  data: { nanoseconds: number; seconds: number };
  description: string;
  nome: string;
  user_id: string;
  prestador_id: string;
}

interface ProsTransaction {
  id: string;
  data: {};
  nome: string;
  prestador_id: string;
  valor: string;
  description: string;
  consumidor: string;
}

interface PriceProps {
  price: string;
  pts: number;
}

export function Inicio() {
  const { user, signOut } = useAuth();
  const navigate = useNavigation();

  const modalRef = useRef<Modalize>(null);
  const modalSucess = useRef<Modalize>(null);
  const modalB2b = useRef<Modalize>(null);
  const modalTransaction = useRef<Modalize>(null);

  const [sucess, setSucess] = useState<Propssuce[]>([]);
  const [price, setPrice] = useState<PriceProps>({});
  const [montante, setMontante] = useState("");
  const [montanteP, setMontanteP] = useState("");
  const [orderB2b, setOrderB2b] = useState<PropsB2b[]>([]);
  const [orderTransaction, setOrderTransaction] = useState<ProsTransaction[]>(
    [],
  );
  const [orderIndication, setOrderIndication] = useState<IOrder_Indication[]>(
    [],
  );

  const db = getFirestore();
  const colecaoOrderIndication = collection(db, "order_indication");
  const colecaoSucessIndication = collection(db, "sucess_indication");
  const colecaoTransaction = collection(db, "transaction");
  const colecaoUsers = collection(db, "users");
  const colecaoOrderB2B = collection(db, "order_b2b");
  const colecaoB2b = collection(db, "b2b");
  const colecaoOrderTransaction = collection(db, "order_transaction");

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

  useEffect(() => {
    const load = onSnapshot(colecaoOrderB2B, h => {
      const res = h.docs.map(p => {
        return {
          id: p.id,
          ...p.data(),
        } as PropsB2b;
      });
      setOrderB2b(res.filter(h => h.prestador_id === user.id));
    });

    return () => load();
  }, []);

  useEffect(() => {
    const load = onSnapshot(colecaoOrderTransaction, h => {
      const res = h.docs
        .map(p => {
          return {
            id: p.id,
            ...p.data(),
          } as ProsTransaction;
        })
        .filter(h => h.prestador_id === user.id);
      setOrderTransaction(res);
    });
    return () => load();
  }, []);

  useEffect(() => {
    getDocs(colecaoUsers).catch(h => console.log(h));
  }, []);
  useFocusEffect(
    useCallback(() => {
      if (orderIndication.length > 0) {
        modalRef.current.open();
      }
      if (sucess.length > 0) {
        modalSucess.current.open();
      }
      if (orderB2b.length > 0) {
        modalB2b.current.open();
      }

      if (orderTransaction.length > 0) {
        modalTransaction.current.open();
      }
    }, [
      orderB2b.length,
      orderIndication.length,
      orderTransaction.length,
      sucess.length,
    ]),
  );

  const ClosedModal = useCallback(() => {
    modalRef.current.close();
    modalTransaction.current.close();
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

  const HandFailIndication = useCallback(
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

  const handleFailB2b = useCallback((id: string) => {
    const ref = doc(colecaoOrderB2B, id);
    deleteDoc(ref);
    modalB2b.current.close();
  }, []);

  const handleSucessB2b = useCallback(
    (id: string, user_id: string, prestador_id: string) => {
      const data = format(new Date(Date.now()), "dd-MM-yy-HH-mm");
      addDoc(colecaoB2b, {
        id,
        user_id,
        prestador_id,
        data,
      }).then(() => {
        const ref = doc(colecaoOrderB2B, id);
        deleteDoc(ref);
        Alert.alert("B2B realizado com sucesso!");
        modalB2b.current.close();
      });
    },
    [],
  );

  const handleSucess = useCallback(async (id: string) => {
    const sucessRef = doc(colecaoSucessIndication, id);
    await deleteDoc(sucessRef);
  }, []);

  const handleTransaction = useCallback(
    async (
      prestador_id: string,
      consumidor: string,
      descricao: string,
      id: string,
      valor: string,
    ) => {
      addDoc(colecaoTransaction, {
        prestador_id,
        descricao,
        type: "entrada",
        createdAt: format(new Date(Date.now()), "dd-MM-yyy-HH-mm"),
        valor,
      });

      addDoc(colecaoTransaction, {
        consumidor,
        descricao,
        type: "saida",
        createdAt: format(new Date(Date.now()), "dd-MM-yyy-HH-mm"),
        valor,
      });

      const ref = doc(colecaoOrderTransaction, id);
      deleteDoc(ref).then(() => Alert.alert("Transação confirmada"));
    },
    [],
  );

  const DeleteTransaction = useCallback(async (id: string) => {
    const ref = doc(colecaoTransaction, id);
    deleteDoc(ref).then(() => Alert.alert("Transação deletada"));
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
          const data = h.createdAt ? h.createdAt : "00-00-00-00-00";
          const [dia, mes, ano, hora, min] = data.split("-").map(Number);
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
          const data = h.createdAt ? h.createdAt : "00-00-00-00-00";

          const [dia, mes, ano, hora, min] = data.split("-").map(Number);
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

      const price = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });

      const pts = data.length * 10;

      const pricePts = {
        price,
        pts,
      };

      setPrice(pricePts);
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

      <TitleName> {user.nome} </TitleName>

      <View style={{ alignItems: "center" }}>
        <ComprasText>Vendas</ComprasText>

        <BoxPrice>
          <TitlePrice>{price.price}</TitlePrice>
          <TitleP>{price.pts} pts</TitleP>
        </BoxPrice>
      </View>

      <View style={{ flexDirection: "row" }}>
        <Text style={{ marginLeft: 16 }}>
          Total de vendas do G.E.B até {anoPass}
        </Text>
        <Text style={{ marginLeft: 10 }}>
          {montanteP === "R$0,00" ? "R$3.242.222,78" : montanteP}
        </Text>
      </View>

      <View style={{ flexDirection: "row" }}>
        <Text style={{ marginLeft: 16 }}>
          Total de vendas do G.E.B de {anoAtual}
        </Text>
        <Text style={{ marginLeft: 14 }}>{montante}</Text>
      </View>

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
                failTransaction={() => HandFailIndication(h.id, h.quemIndicou)}
                quemIndicouName={h.quemIndicouName}
                quemIndicouWorkName={h.quemIndicouWorkName}
              />
            </View>
          ))}
        </View>
      </Modalize>

      <Modalize
        handlePosition="inside"
        ref={modalB2b}
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
          {orderB2b.map(h => (
            <View key={h.data.nanoseconds}>
              <ModalB2b
                clientName={h.nome}
                handShak={() => {
                  handleSucessB2b(h.id, h.user_id, h.prestador_id);
                }}
                failTransaction={() => handleFailB2b(h.id)}
              />
            </View>
          ))}
        </View>
      </Modalize>

      <Modalize
        handlePosition="inside"
        ref={modalTransaction}
        snapPoint={300}
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
          {orderTransaction.map(h => (
            <View key={h.id}>
              <MessageComponent
                confirmar={() => {
                  handleTransaction(
                    h.prestador_id,
                    h.consumidor,
                    h.description,
                    h.id,
                    h.valor,
                  );
                }}
                nome={h.nome}
                rejeitar={() => {
                  DeleteTransaction(h.id);
                }}
                valor={h.valor}
              />
            </View>
          ))}
        </View>
      </Modalize>

      <Line />

      <Scroll
        nestedScrollEnabled
        showsVerticalScrollIndicator
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Box onPress={() => navigate.navigate("home")}>
          <IconIoncic name="home" color={theme.colors.focus} />
          <Title>Menu inicial</Title>
        </Box>

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

        <Box onPress={() => navigate.navigate("negociar")}>
          <FontAwes name="handshake-o" color={theme.colors.focus} />

          <Title>Negociar</Title>
        </Box>

        <Box onPress={() => navigate.navigate("indicacao")}>
          <IconAnt name="swap" color={theme.colors.focus} />

          <Title>Indicações</Title>
        </Box>

        <Box onPress={() => navigate.navigate("b2b")}>
          <FontAwesome5 name="users" size={23} color={theme.colors.focus} />

          <Title>B2B</Title>
        </Box>

        <Box onPress={() => navigate.navigate("findUser")}>
          <IconFont name="map-marker-alt" color={theme.colors.focus} />
          <Title>Localize os membros</Title>
        </Box>

        <Box onPress={() => navigate.navigate("consumo")}>
          <IConSimple name="graph" color={theme.colors.focus} />
          <Title>Extrato de negócios</Title>
        </Box>

        <Box onPress={() => navigate.navigate("classificaçao")}>
          <IconIoncic name="ios-podium" color={theme.colors.focus} />
          <Title>Minha classificação</Title>
        </Box>

        <Box>
          <IconFoundation name="clipboard-notes" color={theme.colors.focus} />
          <Title>Regras do projeto</Title>
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

            <Box onPress={() => navigate.navigate("inativo")}>
              <FontAwes name="user-times" color={theme.colors.focus_second} />
              <Title>Inativar um membro</Title>
            </Box>
          </View>
        )}
      </Scroll>
    </Container>
  );
}
