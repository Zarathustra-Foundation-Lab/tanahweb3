import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import LandCard from "@/components/LandCard";
import { User as UserIcon, Phone, MessageCircle, MapPin } from "lucide-react";
import type { User as UserType } from "@/types";
import { rwa_icp_backend } from "../../../declarations/rwa-icp-backend";

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        if (userId) {
          const data = await rwa_icp_backend.getUserByUsername(userId);

          if (data.length) {
            const result = data[0];
            setUser({
              principal_id: result.principal_id,
              username: result.username,
              detail: {
                first_name: result.detail.first_name,
                last_name: result.detail.last_name,
                city: result.detail.city,
                country: result.detail.country,
                bio: result.detail.bio ?? "",
              },
              contact: {
                twitter: result.contact.twitter ?? "",
                instagram: result.contact.instagram ?? "",
                tiktok: result.contact.tiktok ?? "",
                youtube: result.contact.youtube ?? "",
                discord: result.contact.discord ?? "",
                twitch: result.contact.twitch ?? "",
                website: result.contact.website ?? "",
                facebook: result.contact.facebook ?? "",
              },
            });
          } else {
            setUser(null);
          }
        }
      } catch (e) {
        setUser(null);
      }
      setLoading(false);
    };
    fetchUser();
  }, [userId]);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="text-lg text-muted-foreground">Loading user profile...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="text-lg text-muted-foreground">User not found.</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1">
          <Card className="card-web3 sticky top-24">
            <CardHeader className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-web3-cyan to-web3-purple rounded-full mx-auto mb-4 flex items-center justify-center">
                <UserIcon className="h-12 w-12 text-white" />
              </div>
              <CardTitle className="text-xl">
                {user.detail.first_name} {user.detail.last_name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                @{user.username}
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Stats */}
              <Separator />

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Information
                </h3>
                
                <div className="space-y-3">
                  {user.contact.twitter && (
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="h-4 w-4 text-web3-cyan" />
                      <div>
                        <p className="text-sm font-medium">Twitter</p>
                        <p className="text-sm text-muted-foreground">{user.contact.twitter}</p>
                      </div>
                    </div>
                  )}
                  {user.contact.instagram && (
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="h-4 w-4 text-web3-cyan" />
                      <div>
                        <p className="text-sm font-medium">Instagram</p>
                        <p className="text-sm text-muted-foreground">{user.contact.instagram}</p>
                      </div>
                    </div>
                  )}
                  {user.contact.tiktok && (
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="h-4 w-4 text-web3-cyan" />
                      <div>
                        <p className="text-sm font-medium">TikTok</p>
                        <p className="text-sm text-muted-foreground">{user.contact.tiktok}</p>
                      </div>
                    </div>
                  )}
                  {user.contact.youtube && (
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="h-4 w-4 text-web3-cyan" />
                      <div>
                        <p className="text-sm font-medium">YouTube</p>
                        <p className="text-sm text-muted-foreground">{user.contact.youtube}</p>
                      </div>
                    </div>
                  )}
                  {user.contact.discord && (
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="h-4 w-4 text-web3-cyan" />
                      <div>
                        <p className="text-sm font-medium">Discord</p>
                        <p className="text-sm text-muted-foreground">{user.contact.discord}</p>
                      </div>
                    </div>
                  )}
                  {user.contact.twitch && (
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="h-4 w-4 text-web3-cyan" />
                      <div>
                        <p className="text-sm font-medium">Twitch</p>
                        <p className="text-sm text-muted-foreground">{user.contact.twitch}</p>
                      </div>
                    </div>
                  )}
                  {user.contact.website && (
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="h-4 w-4 text-web3-cyan" />
                      <div>
                        <p className="text-sm font-medium">Website</p>
                        <p className="text-sm text-muted-foreground">{user.contact.website}</p>
                      </div>
                    </div>
                  )}
                  {user.contact.facebook && (
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="h-4 w-4 text-web3-cyan" />
                      <div>
                        <p className="text-sm font-medium">Facebook</p>
                        <p className="text-sm text-muted-foreground">{user.contact.facebook}</p>
                      </div>
                    </div>
                  )}
                </div>

              <Separator />

              {/* Location */}
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{user.detail.city}, {user.detail.country}</span>
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

          {/* User's Lands */}
          <Card className="card-web3">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                {user.detail.first_name}'s Lands (0)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No lands available</h3>
                <p className="text-muted-foreground">
                  {user.detail.first_name} doesn't have any lands listed for sale at the moment.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
