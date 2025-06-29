import { Item } from "@/types/type";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getNullableCandidString = (val: any): string | null => {
  if (Array.isArray(val) && val.length === 0) {
    return null; // Representasi Candid untuk null/None
  }
  if (Array.isArray(val) && val.length > 0) {
    return val[0]; // Ambil nilai dari array jika ada
  }
  // Kasus tambahan jika backend mengembalikan string langsung (tidak opsional)
  if (typeof val === "string") {
    return val;
  }
  // Kasus untuk Principal yang mungkin di-string-kan
  if (val && typeof val === "object" && "toText" in val) {
    return val.toText();
  }
  return null;
};

export const statusToString = (status: any): Item["status"] => {
  if (typeof status === "object" && status !== null) {
    const keys = Object.keys(status);
    if (keys.length > 0) {
      const statusKey = keys[0];
      // Mengambil nama status (misal: "INITIAL" dari { INITIAL: null })
      const normalizedStatus = statusKey.toUpperCase();
      // Memastikan status yang dikembalikan adalah salah satu dari tipe Item["status"]
      if (
        ["INITIAL", "FOR_SALE", "PENDING_SALE", "OWNED", "DELISTED"].includes(
          normalizedStatus
        )
      ) {
        return normalizedStatus as Item["status"];
      }
    }
  }
  return "INITIAL"; // Default jika tidak ada status yang cocok
};

// Menentukan warna badge status
export const getStatusColor = (status: Item["status"]) => {
  switch (status) {
    case "FOR_SALE":
      return "bg-web3-green text-white";
    case "OWNED":
      return "bg-web3-purple text-white";
    case "PENDING_SALE":
      return "bg-yellow-500 text-white";
    case "DELISTED":
      return "bg-destructive text-destructive-foreground";
    case "INITIAL":
    default:
      return "bg-muted text-muted-foreground";
  }
};
