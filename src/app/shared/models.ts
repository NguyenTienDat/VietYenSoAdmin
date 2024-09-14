export const STATUS_LIST = [
  {
    name: 'CHƯA ĐẶT',
    value: STATUS_DROPDOWN.NOT_ORDER_YET,
  },
  {
    name: 'ĐÃ ĐẶT',
    value: STATUS_DROPDOWN.ORDERED,
  },
  {
    name: 'ĐÃ NHẬN',
    value: STATUS_DROPDOWN.RECEIVED,
  },
  {
    name: 'ĐÃ TRẢ',
    value: STATUS_DROPDOWN.DELIVERY,
  },
  {
    name: 'DONE',
    value: STATUS_DROPDOWN.DONE,
  },
  {
    name: 'DELETED',
    value: STATUS_DROPDOWN.DELETED,
  },
];

export const enum STATUS_DROPDOWN {
  ORDERED = 0,
  RECEIVED = 1,
  DELIVERY = 2,
  DONE = 3,
  DELETED = 4,
  NOT_ORDER_YET = 5,
}
export interface INews {
  _id?: string;
  image?: string;
  link?: string;
  title?: string;
  date?: string;
  content?: string;
  created?: number;
  updated?: number;
}

export enum CONTEXT_MENU_EVENT {
  'DELETE_ACCEPT',
  'DELETE_REJECT_CANCEL',
  'CLONE_A_COPY',
}

export interface EnvironmentDB {
  HighlightNews: string;
  customers: string;
}

export const ENVIRONMENT_LIST: EnvironmentDB = {
  HighlightNews: 'HighlightNews',
  customers: 'customers',
};
