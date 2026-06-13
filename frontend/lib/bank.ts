import banksData from "./banks.json";

export type Bank = {
  name: string;
  ifsc: string;
  icon: string;
  branch: string;
  category: string;
};

type BanksDataset = {
  banks: {
    title: string;
    category: string;
    content: {
      name: string;
      ifsc: string;
      icon: string;
      branch: string;
    }[];
  }[];
};

const dataset = banksData as BanksDataset;

export const INDIAN_BANKS: Bank[] = dataset.banks
  .flatMap((group) =>
    group.content.map((bank) => ({
      ...bank,
      category: group.category,
    })),
  )
  .sort((a, b) => a.name.localeCompare(b.name));

export const getIndianBanks = () => INDIAN_BANKS;
