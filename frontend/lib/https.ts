import { api } from "./api";

export const transferMoney = async (toUserId: string, amount: number) => {
  const res = await api.post("/transfer", {
    amount,
    toUserId,
  });

  return res;
};
