import User "types/User";

import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
// import Time "mo:base/Time";

import Item "types/Item";
import UserService "services/UserService";
import ItemService "services/ItemService";
import Transaction "types/Transaction";

import ItemRequest "request/ItemRequest";
import TransactionService "services/TransactionService";

actor class RwaICP() = this {

  ////////////////////////////////
  // ======= STATE VARS ======= //
  ////////////////////////////////
  private stable var owner : Principal = Principal.fromText("aaaaa-aa"); // default
  private stable var _tokenIds : Nat = 0; // default nonce 0
  // private var transaction_counter : Nat = 0;

  // user state
  private var users : User.Users = HashMap.HashMap<Principal, User.User>(0, Principal.equal, Principal.hash);
  private var usernames : User.Usernames = HashMap.HashMap<Text, Principal>(0, Text.equal, Text.hash);

  // item state
  private var items : Item.Items = HashMap.HashMap<Nat, Item.Item>(0, Nat.equal, func(n : Nat) : Nat32 { Nat32.fromNat(n) });

  private var collection : User.collection = HashMap.HashMap<Principal, [Nat]>(0, Principal.equal, Principal.hash);

  // transaction state
  private var requests : Transaction.BuyRequest = HashMap.HashMap<Nat, [Principal]>(0, Nat.equal, func(n : Nat) : Nat32 { Nat32.fromNat(n) });

  private stable var transactions : [Transaction.Transaction] = [];

  ////////////////////////////////
  // ======= Initial deploy function ======= //
  ////////////////////////////////
  public shared ({ caller }) func init() : async () {
    // set deployer as owner
    owner := caller;
  };

  ////////////////////////////////
  // ======= User Function ======= //
  ////////////////////////////////

  public shared ({ caller }) func Signup(_username : Text, _payload : User.User) : async (Bool, Text) {

    switch (UserService.Signup(users, usernames, caller, _username, _payload)) {
      case (#ok(success, message)) {
        return (success, message);
      };
      case (#err(err, message)) {
        return (err, message);
      };
    };
  };

  public query func getUsers() : async [User.User] {
    return Iter.toArray(users.vals());
  };

  public query func getUserByPrincipal(_principal : Principal) : async ?User.User {
    return users.get(_principal);
  };

  public query func getUserByUsername(_username : Text) : async ?User.User {
    switch (usernames.get(_username)) {
      case (null) { return null };
      case (?user_principal) {
        return users.get(user_principal);
      };
    };

  };

  public shared ({ caller }) func updateUserDetail(payload : User.Detail) : async (Bool, Text) {

    switch (UserService._updateDetail(users, caller, payload)) {
      case (#err(status, err)) { return (status, err) };
      case (#ok(status, message)) { return (status, message) };
    };

  };

  public shared ({ caller }) func updateUserContact(payload : User.Contact) : async (Bool, Text) {

    switch (UserService._updateContact(users, caller, payload)) {
      case (#err(status, err)) { return (status, err) };
      case (#ok(status, message)) { return (status, message) };
    };
  };

  ////////////////////////////////
  // ======= Item Function ======= //
  ////////////////////////////////

  public query func getItems() : async [Item.Item] {
    return Iter.toArray(items.vals());
  };

  public query func getItem(id : Nat) : async ?Item.Item {
    switch (items.get(id)) {
      case (null) return null;
      case (?item) return ?item;
    };
  };

  public shared query ({ caller }) func getUserCollection() : async [Item.Item] {
    // auth check
    if (Principal.isAnonymous(caller)) {
      return [];
    };

    // ambil koleksi ID milifk user
    switch (collection.get(caller)) {
      case (null) return [];

      case (?ids) {
        var result : [Item.Item] = [];

        for (id in ids.vals()) {
          switch (items.get(id)) {
            case (?item) result := Array.append(result, [item]);
            case (_) {}; // item tidak ditemukan, lewati
          };
        };

        return result;
      };
    };
  };

  public shared ({ caller }) func createItem(payload : ItemRequest.CreateItemRequest) : async (Bool, Text) {
    // increment token id
    _tokenIds := _tokenIds + 1;

    switch (ItemService._createItem(_tokenIds, items, caller, payload)) {
      case (#ok(_success, message)) {

        // get caller collection
        let callerCollection = collection.get(caller);

        // get updated array collection
        let updatedCollection = switch callerCollection {
          case null { [_tokenIds] };
          case (?ids) { Array.append<Nat>(ids, [_tokenIds]) };
        };

        // update caller collection
        collection.put(caller, updatedCollection);

        return (true, message);
      };
      case (#err(_err, message)) { (false, message) };
    };

  };

  public shared ({ caller }) func updateItemDetail(id : Nat, payload : ItemRequest.UpdateItemDetail) : async (Bool, Text) {
    switch (ItemService._updateDetail(items, id, caller, payload)) {
      case (#ok(success, message)) {
        return (success, message);
      };
      case (#err(err, message)) {
        return (err, message);
      };
    };

  };

  public shared ({ caller }) func verifyItem(id : Nat) : async (Bool, Text) {
    // check only owner can verify the item
    if (caller != owner) {
      return (false, "Forbiden Access");
    };

    switch (ItemService._verifyItem(items, id, caller, owner)) {
      case (#ok(success, message)) {
        return (success, message);
      };
      case (#err(err, message)) {
        return (err, message);
      };
    };
  };

  public shared ({ caller }) func setListingItem(id : Nat) : async (Bool, Text) {
    switch (ItemService._setStatusListing(items, id, caller)) {
      case (#ok(success, message)) {
        return (success, message);
      };
      case (#err(err, message)) {
        return (err, message);
      };
    };
  };

  public shared ({ caller }) func setDelistedItem(id : Nat) : async (Bool, Text) {

    switch (ItemService._setItemDelisted(items, id, caller)) {
      case (#ok(success, message)) {
        return (success, message);
      };
      case (#err(err, message)) {
        return (err, message);
      };
    };

  };

  ////////////////////////////////
  // === Transaction Function === //
  ////////////////////////////////

  public shared ({ caller }) func requestBuyItem(itemId : Nat) : async (Bool, Text) {
    if (Principal.isAnonymous(caller)) return (false, "need authenticate");

    switch (TransactionService._requestBuyItem(items, requests, itemId, caller)) {
      case (#ok(success, message)) { return (success, message) };
      case (#err(err, message)) { return (err, message) };
    };
  };

  public shared ({ caller }) func approveRequestBuy(itemId : Nat, buyer : Principal) : async (Bool, Text) {
    switch (TransactionService._approveRequest(items, requests, itemId, buyer, caller)) {
      case (#ok(success, message)) { return (success, message) };
      case (#err(err, message)) { return (err, message) };
    };

  };

  // here
  public shared query ({ caller }) func getRequestBuy() : async [(Nat, Item.Item)] {
    var result : [(Nat, Item.Item)] = [];

    for ((itemId, principals) in requests.entries()) {
      if (Array.find<Principal>(principals, func(p) = p == caller) != null) {
        switch (items.get(itemId)) {
          case (?item) result := Array.append(result, [(itemId, item)]);
          case _ {};
        };
      };
    };

    return result;
  };

  public shared query ({ caller }) func getMyTransaction() : async [Transaction.Transaction] {
    var result : [Transaction.Transaction] = [];

    for (key in transactions.keys()) {
      switch (transactions.get(key)) {
        case (tx) if (tx.buyer_principal == caller or tx.seller_principal == caller) {
          result := Array.append(result, [tx]);
        };
      };
    };

    return result;
  };

  public query func getAlltransaction() : async [Transaction.Transaction] {
    return Iter.toArray(transactions.vals());
  };

};
