import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuthContext } from "@/services/auth";
import { createUserService } from "@/services/UserService";
import { Principal } from "@dfinity/principal";

import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function Login() {
  const {
    login,
    isAuthenticated,
    authClient,
    principal: currentPrincipal,
    actor,
  } = useAuthContext();

  const [isUserRegistered, setIsUserRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    principal_id: currentPrincipal ?? Principal.anonymous(),
    username: "",
    detail: {
      first_name: "",
      last_name: "",
      city: "",
      country: "",
      bio: null, // Tetap null di sini untuk input form
    },
    contact: {
      twitter: null, // Tetap null di sini untuk input form
      instagram: null,
      tiktok: null,
      youtube: null,
      discord: null,
      twitch: null,
      website: null,
      facebook: null,
    },
  });

  // Effect untuk memperbarui principal_id dan mengecek status pendaftaran
  useEffect(() => {
    updatePrincipalAndCheckRegistration();
  }, []);

  useEffect(() => {
    updatePrincipalAndCheckRegistration();
  }, [isAuthenticated, authClient, currentPrincipal]);

  const updatePrincipalAndCheckRegistration = async () => {
    if (isAuthenticated && authClient && currentPrincipal) {
      setFormData((prev) => ({ ...prev, principal_id: currentPrincipal }));

      try {
        // Asumsi createUserService().getUserByPrincipal(Principal) mengembalikan array User atau null
        // dan Anda mengecek keberadaan user di indeks 0.
        const userResult = await createUserService().getUserByPrincipal(
          currentPrincipal
        );
        setIsUserRegistered(userResult && userResult.length > 0); // Jika ada hasil, berarti terdaftar
      } catch (e) {
        console.error("Error checking user registration:", e);
        setIsUserRegistered(false); // Asumsikan belum terdaftar jika ada error
      }
    } else {
      // Reset state jika tidak terautentikasi
      setIsUserRegistered(false);
      setFormData((prev) => ({
        ...prev,
        principal_id: Principal.anonymous(),
      }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    const setNestedState = (
      parentKey: "detail" | "contact",
      fieldName: string
    ) => {
      setFormData((prev) => ({
        ...prev,
        [parentKey]: {
          ...prev[parentKey],
          [fieldName]: value === "" ? null : value, // Kunci: Ubah string kosong menjadi null
        },
      }));
    };

    if (name.startsWith("detail.")) {
      setNestedState("detail", name.split(".")[1]);
    } else if (name.startsWith("contact.")) {
      setNestedState("contact", name.split(".")[1]);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSignupUserData = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Pastikan principal_id sudah terisi sebelum mengirim
    if (formData.principal_id.isAnonymous()) {
      setError("Principal ID is not set. Please log in first.");
      setIsLoading(false);
      return;
    }

    // --- KUNCI SOLUSI UTAMA: Konversi null ke [] dan nilai ada ke [value] ---
    const transformOptionalText = (textValue: string | null) => {
      return textValue === null || textValue === "" ? [] : [textValue];
    };

    const payloadToSend = {
      ...formData,
      detail: {
        ...formData.detail,
        bio: transformOptionalText(formData.detail.bio),
      },
      contact: {
        ...formData.contact,
        twitter: transformOptionalText(formData.contact.twitter),
        instagram: transformOptionalText(formData.contact.instagram),
        tiktok: transformOptionalText(formData.contact.tiktok),
        youtube: transformOptionalText(formData.contact.youtube),
        discord: transformOptionalText(formData.contact.discord),
        twitch: transformOptionalText(formData.contact.twitch),
        website: transformOptionalText(formData.contact.website),
        facebook: transformOptionalText(formData.contact.facebook),
      },
    };
    // --- AKHIR KUNCI SOLUSI ---

    try {
      // Panggil fungsi 'signup' di UserService Anda
      // Asumsi createUserService().signup(username, User) menerima username dan objek User
      // Note: Jika username sudah ada di User object, mungkin tidak perlu parameter terpisah di signup
      const { "0": success } = await createUserService(actor).signup(
        payloadToSend.username,
        payloadToSend
      ); // Gunakan payloadToSend
      setIsUserRegistered(success); // Set user sebagai terdaftar setelah sukses
    } catch (err: any) {
      console.error("Error during signup:", err);
      // Coba parse error message dari canister jika ada
      const errorMessage = err.message || "Unknown error";
      setError(`Failed to sign up: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // redirect jika user sudah login dan terdaftar di canister
  if (isUserRegistered && isAuthenticated) {
    return <Navigate to={"/"} replace />;
  }

  return (
    <div className="h-full flex flex-col justify-center items-center p-4">
      {isAuthenticated ? (
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-center mb-6">
            Sign up your data to continue
          </h3>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSignupUserData} className="space-y-4">
            {/* Input untuk Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username:
              </label>
              <Input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>

            {/* Input untuk Detail */}
            <h4 className="text-lg font-medium text-gray-800 border-b pb-2 mb-2">
              Personal Details
            </h4>
            <div>
              <label
                htmlFor="first_name"
                className="block text-sm font-medium text-gray-700"
              >
                First Name:
              </label>
              <Input
                type="text"
                id="first_name"
                name="detail.first_name"
                value={formData.detail.first_name}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label
                htmlFor="last_name"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name:
              </label>
              <Input
                type="text"
                id="last_name"
                name="detail.last_name"
                value={formData.detail.last_name}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                City:
              </label>
              <Input
                type="text"
                id="city"
                name="detail.city"
                value={formData.detail.city}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700"
              >
                Country:
              </label>
              <Input
                type="text"
                id="country"
                name="detail.country"
                value={formData.detail.country}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700"
              >
                Bio:
              </label>
              <Textarea
                id="bio"
                name="detail.bio"
                value={formData.detail.bio || ""} // Tampilkan sebagai string kosong jika null
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>

            {/* Input untuk Kontak (opsional) */}
            <h4 className="text-lg font-medium text-gray-800 border-b pb-2 mb-2">
              Social Contacts (Optional)
            </h4>
            <div>
              <label
                htmlFor="twitter"
                className="block text-sm font-medium text-gray-700"
              >
                Twitter:
              </label>
              <Input
                type="text"
                id="twitter"
                name="contact.twitter"
                value={formData.contact.twitter || ""}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label
                htmlFor="instagram"
                className="block text-sm font-medium text-gray-700"
              >
                Instagram:
              </label>
              <Input
                type="text"
                id="instagram"
                name="contact.instagram"
                value={formData.contact.instagram || ""}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label
                htmlFor="tiktok"
                className="block text-sm font-medium text-gray-700"
              >
                TikTok:
              </label>
              <Input
                type="text"
                id="tiktok"
                name="contact.tiktok"
                value={formData.contact.tiktok || ""}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label
                htmlFor="youtube"
                className="block text-sm font-medium text-gray-700"
              >
                YouTube:
              </label>
              <Input
                type="text"
                id="youtube"
                name="contact.youtube"
                value={formData.contact.youtube || ""}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label
                htmlFor="discord"
                className="block text-sm font-medium text-gray-700"
              >
                Discord:
              </label>
              <Input
                type="text"
                id="discord"
                name="contact.discord"
                value={formData.contact.discord || ""}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label
                htmlFor="twitch"
                className="block text-sm font-medium text-gray-700"
              >
                Twitch:
              </label>
              <Input
                type="text"
                id="twitch"
                name="contact.twitch"
                value={formData.contact.twitch || ""}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label
                htmlFor="website"
                className="block text-sm font-medium text-gray-700"
              >
                Website:
              </label>
              <Input
                type="text"
                id="website"
                name="contact.website"
                value={formData.contact.website || ""}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label
                htmlFor="facebook"
                className="block text-sm font-medium text-gray-700"
              >
                Facebook:
              </label>
              <Input
                type="text"
                id="facebook"
                name="contact.facebook"
                value={formData.contact.facebook || ""}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>

            <Button
              type="submit"
              className="w-full btn-web3"
              disabled={isLoading}
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </Button>
          </form>
        </div>
      ) : (
        <>
          <h3 className="text-black font-medium block mt-20">
            Login to get access this content
          </h3>
          <Button onClick={login} className="btn-web3 mt-5">
            Login
          </Button>
        </>
      )}
    </div>
  );
}
