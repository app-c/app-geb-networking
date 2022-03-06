/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import store, { collection, getDocs, getFirestore } from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { HeaderContaponent } from "../../components/HeaderComponent";
import { IUserDto } from "../../DtosUser";
import theme from "../../global/styles/theme";
import { useAuth } from "../../hooks/AuthContext";
import {
  BoxAvatar,
  BoxContainer,
  BoxEventos,
  BoxPosition,
  Container,
  Title,
} from "./styles";
import { colecao } from "../../collection";

interface IResponse {
  id: string;
  total: string;
  nome: string;
  posicao: string;
}

interface PropsEntrada {
  createdAt: string;
  descricao: string;
  prestador_id: string;
  type: string;
  valor: string;
}

interface PropsSaida {
  createdAt: string;
  descricao: string;
  consumidor_id: string;
  type: string;
  valor: string;
}

interface IPresenca {
  padrinho: number;
  qntPresença: number;
  user_id: string;
}

interface IQnt {
  qntPadrinho: number;
  qntPresenca: number;
  qntIndicacao: number;
  user_id: string;
}

export function Classificaçao() {
  const { user } = useAuth();
  const db = getFirestore();
  const colectUsers = collection(db, colecao.users);
  const colectTransaction = collection(db, colecao.transaction);
  const colectPresenca = collection(db, colecao.presenca);

  const [FindAllUser, setFindAllUsers] = useState<IUserDto[]>([]);
  const [findEntrada, setFindEntrada] = useState<PropsEntrada[]>([]);
  const [findSaida, setFindSaida] = useState<PropsSaida[]>([]);
  const [qntGeral, setQntGeral] = useState<IQnt[]>([]);
  const [presenca, setPresenca] = useState<[]>([]);

  const [load, setLoad] = useState(true);

  useEffect(() => {
    getDocs(colectUsers).then(h => {
      const res = h.docs.map(p => {
        return p.data() as IUserDto;
      });
      setFindAllUsers(res);
    });

    store();
    getDocs(colectTransaction).then(h => {
      const trans = h.docs
        .map(p => p.data() as PropsEntrada)
        .filter(h => h.type === "saida");

      setFindSaida(trans);
    });

    getDocs(colectPresenca).then(res => {
      const re = res.docs.map(h => h.data());
      setPresenca(re);
    });
  }, [user.id]);

  useEffect(() => {
    const pres = FindAllUser.map((h, i) => {
      const presen = presenca.filter(
        h => h.user_id === user.id && h.presenca === true,
      );
      console.log(presen);
      return {
        qntPadrinho: h.padrinhQuantity,
        qntPresenca: presen.length,
        qntIndicacao: h.indicacao,
        user_id: h.id,
      };
    });

    setQntGeral(pres);
  }, [FindAllUser, presenca, user.id]);

  const PresencaRanking = useMemo(() => {
    const st = qntGeral.sort((a, b) => {
      return b.qntPresenca - a.qntPresenca;
    });
    return st.map((h, i) => {
      return {
        ...h,
        position: `${i + 1}º`,
      };
    });
  }, [qntGeral]);

  const Padrinho = useMemo(() => {
    const st = qntGeral.sort((a, b) => {
      return b.qntPadrinho - a.qntPadrinho;
    });

    return st.map((h, index) => {
      return {
        ...h,
        posicao: `${String(index + 1)}º`,
      };
    });
  }, [qntGeral]);

  const Indicacao = useMemo(() => {
    const st = qntGeral.sort((a, b) => {
      return b.qntIndicacao - a.qntIndicacao;
    });

    return st.map((h, index) => {
      return {
        ...h,
        posicao: `${String(index + 1)}º`,
      };
    });
  }, [qntGeral]);

  useEffect(() => {
    getDocs(colectUsers).then(h => {
      const res = h.docs.map(p => {
        return p.data() as IUserDto;
      });
      setFindAllUsers(res);
    });

    getDocs(colectUsers).then(h => {
      const trans = h.docs
        .map(p => p.data() as PropsEntrada)
        .filter(h => h.type === "entrada");

      setFindEntrada(trans);
      setLoad(false);
    });
  }, [user.id]);

  const Entrada = useMemo(() => {
    const data = FindAllUser.map((user, i) => {
      const filtroConsumo = findEntrada.filter(h => {
        if (h.prestador_id === user.id) {
          return h;
        }
      });

      const valor = filtroConsumo.reduce((acc, item) => {
        return acc + Number(item.valor);
      }, 0);

      const total = Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });

      return {
        id: user.id,
        nome: user.nome,
        valor,
        total,
      };
    }).sort((a, b) => Number(b.valor) - Number(a.valor));

    const po = data
      .map((h, i) => {
        const po = i + 1;
        return {
          ...h,
          posicao: `${po}º`,
        };
      })
      .find(h => h.id === user.id);

    return po;
  }, [FindAllUser, findEntrada, user.id]);

  const Saida = useMemo(() => {
    const data = FindAllUser.map((user, i) => {
      const filtroConsumo = findSaida.filter(h => {
        if (h.consumidor_id === user.id) {
          return h;
        }
      });

      const valor = filtroConsumo.reduce((acc, item) => {
        return acc + Number(item.valor);
      }, 0);

      const total = Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });

      return {
        id: user.id,
        nome: user.nome,
        valor,
        total,
      };
    }).sort((a, b) => Number(b.valor) - Number(a.valor));

    const po = data
      .map((h, i) => {
        const po = i + 1;
        return {
          ...h,
          posicao: `${po}º`,
        };
      })
      .find(h => h.id === user.id);

    return po;
  }, [FindAllUser, findSaida, user.id]);

  const ranking = useMemo(() => {
    const presensa = PresencaRanking.find(h => h.user_id === user.id);
    const padrinho = Padrinho.find(h => h.user_id === user.id);
    const indicacao = Indicacao.find(h => h.user_id === user.id);
    return { presensa, padrinho, indicacao };
  }, [Indicacao, Padrinho, PresencaRanking, user.id]);

  return (
    <Container>
      <HeaderContaponent title="Ranking geral" onMessage="of" type="tipo1" />
      <BoxAvatar source={{ uri: user.avatarUrl }} />
      {load ? (
        <ActivityIndicator size="large" color={theme.colors.focus_second} />
      ) : (
        <>
          <BoxEventos>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <BoxContainer>
                <Title>Entrada</Title>
              </BoxContainer>

              <BoxPosition>
                <Title>{Entrada.posicao}</Title>
              </BoxPosition>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <BoxContainer>
                <Title>Saida</Title>
              </BoxContainer>

              <BoxPosition>
                <Title>{Saida.posicao}</Title>
              </BoxPosition>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <BoxContainer>
                <Title>Indicações</Title>
              </BoxContainer>

              <BoxPosition>
                <Title>{ranking.indicacao.posicao}</Title>
              </BoxPosition>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <BoxContainer>
                <Title>Presença</Title>
              </BoxContainer>

              <BoxPosition>
                <Title>{ranking.presensa.position}</Title>
              </BoxPosition>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <BoxContainer>
                <Title>Padrinho</Title>
              </BoxContainer>

              <BoxPosition>
                <Title>{ranking.padrinho.posicao}</Title>
              </BoxPosition>
            </View>
          </BoxEventos>
        </>
      )}
    </Container>
  );
}
