import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import MapView from "@/components/MapView";
import { ArrowLeft, MapPin, User, Phone, MessageCircle } from "lucide-react";
import { rwa_icp_backend } from "declarations/rwa-icp-backend";

export interface LocationItem {
  lat: string[];
  long: string[];
  square_meters: number;
}

export interface Item {
  id: number;
  current_owner: string;
  title: string;
  description: string;
  location: LocationItem;
  status: "INITIAL" | "FOR_SALE" | "PENDING_SALE" | "OWNED" | "DELISTED";
  legal_identifier?: string | null;
  verifier?: string | null;
  document_hash?: string | null;
  images_hash?: string | null;
}

const statusToString = (status: any) => {
  if (status["INITIAL"]) return "INITIAL";
  if (status["FOR_SALE"]) return "FOR_SALE";
  if (status["PENDING_SALE"]) return "PENDING_SALE";
  if (status["OWNED"]) return "OWNED";
  if (status["DELISTED"]) return "DELISTED";
  return "INITIAL";
};

const getStatusColor = (status: Item['status']) => {
  switch (status) {
    case "FOR_SALE":
      return "bg-web3-green text-white";
    case "OWNED":
      return "bg-web3-purple text-white";
    case "PENDING_SALE":
      return "bg-yellow-500 text-white";
    case "DELISTED":
      return "bg-destructive text-destructive-foreground";
    case "INITIAL":
    default:
      return "bg-muted text-muted-foreground";
  }
};

const LandDetail = () => {
  const { id } = useParams();
  const [land, setLand] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const owner = {
    principal_id: land?.current_owner ?? "",
    username: "unknown_owner",
    detail: {
      first_name: "Unknown",
      last_name: "",
      bio: "",
      city: "-",
      country: "-"
    },
    contact: {
      callnumber: "-",
      instagram: "-",
      whatapps: "-"
    },
    items_id: []
  };

  useEffect(() => {
    const fetchLand = async () => {
      setLoading(true);
      setErr(null);
      try {
        const natId = Number(id);
        const land = await rwa_icp_backend.getItem(natId);
        
        console.log(land)

        if (!land) {
          setErr("Land not found");
          setLand(null);
        } else {
          const result = land[0];
          const getNullableString = (val: any) => {
            if (Array.isArray(val) && val.length === 0) return null;
            if (Array.isArray(val) && val.length > 0) return val[0];
            if (typeof val === "string") return val;
            if (val && val.toText) return val.toText();
            return null;
          };
          setLand({
            id: result.id,
            current_owner: result.current_owner.toText ? result.current_owner.toText() : result.current_owner,
            title: result.title,
            description: result.description,
            location: {
              lat: result.location.lat,
              long: result.location.long,
              square_meters: result.location.square_meters,
            },
            status: statusToString(result.status),
            legal_identifier: getNullableString(result.legal_identifier),
            verifier: getNullableString(result.verifier),
            document_hash: getNullableString(result.document_hash),
            images_hash: getNullableString(result.images_hash),
          });
        }
      } catch (e: any) {
        console.log(e)
        setErr("Failed to fetch land detail");
        setLand(null);
      }
      setLoading(false);
    };
    if (id) fetchLand();
  }, [id]);

  const polygon: [number, number][] = land && land.location.lat.length > 0 && land.location.long.length > 0
    ? [
        [parseFloat(land.location.long[0]) - 0.001, parseFloat(land.location.lat[0]) - 0.001],
        [parseFloat(land.location.long[0]) + 0.001, parseFloat(land.location.lat[0]) - 0.001],
        [parseFloat(land.location.long[0]) + 0.001, parseFloat(land.location.lat[0]) + 0.001],
        [parseFloat(land.location.long[0]) - 0.001, parseFloat(land.location.lat[0]) + 0.001],
        [parseFloat(land.location.long[0]) - 0.001, parseFloat(land.location.lat[0]) - 0.001]
      ]
    : [];

  const coordinates: [number, number] =
    land && land.location.lat.length > 0 && land.location.long.length > 0
      ? [parseFloat(land.location.lat[0]), parseFloat(land.location.long[0])]
      : [0, 0];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-lg">Loading land detail...</div>
      </div>
    );
  }
  if (err || !land) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-destructive">{err || "Land not found"}</div>
        <div className="mt-4 flex justify-center">
          <Button variant="outline" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Marketplace
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
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
              <h1 className="text-3xl font-bold mb-2">{land.title}</h1>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                {owner.detail.city}, {owner.detail.country}
              </div>
            </div>
            <Badge className={getStatusColor(land.status)} variant="secondary">
              {land.status.replace("_", " ")}
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
                markers={[
                  {
                    position: coordinates,
                    title: land.title,
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
                  <span className="font-semibold">{land.location.square_meters} m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge className={getStatusColor(land.status)} variant="secondary">
                    {land.status.replace("_", " ")}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Land ID</span>
                  <span className="font-mono text-sm">{land.id}</span>
                </div>
                {land.legal_identifier && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Legal Identifier</span>
                    <span className="font-mono text-sm">{land.legal_identifier}</span>
                  </div>
                )}
                {land.document_hash && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Document Hash</span>
                    <span className="font-mono text-sm">{land.document_hash}</span>
                  </div>
                )}
                {land.images_hash && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Images Hash</span>
                    <span className="font-mono text-sm">{land.images_hash}</span>
                  </div>
                )}
                {land.verifier && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Verifier</span>
                    <span className="font-mono text-sm">{land.verifier}</span>
                  </div>
                )}
              </div>

              {land.status === "FOR_SALE" && (
                <Button asChild className="btn-web3 w-full">
                  <Link to={`/buy/${land.id}`}>
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