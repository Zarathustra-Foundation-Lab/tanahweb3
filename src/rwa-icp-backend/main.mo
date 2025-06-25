import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";

import User "types/User";
import Item "types/Item";
import Location "types/Location";

import UserService "services/UserService";
import ItemService "services/ItemService";

actor class RwaICP() = this {

  ////////////////////////////////
  // ======= STATE VARS ======= //
  ////////////////////////////////

  var nonce_item_id : Nat = 0;
  var users = HashMap.HashMap<Principal, User.User>(10, Principal.equal, Principal.hash);
  var usernames = HashMap.HashMap<Text, Principal>(10, Text.equal, Text.hash);
  var items = HashMap.HashMap<Nat, Item.Item>(10, Nat.equal, func(n : Nat) : Nat32 { Nat32.fromNat(n) });

  ////////////////////////////////
  // ======= FUNCTIONS ======== //
  ////////////////////////////////

  ////////////////////////////////
  // ======= User Services =====//
  ////////////////////////////////
  public shared func signupUser(
    username : Text,
    detail : User.UserInformation,
    contact : User.UserContact,
  ) : async Bool {
    let caller = Principal.fromActor(this);
    // Panggil fungsi dari modul; HashMap diubah secara in-place
    let (success) = UserService.signupUser(
      users, // Diteruskan by reference
      usernames, // Diteruskan by reference
      caller,
      username,
      detail,
      contact,
    );

    switch (success) {
      case (#ok(success)) {
        return true;

      };
      case (#err(success)) {
        return false;
      };
    };

  };

  public shared query func getUserByAddress(addr : Principal) : async ?User.User {
    return users.get(addr);
  };

  public shared query func getUserByUsername(name : Text) : async ?User.User {
    switch (usernames.get(name)) {
      case null { return null };
      case (?addr) { return users.get(addr) };
    };
  };

  ////////////////////////////////
  // ======= Item Services =====//
  ////////////////////////////////

  public shared func addNewItem(
    title : Text,
    description : Text,
    location : Location.LocationItem,
    images : [Text],
    notes : Text,
  ) : async Nat {
    let caller = Principal.fromActor(this);

    // Periksa pengguna terlebih dahulu
    switch (await UserService.getUserByAddress(users, caller)) {
      case null { return 0 }; // Pengguna tidak ditemukan
      case (?user) {
        // Panggil fungsi addNewItem dari ItemFunctions; HashMap diubah secara in-place
        let (newItemId, newNonce) = await ItemService.addNewItem(
          items, // Diteruskan by reference
          nonce_item_id, // Teruskan nonce_item_id saat ini
          caller,
          title,
          description,
          location,
          images,
          notes,
        );

        nonce_item_id := newNonce; // Perbarui nonce_item_id

        if (newItemId == 0) {
          return 0; // Gagal membuat item
        };

        let updatedItemsIds = Array.append(user.items_id, [newItemId]);
        // Panggil fungsi updateUsersItems dari UserFunctions; HashMap diubah secara in-place
        let (success, newuser) = UserService.updateUsersItems(
          users, // Diteruskan by reference
          caller,
          updatedItemsIds,
        );

        if (success) {
          return newItemId;
        } else {
          return 0; // Gagal memperbarui daftar item pengguna
        };
      };
    };
  };

  public shared query func getItemsByUser() : async [Item.Item] {
    let caller = Principal.fromActor(this);

    switch (users.get(caller)) {
      case null { return [] };
      case (?user) {
        return ItemService.getItemsByIds(items, user.items_id);
      };
    };
  };

  public shared query func getItem(id : Nat) : async ?Item.Item {
    return ItemService.getItem(items, id);
  };
};
