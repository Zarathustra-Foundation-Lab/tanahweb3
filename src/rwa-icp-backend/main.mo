import User "types/User";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Iter "mo:base/Iter";
import Nat32 "mo:base/Nat32";
import Item "types/Item";
import UserService "services/UserService";
import ItemService "services/ItemService";
import ItemRequest "request/ItemRequest";

actor class RwaICP() = this {

  ////////////////////////////////
  // ======= STATE VARS ======= //
  ////////////////////////////////

  private stable var _tokenIds : Nat = 0;

  private var users : User.Users = HashMap.HashMap<Principal, User.User>(0, Principal.equal, Principal.hash);
  private var usernames : User.Usernames = HashMap.HashMap<Text, Principal>(0, Text.equal, Text.hash);

  private var items : Item.Items = HashMap.HashMap<Nat, Item.Item>(0, Nat.equal, func(n : Nat) : Nat32 { Nat32.fromNat(n) });
  private var collection : User.collection = HashMap.HashMap<Principal, [Nat]>(0, Principal.equal, Principal.hash);

  ////////////////////////////////
  // ======= User Function ======= //
  ////////////////////////////////

  public shared ({ caller }) func Signup(_username : Text, _payload : User.User) : async (Bool, ?User.User) {

    switch (UserService.Signup(users, usernames, caller, _username, _payload)) {
      case (#ok(success, newUsers, _newUsernames)) {
        return (success, newUsers.get(caller));
      };
      case (#err(_err)) {
        return (false, null);
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

  public func getItems() : async [Item.Item] {
    return Iter.toArray(items.vals());
  };

  public shared ({ caller }) func createItem(payload : ItemRequest.CreateItemRequest) : async (Bool, Text) {
    // increment token id
    _tokenIds := _tokenIds + 1;

    switch (ItemService._createItem(_tokenIds, items, caller, payload)) {
      case (#ok(_success, newItem)) { (true, "Success Create New Item") };
      case (#err(_err, message)) { (false, message) };
    };

  };

  public func updateItemDetail() {};

  public func verifyItem() {};

  ////////////////////////////////
  // === Transaction Function === //
  ////////////////////////////////

};
