
export interface UserContact {
  callnumber: string;
  instagram: string;
  whatapps: string;
}

export interface UserInformation {
  first_name: string;
  last_name: string;
  bio: string;
  city: string;
  country: string;
}

export interface User {
  principal_id: string;
  username: string;
  detail: UserInformation;
  contact: UserContact;
  items_id: number[];
}

export interface LocationItem {
  lat: string[];
  long: string[];
  polygon: string;
  total_area: string;
}

export type StatusItem = 'LISTED' | 'OWNED' | 'CONFLIG';

export interface Item {
  item_id: number;
  current_owner: string;
  title_name: string;
  description: string;
  location: LocationItem;
  status: StatusItem;
  image_urls: string[];
}

export interface TransactionDetail {
  transaction_id: number;
  listing_id: number;
  listing_item: Item;
  seller_principal: string;
  buyer_principal: string;
  dealing_price: number;
  datetime: number;
  notes: string;
}
