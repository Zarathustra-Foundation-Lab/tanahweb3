import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import LandCard from "@/components/LandCard";
import { User, Phone, MessageCircle, MapPin, Calendar } from "lucide-react";
import type { User as UserType, Item, StatusItem } from "@/types";

const UserProfile = () => {
  const { userId } = useParams();

  // Mock user data matching the new types
  const user: UserType = {
    principal_id: "owner1",
    username: "alexchen_web3",
    detail: {
      first_name: "Alex",
      last_name: "Chen",
      bio: "Web3 real estate enthusiast and early adopter of digital land ownership. Specializing in prime metaverse locations and development-ready plots.",
      city: "New York",
      country: "United States"
    },
    contact: {
      callnumber: "+1 (555) 123-4567",
      instagram: "@alexchen_web3",
      whatapps: "+1 (555) 123-4567"
    },
    items_id: [1, 5, 6]
  };

  // Mock user's lands with correct StatusItem type
  const userLands = [
    {
      id: "1",
      title: "Prime Digital Estate",
      price: "2.5 ETH",
      area: "1,000 m²",
      status: "LISTED" as StatusItem,
      location: "Cyber District, Metaverse",
      owner: `${user.detail.first_name} ${user.detail.last_name}`
    },
    {
      id: "5",
      title: "Waterfront Virtual Plot",
      price: "3.8 ETH",
      area: "1,200 m²",
      status: "LISTED" as StatusItem,
      location: "Digital Shores, Web3",
      owner: `${user.detail.first_name} ${user.detail.last_name}`
    },
    {
      id: "6",
      title: "Commercial Zone Lot",
      price: "5.2 ETH", 
      area: "2,500 m²",
      status: "OWNED" as StatusItem,
      location: "Business District, Metaverse",
      owner: `${user.detail.first_name} ${user.detail.last_name}`
    }
  ];

  const stats = {
    landsOwned: user.items_id.length,
    landsSold: 12,
    totalVolume: "28.7 ETH"
  };

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
                @{user.username}
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Stats */}
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
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">{user.contact.callnumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="h-4 w-4 text-web3-cyan" />
                    <div>
                      <p className="text-sm font-medium">Instagram</p>
                      <p className="text-sm text-muted-foreground">{user.contact.instagram}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="h-4 w-4 text-web3-cyan" />
                    <div>
                      <p className="text-sm font-medium">WhatsApp</p>
                      <p className="text-sm text-muted-foreground">{user.contact.whatapps}</p>
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
                  <LandCard key={land.id} {...land} />
                ))}
              </div>
              
              {userLands.length === 0 && (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No lands available</h3>
                  <p className="text-muted-foreground">
                    {user.detail.first_name} doesn't have any lands listed for sale at the moment.
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
