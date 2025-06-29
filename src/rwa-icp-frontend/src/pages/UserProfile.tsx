import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import LandCard from "@/components/LandCard";
import { User, Phone, MessageCircle, MapPin, Calendar } from "lucide-react";
import type { StatusItem } from "@/types";
import { useEffect, useState } from "react";
import { createUserService } from "@/services/UserService";
import { useAuthContext } from "@/services/auth";

import { getNullableCandidString } from "@/lib/utils";

import { Item, UserProfile as UserProfileType } from "@/types/type";
import { Principal } from "@dfinity/principal";

const userLands: Item[] = [
  {
    current_owner: Principal.fromText("aaaaa-aa"), // Contoh Principal. Ubah jika perlu
    description:
      "Kavling strategis di pusat kota digital, cocok untuk pembangunan residensial atau komersial. Akses mudah ke fasilitas publik.",
    document_hash: "QmWXYZ789abcDEF123ghiJKL456mnoPQR789", // Contoh hash dokumen IPFS
    id: 1,
    images_hash: "QmABCDEF123456789abcdefABCDEF123456789", // Contoh hash gambar IPFS
    location: {
      lat: ["-6.2088"], // Contoh koordinat Jakarta
      long: ["106.8456"],
      square_meters: 500,
    },
    status: "FOR_SALE", // Contoh status
    title: "Kavling Digital Jakarta Pusat",
    price: 15000000000000, // Harga dalam Nat (BigInt)
    verifier: null, // Contoh Principal verifier
    legal_identifier: "JP-2024-001", // Contoh identifikasi legal
  },
  {
    current_owner: Principal.fromText("bbbbb-bb"), // Contoh Principal lain
    description:
      "Tanah luas di pinggir danau virtual, pemandangan indah, ideal untuk villa mewah atau resor. Lingkungan tenang dan eksklusif.",
    document_hash: null, // Contoh tanpa dokumen
    id: 2,
    images_hash: "QmGHIJKL0987654321fedcbaFEDCBA0987654321", // Contoh hash gambar IPFS lain
    location: {
      lat: ["-7.7956"], // Contoh koordinat Yogyakarta
      long: ["110.3695"],
      square_meters: 1200,
    },
    status: "OWNED", // Contoh status
    title: "Tanah Tepi Danau Virtual Yogya",
    price: 25000000000000, // Harga dalam Nat (BigInt)
    verifier: null, // Contoh tanpa verifier
    legal_identifier: "YG-2023-005",
  },
  {
    current_owner: Principal.fromText("aaaaa-aa"), // Pemilik yang sama dengan item 1
    description:
      "Properti komersial di distrik bisnis metaverse. Potensi tinggi untuk toko atau kantor virtual. Dekat dengan pusat transportasi.",
    document_hash: "QmNOPQR987654321abcdefghIJKLMN987654321",
    id: 3,
    images_hash: "QmSTUVWx45678901234567890abcdefghijklmnopqrst",
    location: {
      lat: ["-8.6750"], // Contoh koordinat Bali
      long: ["115.2124"],
      square_meters: 750,
    },
    status: "PENDING_SALE", // Contoh status
    title: "Lahan Komersial Bali Metaverse",
    price: 18000000000000, // Harga dalam Nat (BigInt)
    verifier: Principal.fromText("2vxsx-fae").toString(),
    legal_identifier: "BL-2024-010",
  },
];

