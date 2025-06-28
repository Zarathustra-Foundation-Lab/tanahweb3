import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, User } from "lucide-react";
import { Link } from "react-router-dom";

type LandCardProps = {
  id: string;
  title: string;
  description?: string;
  location: {
    lat: string[];
    long: string[];
    square_meters: number;
  };
  status: "INITIAL" | "FOR_SALE" | "PENDING_SALE" | "OWNED" | "DELISTED";
  legal_identifier?: string | string[];
  verifier?: string | string[];
  document_hash?: string | string[];
  images_hash?: string | string[];
  owner: string;
};

const LandCard = ({
  id,
  title,
  description,
  location,
  status,
  legal_identifier,
  verifier,
  document_hash,
  images_hash,
  owner,
}: LandCardProps) => {

  const getStatusColor = (status: LandCardProps["status"]) => {
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

  const imageUrl = !Array.isArray(images_hash)
    ? `https://nftstorage.link/ipfs/${images_hash}`
    : undefined;

  const locationString =
    location && location.lat.length > 0 && location.long.length > 0
      ? `${location.lat[0]}, ${location.long[0]}`
      : "Unknown";

  const areaString = location?.square_meters
    ? `${location.square_meters} m²`
    : "-";

  return (
    <Card className="card-web3 group hover:scale-[1.02] transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <Badge className={getStatusColor(status)} variant="secondary">
            {status.replace("_", " ")}
          </Badge>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1" />
          {locationString}
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <MapPin className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Area</span>
            <span className="font-semibold">{areaString}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <User className="h-4 w-4 mr-1" />
            <span>Owner: {owner}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <div className="flex gap-2 w-full">
          <Button asChild variant="outline" className="flex-1">
            <Link to={`/land/${id}`}>
              View Details
            </Link>
          </Button>
          {status === "FOR_SALE" && (
            <Button asChild className="btn-web3 flex-1">
              <Link to={`/buy/${id}`}>
                Buy Now
              </Link>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default LandCard;
