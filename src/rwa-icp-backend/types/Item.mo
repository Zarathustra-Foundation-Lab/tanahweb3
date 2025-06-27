import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Float "mo:base/Float";

module {
    public type Items = HashMap.HashMap<Nat, Item>;

    public type Item = {
        id : Nat;
        current_owner : Principal;
        title : Text;
        description : Text;
        location : Location;
        status : Status;
        legal_identifier : ?Text;
        verifier : ?Principal;
        document_hash : ?Text;
        images_hash : ?Text;
    };

    public type Location = {
        lat : [Text];
        long : [Text];
        square_meters : Float.Float;
    };

    public type Status = {
        #INITIAL;
        #FOR_SALE;
        #PENDING_SALE;
        #SOLD;
        #NOT_FOR_SALE;
    };

};
