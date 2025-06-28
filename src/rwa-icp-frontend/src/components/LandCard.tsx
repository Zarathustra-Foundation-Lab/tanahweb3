
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, User } from "lucide-react";
import { Link } from "react-router-dom";
import type { StatusItem } from "@/types";

interface LandCardProps {
  id: string;
  title: string;
  price: string;
  area: string;
  status: StatusItem;
  location: string;
  owner: string;
  image?: string;
}

const LandCard = ({ id, title, price, area, status, location, owner, image }: LandCardProps) => {
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
    <Card className="card-web3 group hover:scale-[1.02] transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <Badge className={getStatusColor(status)} variant="secondary">
            {status}
          </Badge>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1" />
          {location}
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden">
          {image ? (
            <img 
              src={image} 
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
            <span className="text-sm text-muted-foreground">Price</span>
            <span className="text-2xl font-bold web3-gradient font-mono">{price}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Area</span>
            <span className="font-semibold">{area}</span>
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
          {status === 'LISTED' && (
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
