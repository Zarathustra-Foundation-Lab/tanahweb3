import React, {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  ReactNode,
} from "react";

// import {} from "@dfinity/auth-client/lib";
import { AuthClient } from "@dfinity/auth-client";

import { createActor } from "../../../declarations/rwa-icp-backend";
import { canisterId } from "../../../declarations/rwa-icp-backend/index.js";

// Menentukan penyedia identitas berdasarkan lingkungan
// Jika Anda menjalankan secara lokal dan ID canister Internet Identity Anda berbeda dari rdmx6-jaaaa-aaaaa-aaadq-cai,
// Anda perlu memperbarui URL di bawah ini.
const identityProvider =
  process.env.DFX_NETWORK === "ic"
    ? "https://identity.ic0.app" // Mainnet Internet Computer
    : "http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943"; // Local Internet Identity Canister ID

interface AuthState {
  actor: any | undefined;
  authClient: AuthClient | undefined;
  isAuthenticated: boolean;
  principal: string | undefined;
  isInitializing: boolean; // Menunjukkan apakah proses inisialisasi otentikasi sedang berlangsung
}

/**
 * Hook kustom untuk mengelola status otentikasi Internet Identity.
 * Menyediakan fungsi untuk login, logout, dan mengakses aktor serta principal.
 */
export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    actor: undefined,
    authClient: undefined,
    isAuthenticated: false,
    principal: undefined,
    isInitializing: true,
  });

  // Fungsi untuk memperbarui status otentikasi dan aktor
  const updateAuth = useCallback(async () => {
    try {
      // Buat AuthClient jika belum ada. Ini mencegah pembuatan ulang yang tidak perlu.
      const authClient = state.authClient || (await AuthClient.create());
      const identity = authClient.getIdentity();
      const isAuthenticated = await authClient.isAuthenticated();

      // Buat aktor dengan identitas yang diperoleh
      const actor = createActor(canisterId, {
        agentOptions: {
          identity,
        },
      });

      let currentPrincipal: string | undefined = undefined;
      if (isAuthenticated) {
        // Jika terautentikasi, gunakan principal dari identitas yang masuk
        currentPrincipal = identity.getPrincipal().toText();
      } else {
        // Jika tidak terautentikasi, gunakan principal anonim standar
        currentPrincipal = "2vxsx-fae"; // Principal anonim standar
      }

      // Perbarui status otentikasi
      setState((prevState) => ({
        ...prevState,
        actor,
        authClient,
        isAuthenticated,
        principal: currentPrincipal,
        isInitializing: false, // Inisialisasi selesai
      }));
    } catch (error) {
      console.error(
        "Gagal menginisialisasi klien otentikasi atau aktor:",
        error
      );
      setState((prevState) => ({
        ...prevState,
        isInitializing: false, // Inisialisasi selesai meskipun ada kesalahan
      }));
    }
  }, [state.authClient]); // Ketergantungan: hanya jalankan ulang jika authClient berubah

  // Efek samping untuk menginisialisasi otentikasi saat komponen dimuat
  useEffect(() => {
    updateAuth();
  }, [updateAuth]); // Ketergantungan: panggil ulang jika updateAuth berubah

  // Fungsi untuk memulai proses login
  const login = useCallback(async () => {
    if (!state.authClient) {
      console.error("Klien otentikasi belum diinisialisasi.");
      return;
    }
    await state.authClient.login({
      identityProvider,
      onSuccess: () => {
        // Panggil updateAuth setelah login berhasil untuk memperbarui status
        updateAuth();
      },
      // windowOpenerFeatures: `toolbar=0,location=0,menubar=0,width=500,height=600` // Opsi opsional untuk mengontrol jendela popup
    });
  }, [state.authClient, updateAuth]); // Ketergantungan: panggil ulang jika authClient atau updateAuth berubah

  // Fungsi untuk memulai proses logout
  const logout = useCallback(async () => {
    if (!state.authClient) {
      console.error("Klien otentikasi belum diinisialisasi.");
      return;
    }
    await state.authClient.logout();
    // Panggil updateAuth setelah logout berhasil untuk memperbarui status
    updateAuth();
  }, [state.authClient, updateAuth]); // Ketergantungan: panggil ulang jika authClient atau updateAuth berubah

  return {
    actor: state.actor,
    isAuthenticated: state.isAuthenticated,
    principal: state.principal,
    isInitializing: state.isInitializing,
    login,
    logout,
  };
};

// --- Konteks Otentikasi untuk akses global ---

interface AuthContextType {
  actor: any | undefined;
  isAuthenticated: boolean;
  principal: string | undefined;
  isInitializing: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

// Buat konteks React
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Komponen penyedia untuk membuat status otentikasi tersedia bagi komponen anak.
 * Bungkus komponen akar aplikasi Anda dengan AuthProvider.
 */

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const auth = useAuth(); // Gunakan hook useAuth di sini
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

/**
 * Hook kustom untuk mengkonsumsi status otentikasi dari konteks.
 * Pastikan untuk menggunakannya di dalam komponen yang dibungkus oleh AuthProvider.
 */
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext harus digunakan di dalam AuthProvider");
  }
  return context;
};
