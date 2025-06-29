import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button"; // Asumsi path ini valid melalui alias build system
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Asumsi path ini valid
import { Badge } from "@/components/ui/badge"; // Asumsi path ini valid
import { Separator } from "@/components/ui/separator"; // Asumsi path ini valid
import MapView from "../components/MapView"; // Mengubah path relatif untuk MapView

// Perbaikan path untuk rwa_icp_backend
import { Principal } from "@dfinity/principal"; // Ini adalah paket npm, pastikan sudah terinstal di proyek Anda
import { createUserService } from "../services/UserService"; // Mengubah path relatif untuk UserService
import { ArrowLeft, MapPin, MessageCircle, User } from "lucide-react";
import { createItemService } from "@/services/ItemService";
import {
  getNullableCandidString,
  getStatusColor,
  statusToString,
} from "@/lib/utils";
import { Item, UserProfile } from "@/types/type";

// =====================================================================
// LandDetail Component
// =====================================================================

const LandDetail = () => {
  const { id } = useParams<{ id: string }>(); // Tangkap ID dari URL
  const [land, setLand] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // State untuk informasi pemilik
  const [owner, setOwner] = useState<UserProfile>({
    principal_id: undefined, // Default Principal anonim
    username: null,
    detail: {
      first_name: null,
      last_name: null,
      city: null,
      country: null,
      bio: null,
    },
    contact: {
      twitter: null,
      instagram: null,
      tiktok: null,
      youtube: null,
      discord: null,
      twitch: null,
      website: null,
      facebook: null,
    },
  });

  // Fungsi untuk mengambil data pemilik berdasarkan Principal
  const fetchOwnerDetails = async (ownerPrincipal: Principal) => {
    try {
      const userService = createUserService();
      const userResult = await userService.getUserByPrincipal(ownerPrincipal);

      if (userResult && userResult.length > 0) {
        const ownerData = userResult[0];

        setOwner({
          principal_id: ownerData.principal_id,
          username: getNullableCandidString(ownerData.username),
          detail: {
            first_name: getNullableCandidString(ownerData.detail.first_name),
            last_name: getNullableCandidString(ownerData.detail.last_name),
            city: getNullableCandidString(ownerData.detail.city),
            country: getNullableCandidString(ownerData.detail.country),
            bio: getNullableCandidString(ownerData.detail.bio),
          },
          contact: {
            twitter: getNullableCandidString(ownerData.contact.twitter),
            instagram: getNullableCandidString(ownerData.contact.instagram),
            tiktok: getNullableCandidString(ownerData.contact.tiktok),
            youtube: getNullableCandidString(ownerData.contact.youtube),
            discord: getNullableCandidString(ownerData.contact.discord),
            twitch: getNullableCandidString(ownerData.contact.twitch),
            website: getNullableCandidString(ownerData.contact.website),
            facebook: getNullableCandidString(ownerData.contact.facebook),
          },
        });
      } else {
        // Jika pemilik tidak ditemukan, set ke nilai default 'Tidak Dikenal'
        setOwner((prev) => ({
          ...prev,
          username: "Unknown",
          detail: {
            first_name: "Unknown",
            last_name: "User",
            city: "N/A",
            country: "N/A",
            bio: null,
          },
        }));
        console.warn("Owner not found for principal:", ownerPrincipal.toText());
      }
    } catch (e: any) {
      console.error("Error fetching owner details:", e);
      // Handle error jika gagal mengambil data pemilik
      setOwner((prev) => ({
        ...prev,
        username: "Error",
        detail: {
          first_name: "Error",
          last_name: "Loading",
          city: "N/A",
          country: "N/A",
          bio: null,
        },
      }));
    }
  };

  useEffect(() => {
    const fetchLandAndOwner = async () => {
      setLoading(true);
      setErr(null);
      try {
        const natId = Number(id); // Konversi ID dari string ke number
        if (isNaN(natId)) {
          setErr("Invalid land ID.");
          setLoading(false);
          return;
        }

        // Ambil data item (land) dari backend
        const landResult = await createItemService().getItem(natId);

        if (!landResult || landResult.length === 0) {
          setErr("Land not found.");
          setLand(null);
          setLoading(false);
          return;
        }

        const result = landResult[0];

        // Map data yang diterima ke interface Item
        const mappedLand: Item = {
          id: Number(result.id),
          current_owner: result.current_owner || Principal.anonymous(),
          title: result.title,
          price: Number(result.price),
          description: result.description,
          location: {
            lat: result.location.lat,
            long: result.location.long,
            square_meters: result.location.square_meters,
          },
          status: statusToString(result.status),
          // Menggunakan helper function untuk optional fields
          legal_identifier: getNullableCandidString(result.legal_identifier),
          verifier: getNullableCandidString(result.verifier),
          document_hash: getNullableCandidString(result.document_hash),
          images_hash: getNullableCandidString(result.images_hash),
        };

        setLand(mappedLand); // Set state land

        // Setelah data land berhasil di-fetch, baru ambil data pemiliknya
        if (mappedLand.current_owner) {
          await fetchOwnerDetails(mappedLand.current_owner);
        }
      } catch (e: any) {
        console.error("Error fetching land detail:", e);
        setErr(`Failed to fetch land detail: ${e.message || "Unknown error"}`);
        setLand(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLandAndOwner(); // Panggil fungsi utama saat komponen dimuat atau ID berubah
  }, [id]); // Dependensi pada ID agar data di-fetch ulang jika ID berubah di URL

  // Mendapatkan koordinat untuk MapView
  const coordinates: [number, number] =
    land && land.location.lat.length > 0 && land.location.long.length > 0
      ? [parseFloat(land.location.lat[0]), parseFloat(land.location.long[0])]
      : [0, 0]; // Default jika koordinat tidak tersedia

  // Menampilkan pesan loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 font-['Inter']">
        <div className="text-center text-lg text-gray-700">
          Memuat detail tanah...
        </div>
      </div>
    );
  }

  // Menampilkan pesan error atau jika land tidak ditemukan
  if (err || !land) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-8 font-['Inter']">
        <div className="text-center text-destructive text-xl mb-4">
          {err || "Tanah tidak ditemukan"}
        </div>
        <Button variant="outline" asChild className="btn-web3-outline">
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Marketplace
          </Link>
        </Button>
      </div>
    );
  }

  // Tampilan utama detail tanah
  return (
    <div className="container mx-auto px-4 py-8 font-['Inter']">
      {/* Tombol kembali ke marketplace */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          asChild
          className="btn-web3-outline"
        >
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Marketplace
          </Link>
        </Button>
      </div>

      {/* Grid utama untuk konten */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Kolom Kiri: Konten Utama (Gambar, Deskripsi, Peta) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Judul dan Status */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{land.title}</h1>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                {owner.detail.city || "N/A"}, {owner.detail.country || "N/A"}
              </div>
            </div>
            <Badge className={getStatusColor(land.status)} variant="secondary">
              {land.status.replace("_", " ")}
            </Badge>
          </div>

          {/* Gambar Properti */}
          <Card className="card-web3">
            <CardHeader>
              <CardTitle>Gambar Properti</CardTitle>
            </CardHeader>
            <CardContent>
              {land.images_hash ? (
                <img
                  src={`https://ipfs.io/ipfs/${land.images_hash}`}
                  alt={`Image of ${land.title}`}
                  className="w-full h-96 object-cover rounded-lg shadow-md transition-transform duration-300 hover:scale-[1.01]"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      "https://placehold.co/600x400/ccc/white?text=Gambar+Tidak+Tersedia"; // Placeholder jika gambar gagal dimuat
                  }}
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-lg">
                  Tidak Ada Gambar Tersedia
                </div>
              )}
            </CardContent>
          </Card>

          {/* Map */}
          <Card className="card-web3">
            <CardHeader>
              <CardTitle>Lokasi & Batas Tanah</CardTitle>
            </CardHeader>
            <CardContent>
              <MapView
                center={coordinates}
                zoom={15}
                markers={[
                  {
                    position: coordinates,
                    title: land.title,
                    price: `${land.price} ICP`, // Tampilkan harga dari data land
                  },
                ]}
                height="400px"
              />
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Lintang:</span>
                  <span className="ml-2 font-mono">
                    {land.location.lat[0] || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Bujur:</span>
                  <span className="ml-2 font-mono">
                    {land.location.long[0] || "N/A"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Deskripsi */}
          <Card className="card-web3">
            <CardHeader>
              <CardTitle>Deskripsi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {land.description}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan: Detail & Informasi Pemilik */}
        <div className="space-y-6">
          {/* Harga & Detail Tambahan */}
          <Card className="card-web3">
            <CardHeader>
              <CardTitle>Detail Tanah</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold web3-gradient font-mono mb-2">
                  {land.price.toLocaleString()} ICP
                </div>
                <div className="text-sm text-muted-foreground">
                  Harga Saat Ini
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Area</span>
                  <span className="font-semibold">
                    {land.location.square_meters} m²
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status</span>
                  <Badge
                    className={getStatusColor(land.status)}
                    variant="secondary"
                  >
                    {land.status.replace("_", " ")}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">ID Tanah</span>
                  <span className="font-mono text-sm">{land.id}</span>
                </div>
                {land.legal_identifier && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      Identifikasi Legal
                    </span>
                    <span className="font-mono text-sm">
                      {land.legal_identifier}
                    </span>
                  </div>
                )}
                {land.document_hash && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Hash Dokumen</span>
                    <a
                      href={`https://ipfs.io/ipfs/${land.document_hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-sm text-blue-500 hover:underline truncate max-w-[150px]"
                      title={land.document_hash}
                    >
                      {"Lihat Dokumen (IPFS)..."}
                    </a>
                  </div>
                )}
                {land.images_hash && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Hash Gambar</span>
                    <a
                      href={`https://ipfs.io/ipfs/${land.images_hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-sm text-blue-500 hover:underline truncate max-w-[150px]"
                      title={land.images_hash}
                    >
                      {"Lihat Gambar (IPFS)..."}
                    </a>
                  </div>
                )}
                {land.verifier && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Verifier</span>
                    <span className="font-mono text-sm">{land.verifier}</span>
                  </div>
                )}
              </div>

              {land.status === "FOR_SALE" && (
                <Button asChild className="btn-web3 w-full">
                  <Link to={`/buy/${land.id}`}>Beli Tanah Ini</Link>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Informasi Pemilik */}
          <Card className="card-web3">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Informasi Pemilik
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="font-semibold mb-1">
                  {owner.detail.first_name || "N/A"}{" "}
                  {owner.detail.last_name || "N/A"}
                </div>
                <div className="text-sm text-muted-foreground">
                  @{owner.username || "N/A"}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                {owner.contact.facebook && (
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="h-4 w-4 text-web3-cyan" />
                    <span className="text-sm">{owner.contact.facebook}</span>
                  </div>
                )}
                {owner.contact.instagram && (
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="h-4 w-4 text-web3-cyan" />
                    <span className="text-sm">{owner.contact.instagram}</span>
                  </div>
                )}
                {owner.contact.website && (
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="h-4 w-4 text-web3-cyan" />
                    <span className="text-sm">{owner.contact.website}</span>
                  </div>
                )}
                {/* Tambahkan lebih banyak kontak jika perlu */}
              </div>

              {owner.principal_id && !owner.principal_id.isAnonymous() && (
                <Button
                  asChild
                  variant="outline"
                  className="w-full btn-web3-outline"
                >
                  <Link to={`/profile/${owner.username}`}>
                    Lihat Profil Pemilik
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LandDetail;
