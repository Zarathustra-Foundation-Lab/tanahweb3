
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Wallet, Shield, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Item, TransactionDetail } from "@/types";

const BuyLand = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [buyerInfo, setBuyerInfo] = useState({
    first_name: "",
    last_name: "",
    callnumber: "",
    whatapps: "",
    instagram: "",
    principal_id: "",
    notes: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock land data matching new types
  const land: Item = {
    item_id: 1,
    current_owner: "owner1",
    title_name: "Prime Digital Estate",
    description: "Premium digital real estate in Cyber District",
    location: {
      lat: ["40.7128"],
      long: ["-74.006"],
      polygon: "",
      total_area: "1,000 m²"
    },
    status: "LISTED",
    image_urls: []
  };

  const handleInputChange = (field: string, value: string) => {
    setBuyerInfo(prev => ({ ...prev, [field]: value }));
  };

  const handlePurchase = async () => {
    if (!buyerInfo.first_name || !buyerInfo.last_name || !buyerInfo.principal_id) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate transaction processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Purchase Initiated!",
        description: "Your land purchase request has been submitted. Check your wallet to confirm the transaction.",
      });
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/land/${id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Land Details
          </Link>
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Purchase Form */}
        <div className="lg:col-span-2">
          <Card className="card-web3">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wallet className="h-5 w-5 mr-2" />
                Purchase Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input
                    id="first_name"
                    value={buyerInfo.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    className="input-web3"
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name *</Label>
                  <Input
                    id="last_name"
                    value={buyerInfo.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    className="input-web3"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="principal_id">Principal ID *</Label>
                <Input
                  id="principal_id"
                  value={buyerInfo.principal_id}
                  onChange={(e) => handleInputChange('principal_id', e.target.value)}
                  className="input-web3 font-mono"
                  placeholder="Your principal ID"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="callnumber">Phone Number</Label>
                <Input
                  id="callnumber"
                  value={buyerInfo.callnumber}
                  onChange={(e) => handleInputChange('callnumber', e.target.value)}
                  className="input-web3"
                  placeholder="+1 (555) 123-4567" 
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="whatapps">WhatsApp</Label>
                  <Input
                    id="whatapps"
                    value={buyerInfo.whatapps}
                    onChange={(e) => handleInputChange('whatapps', e.target.value)}
                    className="input-web3"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={buyerInfo.instagram}
                    onChange={(e) => handleInputChange('instagram', e.target.value)}
                    className="input-web3"
                    placeholder="@username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={buyerInfo.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="input-web3 min-h-[100px]"
                  placeholder="Any additional information or special requests..."
                />
              </div>

              {/* Terms and Conditions */}
              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-web3-cyan mt-0.5" />
                  <div className="text-sm space-y-2">
                    <p className="font-semibold">Important Information:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>All transactions are final and cannot be reversed</li>
                      <li>Land ownership will be transferred immediately upon payment confirmation</li>
                      <li>You will receive an NFT certificate of ownership</li>
                      <li>Gas fees are additional and may vary based on network conditions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Purchase Summary */}
        <div>
          <Card className="card-web3 sticky top-24">
            <CardHeader>
              <CardTitle>Purchase Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">{land.title_name}</h3>
                <p className="text-sm text-muted-foreground">Status: {land.status}</p>
                <p className="text-sm text-muted-foreground">Area: {land.location.total_area}</p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Land Price</span>
                  <div className="text-right">
                    <div className="font-semibold">2.5 ETH</div>
                    <div className="text-xs text-muted-foreground">$4,750</div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Gas Fee</span>
                  <span>0.003 ETH</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="web3-gradient">2.503 ETH</span>
                </div>
              </div>

              <div className="bg-card/50 p-3 rounded-lg border border-border">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="h-4 w-4 text-web3-green" />
                  <span className="text-sm font-semibold">Secure Transaction</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Protected by blockchain technology and smart contracts
                </p>
              </div>

              <Button 
                onClick={handlePurchase}
                disabled={isProcessing}
                className="btn-web3 w-full"
              >
                {isProcessing ? "Processing..." : "Complete Purchase"}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                By clicking "Complete Purchase", you agree to our Terms of Service and Privacy Policy
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BuyLand;
