import Principal "mo:base/Principal";
import Int "mo:base/Int";
import HashMap "mo:base/HashMap";
import Item "./Item";

module {
    public type Transaction = {
        transaction_id : Nat;
        listing_id : Nat;
        listing_item : Item.Item;
        seller_principal : Principal;
        buyer_principal : Principal;
        datetime : Int;
        notes : Text;
    };

    public type BuyRequest = HashMap.HashMap<Nat, [Principal]>;
};
