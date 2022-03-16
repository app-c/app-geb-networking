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
import { Loading } from "../../components/Loading";

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
  pontosEntrada: number;
}

interface PropsSaida {
  createdAt: string;
  descricao: string;
  consumidor: string;
  type: string;
  valor: string;
  pontosSaida: number;
}

interface IPresenca {
  padrinho: number;
  qntPresença: number;
  user_id: string;
  pontosPresença: number;
}

interface IQnt {
  qntPadrinho: number;
  qntPresenca: number;
  qntIndicacao: number;
  user_id: string;
  pontosPresença: number;
  pontosPadrinho: number;
  pontosIndicaçao: number;
}

export function Classificaçao() {
  const { user } = useAuth();
  const db = getFirestore();
  const colectUsers = collection(db, "users");
  const colectTransaction = collection(db, "transaction");
  const colectPresenca = collection(db, colecao.presenca);

  const [FindAllUser, setFindAllUsers] = useState<IUserDto[]>([]);
  const [findEntrada, setFindEntrada] = useState<PropsEntrada[]>([]);
  const [findSaida, setFindSaida] = useState<PropsSaida[]>([]);
  const [qntGeral, setQntGeral] = useState<IQnt[]>([]);
  const [presenca, setPresenca] = useState<[]>([]);

  const [load, setLoad] = useState(true);
  const [loadEntrada, setLoadEntrada] = useState(true);

  useEffect(() => {
    getDocs(colectUsers).then(h => {
      const res = h.docs.map(p => {
        return p.data() as IUserDto;
      });
      setFindAllUsers(res);
    });

    getDocs(colectTransaction).then(h => {
      const trans = h.docs
        .map(p => p.data() as PropsEntrada)
        .filter(h => h.type === "saida")
        .map(h => {
          return {
            ...h,
            pontosSaida: 10,
          };
        });

      setFindSaida(trans);
    });

    getDocs(colectPresenca).then(res => {
      const re = res.docs.map(h => h.data());
      setPresenca(re);
    });
  }, [user.id]);

  const PresencaRanking = useMemo(() => {
    const data = FindAllUser.map((users, index) => {
      const filtroPresença = presenca.filter(
        h => h.user_id === users.id && h.presenca === true,
      );
      const qntPresenca = filtroPresença.length;
      const pontos = filtroPresença.length * 10;
      return {
        user_id: users.id,
        qntPresenca,
        pontos,
      };
    })
      .sort((a, b) => {
        return b.pontos - a.pontos;
      })
      .map((h, i) => {
        return {
          ...h,
          position: `${i + 1}º`,
        };
      })
      .find(h => h.user_id === user.id);

    return data;
  }, [FindAllUser, presenca, user.id]);

  const Padrinho = useMemo(() => {
    const data = FindAllUser.map((users, index) => {
      const qntPadrinho = users.padrinhQuantity;
      const pontos = users.padrinhQuantity * 35;
      return {
        user_id: users.id,
        qntPadrinho,
        pontos,
      };
    })
      .sort((a, b) => {
        return b.pontos - a.pontos;
      })
      .map((h, i) => {
        return {
          ...h,
          position: `${i + 1}º`,
        };
      })
      .find(h => h.user_id === user.id);

    return data;
  }, [FindAllUser, user.id]);

  const Indicacao = useMemo(() => {
    const data = FindAllUser.map((users, index) => {
      const qntPadrinho = users.indicacao;
      const pontos = users.indicacao * 15;
      return {
        user_id: users.id,
        qntPadrinho,
        pontos,
      };
    })
      .sort((a, b) => {
        return b.pontos - a.pontos;
      })
      .map((h, i) => {
        return {
          ...h,
          position: `${i + 1}º`,
        };
      })
      .find(h => h.user_id === user.id);

    return data;
  }, [FindAllUser, user.id]);

  useEffect(() => {
    getDocs(colectUsers).then(h => {
      const res = h.docs.map(p => {
        return p.data() as IUserDto;
      });
      setFindAllUsers(res);
    });

    getDocs(colectTransaction).then(h => {
      const trans = h.docs.map(p => {
        return p.data();
      });

      const fil = trans
        .filter(h => h.type === "entrada")
        .map(h => {
          return {
            ...h,
            pontosEntrada: 10,
          };
        });
      setFindEntrada(fil);
    });
  }, []);

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

      const pontos = filtroConsumo.reduce((acc, item) => {
        return acc + Number(item.pontosEntrada);
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
        pontos: filtroConsumo.length * 10,
        totalPontos: pontos,
      };
    })
      .sort((a, b) => {
        if (a.nome < b.nome) {
          return -1;
        }
      })
      .sort((a, b) => Number(b.totalPontos) - Number(a.totalPontos));

    const po = data
      .map((h, i) => {
        const po = i + 1;
        return {
          ...h,
          posicao: `${po}º`,
        };
      })
      .find(h => h.id === user.id);

    // setLoad(false);

    return po;
  }, [FindAllUser, findEntrada, user.id]);

  console.log(findSaida.filter(h => h.consumidor === user.id));
  const Saida = useMemo(() => {
    const data = FindAllUser.map((users, i) => {
      const filtroConsumo = findSaida.filter(h => {
        if (h.consumidor === users.id) {
          return h;
        }
      });

      const valor = filtroConsumo.reduce((acc, item) => {
        return acc + Number(item.valor);
      }, 0);

      const pontos = filtroConsumo.reduce((acc, item) => {
        return acc + Number(item.pontosSaida);
      }, 0);

      const total = Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });

      return {
        id: users.id,
        nome: users.nome,
        valor,
        total,
        pontos: filtroConsumo.length * 10,
        totalPontos: pontos,
      };
    })
      .sort((a, b) => {
        if (a.nome < b.nome) {
          return -1;
        }
      })
      .sort((a, b) => Number(b.pontos) - Number(a.pontos));

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

  useEffect(() => {
    setTimeout(() => {
      if (Entrada && Saida && PresencaRanking && Padrinho && Indicacao) {
        setLoad(false);
      }
    }, 1000);
  }, [Entrada, Saida, PresencaRanking, Padrinho, Indicacao]);

  return (
    <Container>
      <HeaderContaponent title="Ranking geral" onMessage="of" type="tipo1" />
      <BoxAvatar source={{ uri: user.avatarUrl }} />
      {load ? (
        <Loading />
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
                <Title>VENDAS</Title>
                <Title>{Entrada.totalPontos}pts</Title>
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
                <Title>COMPRAS</Title>
                <Title>{Saida.totalPontos}pts</Title>
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
                <Title>{Indicacao.pontos}pts</Title>
              </BoxContainer>

              <BoxPosition>
                <Title>{Indicacao.position}</Title>
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
                <Title>{PresencaRanking.pontos}pts</Title>
              </BoxContainer>

              <BoxPosition>
                <Title>{PresencaRanking.position}</Title>
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
                <Title>{Padrinho.pontos}pts</Title>
              </BoxContainer>

              <BoxPosition>
                <Title>{Padrinho.position}</Title>
              </BoxPosition>
            </View>
          </BoxEventos>
        </>
      )}
    </Container>
  );
}
