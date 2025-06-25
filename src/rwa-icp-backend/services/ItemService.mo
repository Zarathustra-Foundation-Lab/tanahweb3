import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
// import Nat32 "mo:base/Nat32";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";

import Item "../types/Item";
import Location "../types/Location";

module ItemFunctions {

    // Fungsi untuk menambahkan item baru
    // HashMap items akan diubah secara in-place
    // Mengembalikan ID item baru dan nonce_item_id yang diperbarui
    public func addNewItem(
        items : HashMap.HashMap<Nat, Item.Item>, // Diteruskan by reference
        currentNonceItemId : Nat, // Pass current nonce as argument
        owner : Principal,
        title : Text,
        description : Text,
        location : Location.LocationItem,
        images : [Text],
        notes : Text,
    ) : async (Nat, Nat) {
        // Mengembalikan (newNonceItemId, newNonceItemId)
        let newNonceItemId = currentNonceItemId + 1;

        let newItem : Item.Item = {
            item_id = newNonceItemId;
            current_owner = owner;
            title_name = title;
            description = description;
            location = location;
            status = #OWNED; // Default status
            image_urls = images;
        };

        items.put(newNonceItemId, newItem);
        return (newNonceItemId, newNonceItemId); // Mengembalikan ID item baru dan nonce_item_id yang diperbarui
    };

    // Fungsi untuk mendapatkan item berdasarkan ID
    public func getItem(
        items : HashMap.HashMap<Nat, Item.Item>,
        id : Nat,
    ) : ?Item.Item {
        return items.get(id);
    };

    // Fungsi untuk mendapatkan daftar item berdasarkan ID-nya
    public func getItemsByIds(
        items : HashMap.HashMap<Nat, Item.Item>,
        item_ids : [Nat],
    ) : [Item.Item] {
        var result : [Item.Item] = [];
        for (id in item_ids.vals()) {
            switch (items.get(id)) {
                case (?it) { result := Array.append(result, [it]) };
                case _ {};
            };
        };
        return result;
    };

};
