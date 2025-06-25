import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Status "./Status";
import Location "./Location";

module {
    public type Item = {
        item_id : Nat;
        current_owner : Principal;
        title_name : Text;
        description : Text;
        location : Location.LocationItem;
        status : Status.StatusItem;
        image_urls : [Text];
    };

    public type Items = HashMap.HashMap<Nat, Item>;
};
