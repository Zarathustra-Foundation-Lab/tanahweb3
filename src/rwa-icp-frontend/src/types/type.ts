import { Principal } from "@dfinity/principal";

export interface LocationItem {
  lat: string[];
  long: string[];
  square_meters: number;
}

export type Status =
  | "INITIAL"
  | "FOR_SALE"
  | "PENDING_SALE"
  | "OWNED"
  | "DELISTED";

// Interface untuk data item
export interface Item {
  id: number;
  current_owner: Principal;
  title: string;
  price: number;
  description: string;
  location: LocationItem;
  status: Status;
  legal_identifier: string | null; // Sudah di-handle sebagai string tunggal atau null
  verifier: string | null; // Sudah di-handle sebagai string tunggal atau null
  document_hash: string | null; // Sudah di-handle sebagai string tunggal atau null
  images_hash: string | null; // Sudah di-handle sebagai string tunggal atau null
}

// Interface untuk data profil pengguna
export interface UserProfile {
  principal_id: Principal | undefined;
  username: string | null;
  detail: {
    first_name: string | null;
    last_name: string | null;
    city: string | null;
    country: string | null;
    bio: string | null;
  };
  contact: {
    twitter: string | null;
    instagram: string | null;
    tiktok: string | null;
    youtube: string | null;
    discord: string | null;
    twitch: string | null;
    website: string | null;
    facebook: string | null;
  };
}