const UserProfile = () => {
  const { userId: username } = useParams();
  const { actor, principal: myPrincipal } = useAuthContext();
  const userService = createUserService(actor);

  const [user, setUser] = useState<UserProfileType>({
    principal_id: undefined,
    username: "",
    detail: {
      first_name: "",
      last_name: "",
      bio: "",
      city: "",
      country: "",
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

  // Mock user data matching the new types

  // Mock user's lands with correct StatusItem type

  const stats = {
    landsOwned: 15,
    landsSold: 12,
    totalVolume: "28.7 ETH",
  };

  // fetch data user
  useEffect(() => {
    (async () => {
      const { "0": result } = await userService.getUserByUsername(username);

      setUser({
        principal_id: result.principal_id,
        username: getNullableCandidString(result.username),
        detail: {
          first_name: getNullableCandidString(result.detail.first_name),
          last_name: getNullableCandidString(result.detail.last_name),
          city: getNullableCandidString(result.detail.city),
          country: getNullableCandidString(result.detail.country),
          bio: getNullableCandidString(result.detail.bio),
        },
        contact: {
          twitter: getNullableCandidString(result.contact.twitter),
          instagram: getNullableCandidString(result.contact.instagram),
          tiktok: getNullableCandidString(result.contact.tiktok),
          youtube: getNullableCandidString(result.contact.youtube),
          discord: getNullableCandidString(result.contact.discord),
          twitch: getNullableCandidString(result.contact.twitch),
          website: getNullableCandidString(result.contact.website),
          facebook: getNullableCandidString(result.contact.facebook),
        },
      });
    })();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1">
          <Card className="card-web3 sticky top-24">
            <CardHeader className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-web3-cyan to-web3-purple rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="h-12 w-12 text-white" />
              </div>
              <CardTitle className="text-xl">
                {user.detail.first_name} {user.detail.last_name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Stats */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Lands Owned
                  </span>
                  <Badge variant="secondary">{stats.landsOwned}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Lands Sold
                  </span>
                  <Badge variant="secondary">{stats.landsSold}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Total Volume
                  </span>
                  <Badge className="bg-web3-green text-white">
                    {stats.totalVolume}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Information
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-web3-cyan" />
                    <div>
                      <p className="text-sm font-medium">Web</p>
                      <p className="text-sm text-muted-foreground">
                        {user.contact.website}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MessageCircle className="h-4 w-4 text-web3-cyan" />
                    <div>
                      <p className="text-sm font-medium">Instagram</p>
                      <p className="text-sm text-muted-foreground">
                        {user.contact.instagram}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MessageCircle className="h-4 w-4 text-web3-cyan" />
                    <div>
                      <p className="text-sm font-medium">facebook</p>
                      <p className="text-sm text-muted-foreground">
                        {user.contact.facebook}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline" className="text-xs">
                    <Phone className="h-3 w-3 mr-1" />
                    Call
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Message
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Location */}
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>
                  {user.detail.city}, {user.detail.country}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* About Section */}
          <Card className="card-web3">
            <CardHeader>
              <CardTitle>About {user.detail.first_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {user.detail.bio}
              </p>
            </CardContent>
          </Card>

          {/* Activity Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="card-web3 text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold web3-gradient mb-2">
                  {stats.landsOwned}
                </div>
                <p className="text-muted-foreground">Lands Currently Owned</p>
              </CardContent>
            </Card>

            <Card className="card-web3 text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold web3-gradient mb-2">
                  {stats.landsSold}
                </div>
                <p className="text-muted-foreground">Successful Sales</p>
              </CardContent>
            </Card>

            <Card className="card-web3 text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold web3-gradient mb-2 font-mono">
                  {stats.totalVolume}
                </div>
                <p className="text-muted-foreground">Total Trade Volume</p>
              </CardContent>
            </Card>
          </div>

          {/* User's Lands */}
          <Card className="card-web3">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                {user.detail.first_name}'s Lands ({userLands.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {userLands.map((land) => (
                  <LandCard
                    key={land.id}
                    id={land.id.toString()}
                    title={land.title}
                    owner={land.current_owner.toString()}
                    status={land.status}
                    location={{
                      lat: ["23"],
                      long: ["773"],
                      square_meters: 23,
                    }}
                  />
                ))}
              </div>

              {userLands.length === 0 && (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No lands available
                  </h3>
                  <p className="text-muted-foreground">
                    {user.detail.first_name} doesn't have any lands listed for
                    sale at the moment.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
