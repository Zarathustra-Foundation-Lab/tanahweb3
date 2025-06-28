import Item "../types/Item";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Result "mo:base/Result";

import Array "mo:base/Array";

import Transaction "../types/Transaction";

module {

    public func _requestBuyItem(items : Item.Items, requests : Transaction.BuyRequest, itemId : Nat, caller : Principal) : Result.Result<(Bool, Text), (Bool, Text)> {

        switch (items.get(itemId)) {
            case null { return #err(false, "Item not found") };

            case (?item) {
                if (item.current_owner == caller) {
                    return #err(false, "You cannot request your own item");
                };

                switch (requests.get(itemId)) {
                    case null {
                        // Belum ada yang request, buat array baru
                        requests.put(itemId, [caller]);
                    };
                    case (?buyers) {
                        // Cek apakah caller sudah request sebelumnya
                        if (Array.find<Principal>(buyers, func(b) = b == caller) != null) {
                            return #err(false, "You already requested this item");
                        };
                        // Tambahkan ke list buyer
                        requests.put(itemId, Array.append(buyers, [caller]));
                    };
                };

                return #ok(true, "Buy request sent");
            };
        };
    };

    public func _approveRequest(items : Item.Items, requests : Transaction.BuyRequest, itemId : Nat, buyer : Principal, caller : Principal) : Result.Result<(Bool, Text), (Bool, Text)> {
        switch (items.get(itemId)) {
            case null { return #err(false, "Item not found") };

            case (?item) {
                if (item.current_owner != caller) {
                    return #err(false, "Only owner can approve the request");
                };

                switch (requests.get(itemId)) {
                    case null {
                        return #err(false, "No requests found for this item");
                    };
                    case (?buyers) {
                        if (Array.find<Principal>(buyers, func(b) = b == buyer) == null) {
                            return #err(false, "This buyer did not request the item");
                        };

                        // Update item owner
                        let updatedItem = {
                            id = item.id;
                            current_owner = buyer;
                            title = item.title;
                            price = item.price;
                            description = item.description;
                            location = item.location;
                            status = #OWNED;
                            legal_identifier = item.legal_identifier;
                            verifier = item.verifier;
                            document_hash = item.document_hash;
                            images_hash = item.images_hash;
                        };

                        items.put(itemId, updatedItem);

                        // Hapus daftar permintaan beli
                        requests.delete(itemId);

                        return #ok(true, "Request approved and ownership transferred");
                    };
                };
            };
        };
    };

    // public func _payTransaction() {};

};
