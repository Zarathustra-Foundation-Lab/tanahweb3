import React, {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  ReactNode,
} from "react";

import { AuthClient } from "@dfinity/auth-client";
import { ActorSubclass } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";

// Import createCanisterActor dari file canister.ts yang baru Anda revisi
import { createCanisterActor, CANISTER_ID } from "./canister";
// Import tipe service untuk keamanan tipe
import { _SERVICE } from "../../../declarations/rwa-icp-backend/rwa-icp-backend.did";

// Menentukan penyedia identitas berdasarkan lingkungan.
// PENTING: Pastikan Anda memiliki CANISTER_ID_INTERNET_IDENTITY di process.env Anda
// saat menjalankan secara lokal (misalnya, di dfx.json atau .env).
const identityProvider =
  process.env.DFX_NETWORK === "ic"
    ? "https://identity.ic0.app" // Mainnet Internet Computer
    : `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943`; // Local Internet Identity Canister ID (contoh: rdmx6-jaaaa-aaaaa-aaadq-cai)

/**
 * Interface yang mendefinisikan struktur status otentikasi.
 */
interface AuthState {
  actor: ActorSubclass<_SERVICE> | undefined; // Aktor canister yang sudah terautentikasi (atau anonim)
  authClient: AuthClient | undefined; // Klien otentikasi dari DFINITY
  isAuthenticated: boolean; // Status apakah pengguna login
  principal: Principal | undefined; // Principal pengguna yang login (atau Principal.anonymous())
  isInitializing: boolean; // Status memuat saat otentikasi diinisialisasi
}

/**
 * Hook kustom `useAuth` untuk mengelola seluruh logika otentikasi.
 * Ini menangani inisialisasi AuthClient, pembuatan aktor, login, dan logout.
 */
export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    actor: undefined,
    authClient: undefined,
    isAuthenticated: false,
    principal: undefined,
    isInitializing: true, // Mulai dengan true karena kita sedang inisialisasi
  });

  /**
   * Fungsi helper untuk memperbarui status otentikasi dan membuat (atau memperbarui) aktor.
   * Dipanggil saat inisialisasi, setelah login, dan setelah logout.
   * @param client Instance AuthClient yang sudah ada (opsional).
   */
  const updateAuth = useCallback(
    async (client?: AuthClient) => {
      try {
        // Inisialisasi AuthClient jika belum ada di state atau tidak disediakan.
        const authClient =
          client || state.authClient || (await AuthClient.create());

        // Dapatkan identitas saat ini (bisa anonim atau yang terautentikasi).
        const identity = authClient.getIdentity();
        // Cek apakah pengguna saat ini terautentikasi (sudah login).
        const isAuthenticated = await authClient.isAuthenticated();

        // Buat aktor canister menggunakan createCanisterActor dari canister.ts.
        // createCanisterActor akan secara otomatis menangani host dan fetchRootKey.
        const actor: ActorSubclass<_SERVICE> = await createCanisterActor({
          identity: identity, // Berikan identitas yang diperoleh dari AuthClient
          host: identityProvider.includes("localhost")
            ? "http://localhost:4943"
            : "https://icp0.io", // Ini mungkin perlu disesuaikan dengan host produksi Anda
        });

        // Dapatkan principal dari identitas saat ini.
        const currentPrincipal = identity.getPrincipal();

        // Perbarui state aplikasi dengan semua informasi otentikasi yang baru.
        setState((prevState) => ({
          ...prevState,
          actor,
          authClient, // Pastikan authClient disimpan di state
          isAuthenticated,
          principal: currentPrincipal,
          isInitializing: false, // Set false karena inisialisasi telah selesai
        }));
      } catch (error) {
        console.error(
          "Gagal menginisialisasi klien otentikasi atau aktor:",
          error
        );
        // Pastikan isInitializing menjadi false meskipun ada error, agar aplikasi tidak stuck.
        setState((prevState) => ({
          ...prevState,
          isInitializing: false,
        }));
      }
    },
    [state.authClient] // Dependency array untuk useCallback
  );

  // Efek samping yang berjalan sekali saat komponen `AuthProvider` dimuat.
  useEffect(() => {
    updateAuth();
  }, [updateAuth]);

  /**
   * Fungsi untuk memulai proses login dengan Internet Identity.
   */
  const login = useCallback(async () => {
    if (!state.authClient) {
      console.error("Klien otentikasi belum diinisialisasi.");
      return;
    }
    await state.authClient.login({
      identityProvider, // Gunakan URL penyedia identitas yang sudah ditentukan
      onSuccess: () => {
        // Setelah login berhasil, panggil updateAuth untuk memperbarui status dan aktor.
        updateAuth(state.authClient);
      },
      onError: (error) => {
        console.error("Login gagal:", error);
      },
    });
  }, [state.authClient, updateAuth]);

  /**
   * Fungsi untuk memulai proses logout.
   */
  const logout = useCallback(async () => {
    if (!state.authClient) {
      console.error("Klien otentikasi belum diinisialisasi.");
      return;
    }
    await state.authClient.logout();
    // Setelah logout, panggil updateAuth untuk mereset aktor ke identitas anonim.
    updateAuth(state.authClient);
  }, [state.authClient, updateAuth]);

  // Kembalikan semua state dan fungsi yang bisa diakses oleh komponen lain.
  return {
    actor: state.actor,
    authClient: state.authClient, // Tambahkan authClient ke nilai yang dikembalikan
    isAuthenticated: state.isAuthenticated,
    principal: state.principal,
    isInitializing: state.isInitializing,
    login,
    logout,
  };
};

// --- Konteks Otentikasi untuk akses global ---

/**
 * Interface untuk tipe konteks otentikasi yang akan disediakan.
 */
interface AuthContextType {
  actor: ActorSubclass<_SERVICE> | undefined;
  authClient: AuthClient | undefined; // Tambahkan authClient di sini juga
  isAuthenticated: boolean;
  principal: Principal | undefined;
  isInitializing: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

// Buat konteks React.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Interface untuk props `AuthProvider`.
 */
interface AuthProviderProps {
  children: ReactNode; // Komponen anak yang akan dibungkus oleh provider ini.
}

/**
 * Komponen `AuthProvider`.
 * Bungkus seluruh aplikasi React Anda dengan komponen ini di `index.tsx` atau `App.tsx`.
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const auth = useAuth(); // Gunakan hook useAuth di sini
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

/**
 * Hook kustom `useAuthContext` untuk mengkonsumsi status otentikasi dari konteks.
 * Pastikan untuk menggunakannya di dalam komponen yang dibungkus oleh AuthProvider.
 */
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuthContext harus digunakan di dalam AuthProvider (pastikan komponen Anda dibungkus)"
    );
  }
  return context;
};
