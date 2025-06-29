import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import LandCard from "@/components/LandCard";
import {
  User,
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  Link,
  Instagram,
  Facebook,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createUserService } from "@/services/UserService";
import { useAuthContext } from "@/services/auth";
import { createItemService } from "@/services/ItemService";

import { getNullableCandidString } from "@/lib/utils";

import { Item, Status, UserProfile as UserProfileType } from "@/types/type";
import { Principal } from "@dfinity/principal";

const UserProfile = () => {
  const { userId: username } = useParams();
  const { actor, principal: myPrincipal } = useAuthContext();

  const userService = createUserService();

  // const myItemService = createItemService(actor);
  const itemService = createItemService(actor);

  const [userLands, setUserLands] = useState<Item[]>([]);
  const [stats, setStats] = useState({
    landsOwned: 0,
    landsSold: 0,
    totalVolume: "0 ETH",
  });
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

  // fetch data user & lands
  useEffect(() => {
    (async () => {
      // Ambil data user
      const { "0": result } = await userService.getUserByUsername(
        username.toLowerCase()
      );

      if (result) {
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
      }

      const lands = await itemService.getUserCollection();
      // loop lands
      let _lands: Item[] = [];
      lands.forEach((land) => {
        let _status = land.status;

        _lands.push({
          current_owner: land.current_owner,
          title: land.title,
          description: land.description,
          document_hash: land.document_hash[0],
          id: Number(land.id),
          location: land.location,
          price: Number(land.price),
          images_hash: land.images_hash[0],
          status: Object.keys(land.status)[0] as Status,
          verifier: land.verifier[0] ? land.verifier[0].toString() : null,
          legal_identifier: land.legal_identifier[0],
        });
      });

      setUserLands(_lands);

      setStats({
        landsOwned: lands.length,
        landsSold: 0,
        totalVolume: "0 ICP",
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
              <p className="text-sm text-muted-foreground">
                @{user.username.toLowerCase()}
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Stats */}
              <Stats stats={stats} />

              <Separator />

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Information
                </h3>

                <div className="space-y-3">
                  {user.contact.website && (
                    <div className="flex items-center space-x-3">
                      <Link className="h-4 w-4 text-web3-cyan" />
                      <a href={user.contact.website}>
                        <p className="text-sm font-medium">Web</p>
                      </a>
                    </div>
                  )}

                  {user.contact.instagram && (
                    <div className="flex items-center space-x-3">
                      <Instagram className="h-4 w-4 text-web3-cyan" />
                      <a href={user.contact.instagram}>
                        <p className="text-sm font-medium">Instagram</p>
                      </a>
                    </div>
                  )}

                  {user.contact.facebook && (
                    <div className="flex items-center space-x-3">
                      <Facebook className="h-4 w-4 text-web3-cyan" />
                      <a href={user.contact.facebook}>
                        <p className="text-sm font-medium">Facebook</p>
                      </a>
                    </div>
                  )}
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
          <ActivityStats stats={stats} />

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
                    myPrincipal={myPrincipal}
                    thisPrincipalOwner={user.principal_id}
                    username={user.username}
                    id={land.id.toString()}
                    title={land.title}
                    description={land.description}
                    location={land.location}
                    status={land.status}
                    legal_identifier={land.legal_identifier ?? undefined}
                    verifier={land.verifier ?? undefined}
                    document_hash={land.document_hash ?? undefined}
                    images_hash={land.images_hash ?? undefined}
                    owner={land.current_owner.toString()}
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

function Stats({
  stats,
}: {
  stats: { landsOwned: number; landsSold: number; totalVolume: string };
}) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Lands Owned</span>
        <Badge variant="secondary">{stats.landsOwned}</Badge>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Lands Sold</span>
        <Badge variant="secondary">{stats.landsSold}</Badge>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Total Volume</span>
        <Badge className="bg-web3-green text-white">{stats.totalVolume}</Badge>
      </div>
    </div>
  );
}

function ActivityStats({
  stats,
}: {
  stats: { landsOwned: number; landsSold: number; totalVolume: string };
}) {
  return (
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
  );
}
