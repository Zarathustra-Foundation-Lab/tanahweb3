import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Item "../types/Item";
import ItemRequest "../request/ItemRequest";

module {

    public func _createItem(tokenIds : Nat, items : Item.Items, caller : Principal, _payload : ItemRequest.CreateItemRequest) : Result.Result<(Bool, Text), (Bool, Text)> {

        // check if user authenticate

        // prepare data
        let status : Item.Status = #INITIAL;

        let data : Item.Item = {
            id = tokenIds;
            current_owner = caller;
            title = _payload.title;
            description = _payload.description;
            location = _payload.location;
            status = status;
            legal_identifier = _payload.legal_identifier;
            verifier = null;
            document_hash = _payload.document_hash;
            images_hash = _payload.images_hash;
        };

        // push new data
        items.put(tokenIds, data);

        return #ok(true, "Item created successfully.");
    };

    public func _updateDetail(items : Item.Items, id : Nat, caller : Principal, _payload : ItemRequest.UpdateItemDetail) : Result.Result<(Bool, Text), (Bool, Text)> {

        // get item
        switch (items.get(id)) {
            case (null) { return #err(false, "item not found") };
            case (?item) {
                // check if user can edit this
                if (item.current_owner != caller) {
                    return #err(false, "User not allowance");
                };

                let data : Item.Item = {
                    id = item.id;
                    current_owner = item.current_owner;
                    title = _payload.title;
                    description = _payload.description;
                    location = _payload.location;
                    status = item.status;
                    legal_identifier = _payload.legal_identifier;
                    verifier = item.verifier;
                    document_hash = _payload.document_hash;
                    images_hash = _payload.images_hash;
                };

                // update item
                items.put(item.id, data)

            };
        };

        return #ok(true, "Update Item Successfully");

    };

    public func _verifyItem(items : Item.Items, id : Nat, caller : Principal, owner : Principal) : Result.Result<(Bool, Text), (Bool, Text)> {

        switch (items.get(id)) {
            case (null) { return #err(false, "item not found") };
            case (?item) {
                // check if user can edit this
                if (owner != caller) {
                    return #err(false, "User not allowance");
                };

                let data : Item.Item = {
                    id = item.id;
                    current_owner = item.current_owner;
                    title = item.title;
                    description = item.description;
                    location = item.location;
                    status = item.status;
                    legal_identifier = item.legal_identifier;
                    verifier = ?caller;
                    document_hash = item.document_hash;
                    images_hash = item.images_hash;
                };

                // update item
                items.put(item.id, data)

            };
        };

        return #ok(true, "Success Verify Item");
    };

    public func _setStatusListing(items : Item.Items, id : Nat, caller : Principal) : Result.Result<(Bool, Text), (Bool, Text)> {

        switch (items.get(id)) {
            case (null) { return #err(false, "item not found") };
            case (?item) {
                // check if user can edit this
                if (item.current_owner != caller) {
                    return #err(false, "User not allowance");
                };

                let data : Item.Item = {
                    id = item.id;
                    current_owner = item.current_owner;
                    title = item.title;
                    description = item.description;
                    location = item.location;
                    status = #FOR_SALE;
                    legal_identifier = item.legal_identifier;
                    verifier = item.verifier;
                    document_hash = item.document_hash;
                    images_hash = item.images_hash;
                };

                // update item
                items.put(item.id, data)

            };
        };

        #ok(true, "Success update status listing item");
    };

    public func _setItemDelisted(items : Item.Items, id : Nat, caller : Principal) : Result.Result<(Bool, Text), (Bool, Text)> {

        switch (items.get(id)) {
            case (null) { return #err(false, "item not found") };
            case (?item) {
                // check if user can edit this
                if (item.current_owner != caller) {
                    return #err(false, "User not allowance");
                };

                let data : Item.Item = {
                    id = item.id;
                    current_owner = item.current_owner;
                    title = item.title;
                    description = item.description;
                    location = item.location;
                    status = #DELISTED;
                    legal_identifier = item.legal_identifier;
                    verifier = item.verifier;
                    document_hash = item.document_hash;
                    images_hash = item.images_hash;
                };

                // update item
                items.put(item.id, data)

            };
        };

        #ok(true, "Success delist item");
    };

};
