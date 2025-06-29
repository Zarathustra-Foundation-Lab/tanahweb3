import { ActorSubclass } from "@dfinity/agent"; // Tambahkan Principal
import { _SERVICE } from "../../../declarations/rwa-icp-backend/rwa-icp-backend.did"; // Import tipe service
import { Principal } from "@dfinity/principal";
import { rwa_icp_backend } from "../../../declarations/rwa-icp-backend";

/**
 * Fungsi ini membuat objek layanan untuk interaksi dengan canister yang terkait dengan 'pengguna'.
 * Ini menerima instance aktor canister yang sudah dibuat (bisa anonim atau terautentikasi).
 *
 * @param actor Instance aktor canister yang sudah tersedia dari AuthContext.
 * @returns Objek dengan metode untuk berinteraksi dengan layanan pengguna.
 */
export const createUserService = (
  actor: ActorSubclass<_SERVICE> = rwa_icp_backend
) => {
  if (!actor) {
    throw new Error("Aktor canister harus disediakan untuk userService.");
  }

  return {
    /**
     * Mengambil semua pengguna dari canister.
     * Ini mungkin fungsi admin atau publik tergantung implementasi Motoko Anda.
     */
    getUsers: async () => {
      return await actor.getUsers();
    },

    /**
     * Mengambil pengguna berdasarkan Principal.
     * Ini mungkin memerlukan autentikasi atau tidak, tergantung logic Motoko.
     */
    getUserByPrincipal: async (principal: Principal) => {
      return await actor.getUserByPrincipal(principal);
    },

    /**
     * Mengambil pengguna berdasarkan username.
     * Ini mungkin memerlukan autentikasi atau tidak, tergantung logic Motoko.
     */
    getUserByUsername: async (username: string) => {
      return await actor.getUserByUsername(username);
    },

    /**
     * Mendaftarkan pengguna baru di canister.
     * Fungsi ini sangat memerlukan caller yang terautentikasi.
     *
     * @param username Username yang akan didaftarkan.
     * @param payload Objek User.User yang berisi detail pengguna.
     * @returns Tuple [boolean (sukses/gagal), optional User.User (jika sukses) atau error (jika gagal)].
     */
    signup: async (username: string, payload: any) => {
      // Sesuaikan 'any' dengan tipe User.User yang benar
      // Di sini kita langsung memanggil fungsi Signup di aktor.
      // Aktor ini sudah berasal dari AuthContext dan membawa identitas caller.
      return await actor.Signup(username, payload);
    },
  };
};
