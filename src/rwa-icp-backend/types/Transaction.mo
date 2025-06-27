import Principal "mo:base/Principal";
import Item "./Item";

module {
    public type Transaction = {
        transaction_id : Nat;
        listing_id : Nat;
        listing_item : Item.Item;
        seller_principal : Principal;
        buyer_principal : Principal;
        datetime : Nat;
        notes : Text;
    };
};
