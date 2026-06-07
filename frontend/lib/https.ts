import { api } from "./api";

export const transferMoney = async (
  toUserId: string,
  amount: number,
  fromAccountId?: string,
) => {
  const payload: any = {
    to: toUserId,
    amount,
  };

  if (fromAccountId) payload.fromAccountId = fromAccountId;

  const res = await api.post("/account/transfer", payload);

  return res;
};
