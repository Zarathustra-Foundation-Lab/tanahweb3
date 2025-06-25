import Principal "mo:base/Principal";
import Item "./Item";

module {
    public type TransactionDetail = {
        transaction_id : Nat;
        listing_id : Nat;
        listing_item : Item.Item;
        seller_principal : Principal;
        buyer_principal : Principal;
        dealing_price : Nat;
        datetime : Nat;
        notes : Text;
    };
};
