import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LandCard from "@/components/LandCard";
import { Search, Map, Users, Shield } from "lucide-react";

import { createItemService } from "@/services/ItemService";
import { useAuthContext } from "@/services/auth";

type Land = {
  id: string;
  current_owner: string;
  title: string;
  description: string;
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
};

const Index = () => {
  const { actor } = useAuthContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [lands, setLands] = useState<Land[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLands = async () => {
      setLoading(true);
      setError(null);
      try {
        const items = await createItemService().getItems();
        console.log(items);

        const mappedLands: Land[] = items.map((item: any) => ({
          id: item.id?.toString() ?? "",
          current_owner: item.current_owner?.toString() ?? "-",
          title: item.title ?? "Untitled",
          description: item.description ?? "-",
          location: {
            lat: item.location?.lat ?? [],
            long: item.location?.long ?? [],
            square_meters:
              typeof item.location?.square_meters === "number"
                ? item.location.square_meters
                : 0,
          },
          status: (() => {
            if (typeof item.status === "object" && item.status !== null) {
              const keys = Object.keys(item.status);
              return keys[0].replace(/^#/, "").toUpperCase();
            }
            return "INITIAL";
          })() as Land["status"],
          legal_identifier: item.legal_identifier ?? null,
          verifier: item.verifier?.toString?.() ?? null,
          document_hash: item.document_hash ?? null,
          images_hash: item.images_hash ?? null,
        }));

        setLands(mappedLands);
      } catch (err: any) {
        console.log(err);
        setError("Failed to fetch lands from canister.");
      } finally {
        setLoading(false);
      }
    };

    fetchLands();
  }, []);

  const filteredLands = lands.filter((land) => {
    const search = searchQuery.toLowerCase();
    const matchesSearch =
      land.title.toLowerCase().includes(search) ||
      land.description.toLowerCase().includes(search) ||
      land.location.lat.some((lat) => lat.toLowerCase().includes(search)) ||
      land.location.long.some((lng) => lng.toLowerCase().includes(search));
    const matchesStatus =
      statusFilter === "all" || land.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-web3-cyan/10 via-web3-purple/10 to-web3-green/10" />
        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 web3-gradient">
              {error}
              Own Digital Land
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Buy, sell, and trade virtual real estate on the blockchain. Secure
              your piece of the metaverse today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-web3 text-lg px-8 py-4">
                Explore Lands
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose LandChain?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-web3 text-center">
              <Map className="h-12 w-12 text-web3-cyan mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Interactive Maps</h3>
              <p className="text-muted-foreground">
                Explore lands with detailed interactive maps showing exact
                boundaries and locations.
              </p>
            </div>
            <div className="card-web3 text-center">
              <Shield className="h-12 w-12 text-web3-purple mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Blockchain Secured</h3>
              <p className="text-muted-foreground">
                All transactions and ownership records are secured on the
                blockchain.
              </p>
            </div>
            <div className="card-web3 text-center">
              <Users className="h-12 w-12 text-web3-green mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Community Driven</h3>
              <p className="text-muted-foreground">
                Join a growing community of digital land owners and investors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search lands by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-web3 pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 input-web3">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="FOR_SALE">For Sale</SelectItem>
                <SelectItem value="OWNED">Owned</SelectItem>
                <SelectItem value="PENDING_SALE">Pending Sale</SelectItem>
                <SelectItem value="DELISTED">Delisted</SelectItem>
                <SelectItem value="INITIAL">Initial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <span className="text-lg text-muted-foreground animate-pulse">
                Loading lands...
              </span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <span className="text-lg text-destructive">{error}</span>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredLands.map((land) => (
                  <LandCard
                    key={land.id}
                    {...land}
                    owner={land.current_owner}
                  />
                ))}
              </div>
              {filteredLands.length === 0 && (
                <div className="text-center py-12">
                  <Map className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No lands found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search terms or filters.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
