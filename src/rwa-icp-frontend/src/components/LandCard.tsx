import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, User } from "lucide-react";
import { Link } from "react-router-dom";
import { getStatusColor } from "@/lib/utils";
import { Status } from "@/types/type";
import { useAuthContext } from "@/services/auth";
import { createItemService } from "@/services/ItemService";
import { Principal } from "@dfinity/principal";

type LandCardProps = {
  thisPrincipalOwner?: Principal;
  myPrincipal?: Principal;
  id: string;
  title: string;
  description?: string;
  location: {
    lat: string[];
    long: string[];
    square_meters: number;
  };
  status: Status;
  legal_identifier?: string | string[];
  verifier?: string | string[];
  document_hash?: string | string[];
  images_hash?: string | string[];
  owner: string;
  username?: string | undefined;
};

const LandCard = ({
  myPrincipal,
  thisPrincipalOwner,
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
  username,
}: LandCardProps) => {
  const { actor } = useAuthContext();
  const itemService = createItemService(actor);

  const imageUrl = !Array.isArray(images_hash)
    ? `https://cyan-persistent-marten-142.mypinata.cloud/ipfs/${images_hash}`
    : undefined;

  const locationString =
    location && location.lat.length > 0 && location.long.length > 0
      ? `${location.lat[0]}, ${location.long[0]}`
      : "Unknown";

  const areaString = location?.square_meters
    ? `${location.square_meters} m²`
    : "-";

  const handleSetListing = async () => {
    const idNum = Number(id) ?? 0;

    await itemService.setListingItem(idNum);
  };

  const handleRequestBuy = async () => {
    const idNum = Number(id);

    await itemService.requestBuy(idNum);
  };

  const samePrincipal =
    myPrincipal && thisPrincipalOwner
      ? myPrincipal?.toString() != thisPrincipalOwner?.toString()
      : false;

  return (
    <Card className="card-web3 group hover:scale-[1.02] transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <div className="">
            <Badge className={getStatusColor(status)} variant="secondary">
              {status.replace("_", " ")}
            </Badge>
          </div>
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
            <span>Owner: {username}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <div className="flex flex-col gap-2 w-full">
          <Button asChild variant="outline" className="flex-1">
            <Link to={`/land/${id}`}>View Details</Link>
          </Button>

          {(status == "OWNED" || status == "INITIAL") &&
            myPrincipal?.toText() == thisPrincipalOwner?.toText() && (
              <Button
                onClick={handleSetListing}
                variant="outline"
                className="flex-1"
              >
                Set Listing
              </Button>
            )}

          {status === "FOR_SALE" && samePrincipal && (
            <Button
              onClick={handleRequestBuy}
              asChild
              className="btn-web3 flex-1"
            >
              Request Buy
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default LandCard;
