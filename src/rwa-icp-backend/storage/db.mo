import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

import User "../types/User";
import Item "../types/Item";
import HashUtils "../utils/HashUtils";

object {
    public var nonce_item_id : Nat = 0;

    public var users : User.Users = HashMap.HashMap<Principal, User.User>(10, Principal.equal, Principal.hash);
    public var usernames : User.Usernames = HashMap.HashMap<Text, Principal>(10, Text.equal, Text.hash);
    public var items : Item.Items = HashMap.HashMap<Nat, Item.Item>(10, Nat.equal, HashUtils.hashNat);
};
