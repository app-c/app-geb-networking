/* eslint-disable camelcase */
export interface IUserDto {
  id: string;
  nome: string;
  workName: string;
  adm: boolean;
  ramo: string;
  email: string;
  enquadramento: string;
  indicacao: number;
  whats: string;
  links: string[];
  presenca: {
    avatar: string;
    createdAt: string;
    nome: string;
    presenca: boolean;
    user_id: string;
  }[];
  CPF: string;
  CNPJ: string;
  padrinhQuantity: number;
  avatarUrl: string;
  logoUrl: string;
  inativo: boolean;
}
