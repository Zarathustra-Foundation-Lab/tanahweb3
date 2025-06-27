import Item "../types/Item";

// here
module {
    public type CreateItemRequest = {
        title : Text;
        description : Text;
        location : Item.Location;
        legal_identifier : ?Text;
        verifier : ?Principal;
        document_hash : ?Text;
        images_hash : ?Text;
    };
};
