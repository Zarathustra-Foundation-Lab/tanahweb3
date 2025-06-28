
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import MapView from "@/components/MapView";
import { ArrowLeft, MapPin, User, Phone, MessageCircle } from "lucide-react";
import type { Item, StatusItem, User as UserType } from "@/types";

const LandDetail = () => {
  const { id } = useParams();

  // Mock data matching new types
  const land: Item = {
    item_id: 1,
    current_owner: "owner1",
    title_name: "Prime Digital Estate",
    description: "Premium digital real estate located in the heart of the Cyber District. This expansive plot offers excellent development potential with proximity to major virtual attractions and transportation hubs.",
    location: {
      lat: ["40.7128"],
      long: ["-74.006"],
      polygon: "[[-74.006, 40.7128], [-74.005, 40.7128], [-74.005, 40.7138], [-74.006, 40.7138], [-74.006, 40.7128]]",
      total_area: "1,000 m²"
    },
    status: "LISTED",
    image_urls: []
  };

  const owner: UserType = {
    principal_id: "owner1",
    username: "alexchen_web3",
    detail: {
      first_name: "Alex",
      last_name: "Chen",
      bio: "",
      city: "New York",
      country: "United States"
    },
    contact: {
      callnumber: "+1 (555) 123-4567",
      instagram: "@alexchen_web3",
      whatapps: "+1 (555) 123-4567"
    },
    items_id: [1]
  };

  const coordinates: [number, number] = [parseFloat(land.location.long[0]), parseFloat(land.location.lat[0])];
  
  // Parse polygon from string (simple format)
  const polygon: [number, number][] = [
    [parseFloat(land.location.long[0]) - 0.001, parseFloat(land.location.lat[0]) - 0.001],
    [parseFloat(land.location.long[0]) + 0.001, parseFloat(land.location.lat[0]) - 0.001],
    [parseFloat(land.location.long[0]) + 0.001, parseFloat(land.location.lat[0]) + 0.001],
    [parseFloat(land.location.long[0]) - 0.001, parseFloat(land.location.lat[0]) + 0.001],
    [parseFloat(land.location.long[0]) - 0.001, parseFloat(land.location.lat[0]) - 0.001]
  ];

  const getStatusColor = (status: StatusItem) => {
    switch (status) {
      case 'LISTED':
        return 'bg-web3-green text-white';
      case 'OWNED':
        return 'bg-web3-purple text-white';
      case 'CONFLIG':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Link>
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title and Status */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{land.title_name}</h1>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                {owner.detail.city}, {owner.detail.country}
              </div>
            </div>
            <Badge className={getStatusColor(land.status)} variant="secondary">
              {land.status}
            </Badge>
          </div>

          {/* Map */}
          <Card className="card-web3">
            <CardHeader>
              <CardTitle>Land Location & Boundaries</CardTitle>
            </CardHeader>
            <CardContent>
              <MapView
                center={coordinates}
                zoom={15}
                polygon={polygon}
                markers={[
                  {
                    position: coordinates,
                    title: land.title_name,
                    price: "2.5 ETH"
                  }
                ]}
                height="400px"
              />
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Latitude:</span>
                  <span className="ml-2 font-mono">{land.location.lat[0]}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Longitude:</span>
                  <span className="ml-2 font-mono">{land.location.long[0]}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="card-web3">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {land.description}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price & Details */}
          <Card className="card-web3">
            <CardHeader>
              <CardTitle>Land Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold web3-gradient font-mono mb-2">
                  2.5 ETH
                </div>
                <div className="text-sm text-muted-foreground">Current Price</div>
              </div>
              
              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Area</span>
                  <span className="font-semibold">{land.location.total_area}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge className={getStatusColor(land.status)} variant="secondary">
                    {land.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Land ID</span>
                  <span className="font-mono text-sm">{land.item_id}</span>
                </div>
              </div>

              {land.status === 'LISTED' && (
                <Button asChild className="btn-web3 w-full">
                  <Link to={`/buy/${land.item_id}`}>
                    Buy This Land
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Owner Information */}
          <Card className="card-web3">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Owner Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="font-semibold mb-1">
                  {owner.detail.first_name} {owner.detail.last_name}
                </div>
                <div className="text-sm text-muted-foreground">
                  @{owner.username}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-web3-cyan" />
                  <span className="text-sm">{owner.contact.callnumber}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageCircle className="h-4 w-4 text-web3-cyan" />
                  <span className="text-sm">{owner.contact.instagram}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageCircle className="h-4 w-4 text-web3-cyan" />
                  <span className="text-sm">{owner.contact.whatapps}</span>
                </div>
              </div>

              <Button asChild variant="outline" className="w-full">
                <Link to={`/profile/${owner.principal_id}`}>
                  View Owner Profile
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LandDetail;
