// import { ActorSubclass } from "@dfinity/agent"; // Tidak perlu di sini lagi
import { ActorSubclass } from "@dfinity/agent";
import { _SERVICE } from "../../../declarations/rwa-icp-backend/rwa-icp-backend.did"; // Import tipe service
import { rwa_icp_backend } from "../../../declarations/rwa-icp-backend";

/**
 * Fungsi ini membuat objek layanan untuk interaksi dengan canister yang terkait dengan 'item'.
 * Ini menerima instance aktor canister yang sudah dibuat (bisa anonim atau terautentikasi).
 *
 * @param actor Instance aktor canister yang sudah tersedia dari AuthContext.
 * @returns Objek dengan metode untuk berinteraksi dengan layanan item.
 */
export const createItemService = (
  actor: ActorSubclass<_SERVICE> = rwa_icp_backend
) => {
  if (!actor) {
    throw new Error("Aktor canister harus disediakan untuk itemService.");
  }

  return {
    /**
     * Mengambil semua item dari canister.
     * Ini biasanya adalah fungsi query publik yang tidak memerlukan autentikasi khusus.
     */
    getItems: async () => {
      return await actor.getItems();
    },

    getItem: async (id: number) => {
      return await actor.getItem(BigInt(id));
    },

    /**
     * Mengambil koleksi item untuk pengguna yang sedang login.
     * Fungsi ini memerlukan caller yang terautentikasi.
     * Ini akan gagal jika aktor adalah anonim saat dipanggil di Motoko.
     */
    getUserCollection: async () => {
      // Catatan: Pemeriksaan Principal.isAnonymous() tidak dilakukan di sini
      // karena AuthContext sudah menyediakan aktor yang sesuai.
      // Error akan ditangani oleh canister jika dipanggil tanpa autentikasi yang tepat.
      return await actor.getUserCollection();
    },

    createItem: async (payload) => {
      return await actor.createItem(payload);
    },

    setListingItem: async (id: number) => {
      const [success, message] = await actor.setListingItem(BigInt(id));

      return { success, message };
    },

    requestBuy: async (itemId: number) => {
      const [success, message] = await actor.requestBuyItem(BigInt(itemId));

      return { success, message };
    },

    // Tambahkan fungsi-fungsi lain yang terkait dengan item di sini
  };
};
