/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Alert } from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import { IUserDto } from "../DtosUser";

export interface User {
  id: string;
  nome: string;
  adm: boolean;
  padrinhQuantity: number;
}

interface SignInCred {
  email: string;
  senha: string;
}

interface AuthContexData {
  user: IUserDto | null;
  loading: boolean;
  signIn(credential: SignInCred): Promise<void>;
  signOut(): void;
  updateUser(user: IUserDto): Promise<void>;
  listUser: IUserDto[] | null;
}

const User_Collection = "@Geb:user";

export const AuthContext = createContext<AuthContexData>({} as AuthContexData);

export const AuthProvider: React.FC = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<IUserDto | null>(null);

  const [listUser, setListUser] = useState<IUserDto[]>([]);

  const LoadingUser = useCallback(async () => {
    setLoading(true);

    const storeUser = await AsyncStorage.getItem(User_Collection);

    if (storeUser) {
      const userData = JSON.parse(storeUser) as IUserDto;
      setUser(userData);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    LoadingUser();
  }, [LoadingUser]);

  const signIn = useCallback(async ({ email, senha }) => {
    const db = getFirestore();
    const fireAuth = getAuth();
    const colecao = collection(db, "users");

    signInWithEmailAndPassword(fireAuth, email, senha)
      .then(au => {
        const docRef = doc(colecao, au.user.uid);

        getDoc(docRef)
          .then(async profile => {
            const {
              nome,
              adm,
              padrinhQuantity,
              whats,
              workName,
              CNPJ,
              ramo,
              enquadramento,
              links,
              CPF,
              avatarUrl,
              logoUrl,
              indicacao,
              presenca,
              inativo,
            } = profile.data() as IUserDto;

            if (profile.exists) {
              const userData = {
                email: au.user.email,
                id: au.user.uid,
                nome,
                adm,
                whats,
                workName,
                CNPJ,
                CPF,
                ramo,
                enquadramento,
                links,
                padrinhQuantity,
                avatarUrl,
                logoUrl,
                indicacao,
                presenca,
                inativo,
              };
              await AsyncStorage.setItem(
                User_Collection,
                JSON.stringify(userData),
              );
              setUser(userData);
            }
          })
          .catch(err => {
            const { code } = err;
            Alert.alert(
              "Login",
              "Não foi possível carregar os dados do usuário",
            );
          });
      })
      .catch(err => {
        const { code } = err;
        if (code === "auth/user-not-found" || code === "auth/wrong-password") {
          return Alert.alert("Login", "usuário ou senha incorreto");
        }
        return Alert.alert("Login", "usuário nao encontrado");
      });
  }, []);

  useEffect(() => {
    setLoading(true);
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem(User_Collection);

    setUser(null);
  }, []);

  const updateUser = useCallback(async (user: IUserDto) => {
    await AsyncStorage.setItem(User_Collection, JSON.stringify(user));

    setUser(user);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        updateUser,
        listUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContexData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used with ..");
  }

  return context;
}
