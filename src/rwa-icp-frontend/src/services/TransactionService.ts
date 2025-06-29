import { ActorSubclass } from "@dfinity/agent";
import { _SERVICE } from "../../../declarations/rwa-icp-backend/rwa-icp-backend.did"; // Import tipe service
import { rwa_icp_backend } from "../../../declarations/rwa-icp-backend";

/**
 * Fungsi ini membuat objek layanan untuk interaksi dengan canister yang terkait dengan 'transaksi'.
 * Ini menerima instance aktor canister yang sudah dibuat (bisa anonim atau terautentikasi).
 *
 * @param actor Instance aktor canister yang sudah tersedia dari AuthContext.
 * @returns Objek dengan metode untuk berinteraksi dengan layanan transaksi.
 */
export const createTransactionService = (
  actor: ActorSubclass<_SERVICE> = rwa_icp_backend
) => {
  if (!actor) {
    throw new Error(
      "Aktor canister harus disediakan untuk transactionService."
    );
  }

  return {
    /**
     * Mengambil semua transaksi dari canister.
     * Ini mungkin fungsi admin atau publik tergantung implementasi Motoko Anda.
     */
    getAllTransactions: async () => {
      return await actor.getAlltransaction();
    },

    /**
     * Mengambil transaksi untuk pengguna yang sedang login.
     * Fungsi ini memerlukan caller yang terautentikasi.
     */
    getMyTransactions: async () => {
      return await actor.getMyTransaction();
    },

    // Tambahkan fungsi-fungsi lain yang terkait dengan transaksi di sini
  };
};
