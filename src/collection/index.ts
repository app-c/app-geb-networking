export interface IColection {
  users: string;
  transaction: string;
  orderTransaction: string;
  orderIndication: string;
  post: string;
  presenca: string;
}

export const colecao = {
  users: "users",
  transaction: "transaction",
  orderTransaction: "order_transaction",
  orderIndication: "order_indication",
  post: "post",
  presenca: "presença",
} as IColection;
