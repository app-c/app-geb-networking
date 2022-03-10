/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { format } from "date-fns";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FlatList, ScrollView, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import {
  collection,
  getDocs,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Modalize } from "react-native-modalize";
import { HeaderContaponent } from "../../../components/HeaderComponent";
import theme from "../../../global/styles/theme";
import { locale } from "../../../utils/LocalStrigMoney";
import {
  Box,
  BoxClassificacao,
  BoxFiltro,
  BoxLista,
  Container,
  TitleFiltro,
  TitleList,
  TitleType,
} from "./styles";
import { IUserDto } from "../../../DtosUser";
import { Loading } from "../../../components/Loading";
import { ExtratoModal } from "../../../components/ExtratoModal";

interface IPropsTransaction {
  createdAt: string;
  descricao: string;
  prestador_id?: string;
  consumidor_id?: string;
  type: string;
  valor: string;
  ponto: number;
}

interface IQnt {
  qntPadrinho: number;
  qntPresenca: number;
  qntIndicacao: number;
  user_id: string;
  nome: string;
  workName: string;
}

export function Ranking() {
  const modalEntradaSaida = useRef<Modalize>(null);
  const [type, setType] = useState("entrada");
  const [filtro, setFiltro] = useState("mes");
  const [Users, setUsers] = useState<IUserDto[]>([]);
  const [responsePresenca, setResponsePresenca] = useState<[]>([]);
  const [findSaida, setFindSaida] = useState<IPropsTransaction[]>([]);
  const [findEntrada, setFindEntrada] = useState<IPropsTransaction[]>([]);
  const [extrato, setExtrato] = useState<IPropsTransaction[]>([]);
  const [extratoUser, setExtratoUser] = useState<IPropsTransaction[]>([]);

  const [qntGeral, setQntGeral] = useState<IQnt[]>([]);
  const [load, setLoad] = useState(true);

  const db = getFirestore();
  const colecaoUsers = collection(db, "users");
  const colecaoTransaction = collection(db, "transaction");
  const colecaoPresenca = collection(db, "preseça");

  // todo entrada ...................
  useEffect(() => {
    getDocs(colecaoUsers).then(h => {
      const res = h.docs.map(p => {
        return p.data() as IUserDto;
      });
      setUsers(res);
    });

    getDocs(colecaoTransaction).then(h => {
      const trans = h.docs
        .map(p => p.data() as IPropsTransaction)
        .filter(h => h.type === "entrada")
        .map(h => {
          return {
            ...h,
            ponto: 10,
          };
        });

      setFindEntrada(trans);
    });
  }, []);

  const Entrada = useMemo(() => {
    const data = Users.map((user, i) => {
      const filtroConsumo = findEntrada.filter(h => {
        if (h.prestador_id === user.id) {
          return h;
        }
      });

      const filtroData = filtroConsumo.find(h => h.prestador_id === user.id)!;

      const dataF = filtroData?.createdAt;

      const valor = filtroConsumo.reduce((acc, item) => {
        return acc + Number(item.valor);
      }, 0);

      const pontos = filtroConsumo.reduce((acc, item) => {
        return acc + Number(item.ponto);
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
        pontos,
        data: dataF,
        workName: user.workName,
      };
    })
      .sort((a, b) => Number(b.pontos) - Number(a.pontos))
      .filter(h => h.data !== undefined);

    const dataNowDia = new Date(Date.now()).getDate();
    const dataNowMes = new Date(Date.now()).getMonth() + 1;
    const dataNowAno = new Date(Date.now()).getFullYear();
    const dataNowHora = new Date(Date.now()).getHours();
    const dataNowMin = new Date(Date.now()).getMinutes();
    const dataN = new Date(Date.now());

    const filterMes = data.filter(p => {
      const [dia, mes, ano] = p.data.split("-").map(Number);
      if (mes === dataNowMes) {
        return p;
      }
    });

    const filterAno = data.filter(p => {
      if (dataN.getFullYear() === dataNowAno) {
        return p;
      }
    });

    if (filtro === "mes") {
      return filterMes.map((h, i) => {
        const po = i + 1;
        return {
          ...h,
          posicao: `${po}º`,
        };
      });
    }

    if (filtro === "ano") {
      return filterAno.map((h, i) => {
        const po = i + 1;
        return {
          ...h,
          posicao: `${po}º`,
        };
      });
    }

    if (filtro === "todos") {
      return data.map((h, i) => {
        const po = i + 1;
        return {
          ...h,
          posicao: `${po}º`,
        };
      });
    }
  }, [Users, filtro, findEntrada]);

  // todo Saida ........................
  useEffect(() => {
    onSnapshot(colecaoUsers, h => {
      const res = h.docs.map(p => {
        return p.data() as IUserDto;
      });

      setUsers(res);
    });

    onSnapshot(colecaoTransaction, h => {
      const trans = h.docs
        .map(p => p.data() as IPropsTransaction)
        .filter(h => h.type === "saida")
        .map(h => {
          return {
            ...h,
            ponto: 10,
          };
        });

      setFindSaida(trans);
    });
  }, []);

  const Saida = useMemo(() => {
    const data = Users.map((users, i) => {
      const filtroConsumo = findSaida.filter(h => {
        if (h.consumidor_id === users.id) {
          return h;
        }
      });
      console.log(filtroConsumo);

      const filtroData = filtroConsumo.find(h => h.prestador_id === users.id)!;

      const dataF = filtroData?.createdAt;

      const valor = filtroConsumo.reduce((acc, item) => {
        return acc + Number(item.valor);
      }, 0);

      const pontos = filtroConsumo.reduce((acc, item) => {
        return acc + Number(item.ponto);
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
        pontos,
        data: dataF,
        workName: users.workName,
      };
    })
      .sort((a, b) => Number(b.pontos) - Number(a.pontos))
      .filter(h => h.data !== undefined);

    const dataNowDia = new Date(Date.now()).getDate();
    const dataNowMes = new Date(Date.now()).getMonth() + 1;
    const dataNowAno = new Date(Date.now()).getFullYear();
    const dataNowHora = new Date(Date.now()).getHours();
    const dataNowMin = new Date(Date.now()).getMinutes();
    const dataN = new Date(Date.now());

    const filterMes = data.filter(p => {
      const [dia, mes, ano] = p.data.split("-").map(Number);
      if (mes === dataNowMes) {
        return p;
      }
    });

    const filterAno = data.filter(p => {
      if (dataN.getFullYear() === dataNowAno) {
        return p;
      }
    });

    if (filtro === "mes") {
      return filterMes.map((h, i) => {
        const po = i + 1;
        return {
          ...h,
          posicao: `${po}º`,
        };
      });
    }

    if (filtro === "ano") {
      return filterAno.map((h, i) => {
        const po = i + 1;
        return {
          ...h,
          posicao: `${po}º`,
        };
      });
    }

    if (filtro === "todos") {
      return data.map((h, i) => {
        const po = i + 1;
        return {
          ...h,
          posicao: `${po}º`,
        };
      });
    }
  }, [Users, filtro, findSaida]);

  // todo extrato entrada e saida ..................
  useEffect(() => {
    getDocs(colecaoTransaction).then(h => {
      const trans = h.docs.map(p => p.data() as IPropsTransaction);
      setExtrato(trans);
    });
  }, []);

  const Extrato = useCallback(
    (user_id: string) => {
      const re = extrato.filter(h => {
        if (h.consumidor_id === user_id || h.prestador_id === user_id) {
          return h;
        }
      });
      setExtratoUser(
        re.map(h => {
          const [dia, mes, ano, hora, min] = h.createdAt.split("-").map(Number);
          return {
            createdAt: `${dia}/${mes}/${ano} - ${hora}:${min}`,
            type: h.type,
            descricao: h.descricao,
            valor: h.valor,
          };
        }),
      );
      modalEntradaSaida.current.open();
    },
    [extrato],
  );

  // todo extrato presenca

  // todo ............................

  useEffect(() => {
    getDocs(colecaoPresenca).then(h => {
      const res = h.docs.map(h => h.data());
      setResponsePresenca(res);
    });
  }, []);

  useEffect(() => {
    const pres = Users.map((h, i) => {
      const presen = responsePresenca.filter(p => h.id === p.user_id);
      return {
        qntPadrinho: h.padrinhQuantity,
        qntPresenca: presen.length + 2,
        qntIndicacao: h.indicacao,
        user_id: h.id,
        nome: h.nome,
        workName: h.workName,
      };
    });

    setQntGeral(pres);
  }, [Users, responsePresenca]);

  const PresencaRanking = useMemo(() => {
    const st = qntGeral.sort((a, b) => {
      return b.qntPresenca - a.qntPresenca;
    });
    return st.map((h, i) => {
      return {
        ...h,
        qntPresenca: h.qntPresenca,
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
    setTimeout(() => {
      if (Entrada && Saida) {
        setLoad(false);
      }
    }, 1000);
  }, [Entrada, Saida]);

  return (
    <Container>
      <HeaderContaponent type="tipo1" onMessage="of" title="Classificação" />
      {load ? (
        <Loading />
      ) : (
        <>
          <Modalize ref={modalEntradaSaida}>
            {extratoUser.map(h => (
              <View key={h.createdAt}>
                <ExtratoModal
                  data={h.createdAt}
                  descricao={h.descricao}
                  type={h.type}
                  valor={h.valor}
                />
              </View>
            ))}
          </Modalize>
          <View
            style={{
              flexDirection: "row",
              padding: 25,
            }}
          >
            <ScrollView horizontal>
              <Box type={type === "entrada"} onPress={() => setType("entrada")}>
                <TitleType type={type === "entrada"}>ENTRADA</TitleType>
              </Box>

              <Box type={type === "saida"} onPress={() => setType("saida")}>
                <TitleType type={type === "saida"}>SAÍDA</TitleType>
              </Box>

              <Box
                type={type === "indicaçao"}
                onPress={() => setType("indicaçao")}
              >
                <TitleType type={type === "indicaçao"}>Indicações</TitleType>
              </Box>

              <Box
                type={type === "presença"}
                onPress={() => setType("presença")}
              >
                <TitleType type={type === "presença"}>Presença</TitleType>
              </Box>

              <Box
                type={type === "padrinho"}
                onPress={() => setType("padrinho")}
              >
                <TitleType type={type === "padrinho"}>Padrinho</TitleType>
              </Box>
            </ScrollView>
          </View>

          {type === "entrada" && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginBottom: RFValue(36),
              }}
            >
              <BoxFiltro
                onPress={() => setFiltro("mes")}
                filtro={filtro === "mes"}
              >
                <TitleFiltro filtro={filtro === "mes"}>MES</TitleFiltro>
              </BoxFiltro>

              <BoxFiltro
                onPress={() => setFiltro("ano")}
                filtro={filtro === "ano"}
              >
                <TitleFiltro filtro={filtro === "ano"}>Ano</TitleFiltro>
              </BoxFiltro>

              <BoxFiltro
                onPress={() => setFiltro("todos")}
                filtro={filtro === "todos"}
              >
                <TitleFiltro filtro={filtro === "todos"}>Todos</TitleFiltro>
              </BoxFiltro>
            </View>
          )}

          {type === "saida" && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginBottom: RFValue(36),
              }}
            >
              <BoxFiltro
                onPress={() => setFiltro("mes")}
                filtro={filtro === "mes"}
              >
                <TitleFiltro filtro={filtro === "mes"}>MES</TitleFiltro>
              </BoxFiltro>

              <BoxFiltro
                onPress={() => setFiltro("ano")}
                filtro={filtro === "ano"}
              >
                <TitleFiltro filtro={filtro === "ano"}>Ano</TitleFiltro>
              </BoxFiltro>

              <BoxFiltro
                onPress={() => setFiltro("todos")}
                filtro={filtro === "todos"}
              >
                <TitleFiltro filtro={filtro === "todos"}>Todos</TitleFiltro>
              </BoxFiltro>
            </View>
          )}

          <View style={{ marginTop: RFValue(20), paddingBottom: 200 }}>
            {type === "entrada" && (
              <FlatList
                data={Entrada}
                keyExtractor={h => h.id}
                renderItem={({ item: h }) => (
                  <TouchableOpacity
                    onPress={() => Extrato(h.id)}
                    style={{
                      paddingBottom: 20,
                      marginTop: 10,
                    }}
                  >
                    <BoxLista>
                      <BoxClassificacao>
                        <TitleList
                          style={{
                            fontSize: 26,
                            color: theme.colors.text_secundary,
                          }}
                        >
                          {h.posicao}
                        </TitleList>
                      </BoxClassificacao>
                      <View
                        style={{
                          flex: 1,
                          marginLeft: 20,
                        }}
                      >
                        <TitleList
                          style={{
                            fontSize: RFValue(20),
                            fontFamily: theme.fonts.blac,
                          }}
                        >
                          {" "}
                          {h.nome}{" "}
                        </TitleList>
                        <TitleList> {h.workName} </TitleList>
                      </View>

                      <View
                        style={{
                          alignItems: "center",
                          flex: 1,
                        }}
                      >
                        <TitleList
                          style={{
                            fontSize: RFValue(16),
                            fontFamily: theme.fonts.blac,
                            textAlign: "center",
                          }}
                        >
                          Valor consumido
                        </TitleList>
                        <TitleList>{h.total} </TitleList>
                      </View>
                    </BoxLista>
                  </TouchableOpacity>
                )}
              />
            )}

            {type === "saida" && (
              <FlatList
                data={Saida}
                keyExtractor={h => h.id}
                renderItem={({ item: h }) => (
                  <View
                    style={{
                      paddingBottom: 20,
                      marginTop: 10,
                    }}
                  >
                    <BoxLista>
                      <BoxClassificacao>
                        <TitleList
                          style={{
                            fontSize: 26,
                            color: theme.colors.text_secundary,
                          }}
                        >
                          {h.posicao}
                        </TitleList>
                      </BoxClassificacao>
                      <View
                        style={{
                          flex: 1,
                          marginLeft: 20,
                        }}
                      >
                        <TitleList
                          style={{
                            fontSize: RFValue(20),
                            fontFamily: theme.fonts.blac,
                          }}
                        >
                          {" "}
                          {h.nome}{" "}
                        </TitleList>
                        <TitleList> {h.workName} </TitleList>
                      </View>

                      <View
                        style={{
                          alignItems: "center",
                          flex: 1,
                        }}
                      >
                        <TitleList
                          style={{
                            fontSize: RFValue(16),
                            fontFamily: theme.fonts.blac,
                            textAlign: "center",
                          }}
                        >
                          Valor consumido
                        </TitleList>
                        <TitleList>{h.total} </TitleList>
                      </View>
                    </BoxLista>
                  </View>
                )}
              />
            )}

            {type === "indicaçao" && (
              <FlatList
                data={Indicacao}
                keyExtractor={h => h.user_id}
                renderItem={({ item: h }) => (
                  <View
                    style={{
                      paddingBottom: 20,
                      marginTop: 10,
                    }}
                  >
                    <BoxLista>
                      <BoxClassificacao>
                        <TitleList
                          style={{
                            fontSize: 26,
                            color: theme.colors.text_secundary,
                          }}
                        >
                          {h.posicao}
                        </TitleList>
                      </BoxClassificacao>
                      <View
                        style={{
                          flex: 1,
                          marginLeft: 20,
                        }}
                      >
                        <TitleList
                          style={{
                            fontSize: RFValue(20),
                            fontFamily: theme.fonts.blac,
                          }}
                        >
                          {" "}
                          {h.nome}{" "}
                        </TitleList>
                        <TitleList> {h.workName} </TitleList>
                      </View>

                      <View
                        style={{
                          alignItems: "center",
                          flex: 1,
                        }}
                      >
                        <TitleList
                          style={{
                            fontSize: RFValue(16),
                            fontFamily: theme.fonts.blac,
                            textAlign: "center",
                          }}
                        >
                          Quantidade
                        </TitleList>
                        <TitleList>{h.qntIndicacao} </TitleList>
                      </View>
                    </BoxLista>
                  </View>
                )}
              />
            )}

            {type === "presença" && (
              <FlatList
                data={PresencaRanking}
                keyExtractor={h => h.user_id}
                renderItem={({ item: h }) => (
                  <View
                    style={{
                      paddingBottom: 20,
                      marginTop: 10,
                    }}
                  >
                    <BoxLista>
                      <BoxClassificacao>
                        <TitleList
                          style={{
                            fontSize: 26,
                            color: theme.colors.text_secundary,
                          }}
                        >
                          {h.position}
                        </TitleList>
                      </BoxClassificacao>
                      <View
                        style={{
                          flex: 1,
                          marginLeft: 20,
                        }}
                      >
                        <TitleList
                          style={{
                            fontSize: RFValue(20),
                            fontFamily: theme.fonts.blac,
                          }}
                        >
                          {" "}
                          {h.nome}{" "}
                        </TitleList>
                        <TitleList> {h.workName} </TitleList>
                      </View>

                      <View
                        style={{
                          alignItems: "center",
                          flex: 1,
                        }}
                      >
                        <TitleList
                          style={{
                            fontSize: RFValue(16),
                            fontFamily: theme.fonts.blac,
                            textAlign: "center",
                          }}
                        >
                          Quantidade
                        </TitleList>
                        <TitleList>{h.qntPresenca} </TitleList>
                      </View>
                    </BoxLista>
                  </View>
                )}
              />
            )}

            {type === "padrinho" && (
              <FlatList
                data={Padrinho}
                keyExtractor={h => h.user_id}
                renderItem={({ item: h }) => (
                  <View
                    style={{
                      paddingBottom: 20,
                      marginTop: 10,
                    }}
                  >
                    <BoxLista>
                      <BoxClassificacao>
                        <TitleList
                          style={{
                            fontSize: 26,
                            color: theme.colors.text_secundary,
                          }}
                        >
                          {h.posicao}
                        </TitleList>
                      </BoxClassificacao>
                      <View
                        style={{
                          flex: 1,
                          marginLeft: 20,
                        }}
                      >
                        <TitleList
                          style={{
                            fontSize: RFValue(20),
                            fontFamily: theme.fonts.blac,
                          }}
                        >
                          {" "}
                          {h.nome}{" "}
                        </TitleList>
                        <TitleList> {h.workName} </TitleList>
                      </View>

                      <View
                        style={{
                          alignItems: "center",
                          flex: 1,
                        }}
                      >
                        <TitleList
                          style={{
                            fontSize: RFValue(16),
                            fontFamily: theme.fonts.blac,
                            textAlign: "center",
                          }}
                        >
                          Quantidade
                        </TitleList>
                        <TitleList>{h.qntPadrinho} </TitleList>
                      </View>
                    </BoxLista>
                  </View>
                )}
              />
            )}
          </View>
        </>
      )}
    </Container>
  );
}
