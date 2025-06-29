import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MapView from "@/components/MapView";
import { Plus, MapPin, DollarSign, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Item, StatusItem, LocationItem } from "@/types";

const SellLand = () => {
  const { toast } = useToast();
  const [landData, setLandData] = useState({
    title_name: "",
    description: "",
    location: {
      lat: [""],
      long: [""],
      polygon: "",
      total_area: "",
    } as LocationItem,
    status: "LISTED" as StatusItem,
    image_urls: [] as string[],
    contactName: "",
    contactCallnumber: "",
    contactInstagram: "",
    contactWhatapps: "",
  });

  const [coordinates, setCoordinates] = useState<[number, number]>([
    40.7128, -74.006,
  ]);
  const [polygon, setPolygon] = useState<[number, number][]>([]);

  const handleInputChange = (field: string, value: string) => {
    if (field === "lat" || field === "long") {
      setLandData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [field]: [value],
        },
      }));

      // Update coordinates when lat/lng change
      const lat =
        field === "lat"
          ? parseFloat(value)
          : parseFloat(landData.location.lat[0]);
      const lng =
        field === "long"
          ? parseFloat(value)
          : parseFloat(landData.location.long[0]);

      if (!isNaN(lat) && !isNaN(lng)) {
        setCoordinates([lng, lat]);
        // Create a simple square polygon around the point
        const offset = 0.001;
        setPolygon([
          [lng - offset, lat - offset],
          [lng + offset, lat - offset],
          [lng + offset, lat + offset],
          [lng - offset, lat + offset],
          [lng - offset, lat - offset],
        ]);
      }
    } else if (field === "total_area" || field === "polygon") {
      setLandData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [field]: value,
        },
      }));
    } else if (field === "status") {
      setLandData((prev) => ({ ...prev, status: value as StatusItem }));
    } else {
      setLandData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async () => {
    if (
      !landData.title_name ||
      !landData.location.lat[0] ||
      !landData.location.long[0]
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Land Listed Successfully!",
      description:
        "Your land has been added to the marketplace and is now available for purchase.",
    });

    // Reset form
    setLandData({
      title_name: "",
      description: "",
      location: {
        lat: [""],
        long: [""],
        polygon: "",
        total_area: "",
      },
      status: "LISTED",
      image_urls: [],
      contactName: "",
      contactCallnumber: "",
      contactInstagram: "",
      contactWhatapps: "",
    });
  };

  const getCurrentLocation = async () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCoordinates([position.coords.latitude, position.coords.longitude]);
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 web3-gradient">
            List Your Land
          </h1>
          <p className="text-muted-foreground text-lg">
            Add your digital real estate to the marketplace and connect with
            potential buyers
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="space-y-6">
            {/* Basic Information */}
            <Card className="card-web3">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="h-5 w-5 mr-2" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Land Title *</Label>
                  <Input
                    id="title"
                    value={landData.title_name}
                    onChange={(e) =>
                      handleInputChange("title_name", e.target.value)
                    }
                    className="input-web3"
                    placeholder="e.g., Prime Digital Estate"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={landData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    className="input-web3 min-h-[100px]"
                    placeholder="Describe your land, its features, and potential uses..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="total_area">Total Area</Label>
                  <Input
                    id="total_area"
                    value={landData.location.total_area}
                    onChange={(e) =>
                      handleInputChange("total_area", e.target.value)
                    }
                    className="input-web3"
                    placeholder="1000 m²"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={landData.status}
                    onValueChange={(value) =>
                      handleInputChange("status", value)
                    }
                  >
                    <SelectTrigger className="input-web3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LISTED">Listed</SelectItem>
                      <SelectItem value="OWNED">Owned</SelectItem>
                      <SelectItem value="CONFLIG">Conflict</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="card-web3">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Location Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={getCurrentLocation} className="">
                  Get current Location
                </Button>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude *</Label>
                    <Input
                      id="latitude"
                      value={landData.location.lat[0]}
                      onChange={(e) => handleInputChange("lat", e.target.value)}
                      className="input-web3 font-mono"
                      placeholder="40.7128"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude *</Label>
                    <Input
                      id="longitude"
                      value={landData.location.long[0]}
                      onChange={(e) =>
                        handleInputChange("long", e.target.value)
                      }
                      className="input-web3 font-mono"
                      placeholder="-74.0060"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="polygon">Polygon Coordinates</Label>
                  <Textarea
                    id="polygon"
                    value={landData.location.polygon}
                    onChange={(e) =>
                      handleInputChange("polygon", e.target.value)
                    }
                    className="input-web3 font-mono min-h-[100px]"
                    placeholder="Enter polygon coordinates as GeoJSON or coordinate pairs..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="card-web3">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Full Name</Label>
                  <Input
                    id="contactName"
                    value={landData.contactName}
                    onChange={(e) =>
                      handleInputChange("contactName", e.target.value)
                    }
                    className="input-web3"
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactCallnumber">Call Number</Label>
                  <Input
                    id="contactCallnumber"
                    value={landData.contactCallnumber}
                    onChange={(e) =>
                      handleInputChange("contactCallnumber", e.target.value)
                    }
                    className="input-web3"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactInstagram">Instagram</Label>
                    <Input
                      id="contactInstagram"
                      value={landData.contactInstagram}
                      onChange={(e) =>
                        handleInputChange("contactInstagram", e.target.value)
                      }
                      className="input-web3"
                      placeholder="@username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactWhatapps">WhatsApp</Label>
                    <Input
                      id="contactWhatapps"
                      value={landData.contactWhatapps}
                      onChange={(e) =>
                        handleInputChange("contactWhatapps", e.target.value)
                      }
                      className="input-web3"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleSubmit} className="btn-web3 w-full">
              <Plus className="h-4 w-4 mr-2" />
              List Land for Sale
            </Button>
          </div>

          {/* Map Preview */}
          <div className="space-y-6">
            <Card className="card-web3">
              <CardHeader>
                <CardTitle>Location Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <MapView
                  center={coordinates}
                  zoom={15}
                  polygon={polygon.length > 0 ? polygon : undefined}
                  markers={[
                    {
                      position: coordinates,
                      title: landData.title_name || "Your Land",
                      price: undefined,
                    },
                  ]}
                  height="400px"
                />
              </CardContent>
            </Card>

            <Card className="card-web3">
              <CardHeader>
                <CardTitle>Listing Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    {landData.title_name || "Land Title"}
                  </h3>
                  <p className="text-muted-foreground">
                    Status: {landData.status}
                  </p>
                </div>

                {landData.location.total_area && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Area</span>
                    <span>{landData.location.total_area}</span>
                  </div>
                )}

                {landData.description && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {landData.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellLand;
