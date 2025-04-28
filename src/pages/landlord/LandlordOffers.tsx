
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import DashboardLayout from "@/components/landlord/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, FileCheck } from "lucide-react";

interface Offer {
  id: string;
  status: string;
  external_reference: string | null;
  whatsapp_link: string | null;
  created_at: string;
  updated_at: string;
  offer_details: Record<string, any> | null;
  tenant_application: {
    id: string;
    tenant_first_name: string;
    tenant_last_name: string;
    tenant_email: string;
  };
  property: {
    id: string;
    address: string;
    city: string;
  };
}

const LandlordOffers = () => {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [updatingOffer, setUpdatingOffer] = useState(false);
  const [offerDetails, setOfferDetails] = useState({
    external_reference: '',
    whatsapp_link: '',
    offer_details: '{}'
  });

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        // Get the landlord's ID first
        const { data: landlordData, error: landlordError } = await supabase
          .from('landlords')
          .select('id')
          .eq('user_id', user?.id)
          .single();

        if (landlordError) throw landlordError;

        // Get property IDs for this landlord
        const { data: propertiesData } = await supabase
          .from('properties')
          .select('id')
          .eq('landlord_id', landlordData.id);
          
        const propertyIds = propertiesData ? propertiesData.map(prop => prop.id) : [];

        // Get offers for those properties
        const { data, error } = await supabase
          .from('offers')
          .select(`
            *,
            tenant_application:tenant_application_id (
              id,
              tenant_first_name,
              tenant_last_name,
              tenant_email
            ),
            property:property_id (
              id,
              address,
              city
            )
          `)
          .in('property_id', propertyIds)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setOffers(data as Offer[]);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error loading offers",
          description: error.message
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOffers();
    }
  }, [user, toast]);

  const openUpdateDialog = (offer: Offer) => {
    setSelectedOffer(offer);
    setOfferDetails({
      external_reference: offer.external_reference || '',
      whatsapp_link: offer.whatsapp_link || '',
      offer_details: offer.offer_details ? JSON.stringify(offer.offer_details, null, 2) : '{}'
    });
    setIsDialogOpen(true);
  };

  const updateOfferDetails = async () => {
    if (!selectedOffer) return;
    
    setUpdatingOffer(true);
    
    try {
      // Parse the offer details JSON
      let parsedDetails;
      try {
        parsedDetails = JSON.parse(offerDetails.offer_details);
      } catch (e) {
        throw new Error("Invalid JSON in offer details");
      }

      // Update the offer record
      const { error } = await supabase
        .from('offers')
        .update({
          external_reference: offerDetails.external_reference,
          whatsapp_link: offerDetails.whatsapp_link,
          offer_details: parsedDetails
        })
        .eq('id', selectedOffer.id);

      if (error) throw error;

      toast({
        title: "Offer updated",
        description: "The offer details have been successfully updated."
      });

      // Update the local state
      setOffers(prev => prev.map(offer => 
        offer.id === selectedOffer.id 
          ? { 
              ...offer, 
              external_reference: offerDetails.external_reference,
              whatsapp_link: offerDetails.whatsapp_link,
              offer_details: parsedDetails
            } 
          : offer
      ));
      
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating offer",
        description: error.message
      });
    } finally {
      setUpdatingOffer(false);
    }
  };

  // Helper function to render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-500">Pending</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-green-500/20 text-green-500">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-500/20 text-red-500">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Offers Management</h1>
          <p className="text-muted-foreground">
            View, update and manage offers generated by Doorways for your properties.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Offers</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : offers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No offers found. Offers are generated from approved applications.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Reference #</TableHead>
                      <TableHead>Created Date</TableHead>
                      <TableHead>WhatsApp Link</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {offers.map((offer) => (
                      <TableRow key={offer.id}>
                        <TableCell>
                          {offer.tenant_application.tenant_first_name} {offer.tenant_application.tenant_last_name}
                        </TableCell>
                        <TableCell>
                          {offer.property.address}, {offer.property.city}
                        </TableCell>
                        <TableCell>
                          {renderStatusBadge(offer.status)}
                        </TableCell>
                        <TableCell>
                          {offer.external_reference || 'Not set'}
                        </TableCell>
                        <TableCell>
                          {new Date(offer.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {offer.whatsapp_link ? (
                            <a 
                              href={offer.whatsapp_link}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              Open WhatsApp Link
                            </a>
                          ) : (
                            'Not set'
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openUpdateDialog(offer)}
                          >
                            <FileCheck className="h-4 w-4 mr-1" /> Update Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog for updating offer details */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Update Offer Details</DialogTitle>
            <DialogDescription>
              Update the offer details generated by Doorways. These details will be shared with the tenant.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="external_reference">External Reference Number</Label>
              <Input 
                id="external_reference"
                value={offerDetails.external_reference}
                onChange={(e) => setOfferDetails({...offerDetails, external_reference: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="whatsapp_link">WhatsApp Link</Label>
              <Input 
                id="whatsapp_link"
                value={offerDetails.whatsapp_link}
                onChange={(e) => setOfferDetails({...offerDetails, whatsapp_link: e.target.value})}
              />
              <p className="text-sm text-muted-foreground">
                Enter a valid WhatsApp link that will be sent to the tenant to view their offer details.
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="offer_details">Offer Details (JSON)</Label>
              <Textarea 
                id="offer_details"
                rows={8}
                value={offerDetails.offer_details}
                onChange={(e) => setOfferDetails({...offerDetails, offer_details: e.target.value})}
                className="font-mono text-sm"
              />
              <p className="text-sm text-muted-foreground">
                Enter the offer details in JSON format. This will store the payment schedule and other offer-related information.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={updateOfferDetails}
              disabled={updatingOffer}
            >
              {updatingOffer ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Offer'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default LandlordOffers;
