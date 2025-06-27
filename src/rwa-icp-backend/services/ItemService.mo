import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Item "../types/Item";
import ItemRequest "../request/ItemRequest";

module {
    public func _createItem(tokenIds : Nat, items : Item.Items, caller : Principal, _payload : ItemRequest.CreateItemRequest) : Result.Result<(Bool, Text), (Bool, Text)> {

        // prepare data
        let data : Item.Item = {
            id : tokenIds;
            current_owner : caller;
            title : _payload.title;
            description : _payload.description;
            location : _payload.location;
            status : Item.Status.INITIAL;
            legal_identifier : _payload.legal_identifier;
            verifier : null;
            document_hash : _payload.document_hash;
            images_hash : _payload.images_hash;
        };

        // push new data

        return #ok(true, "Item created successfully.");
    };
};
