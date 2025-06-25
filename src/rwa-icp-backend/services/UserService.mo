import Principal "mo:base/Principal";
import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Result "mo:base/Result";

import User "../types/User";

module UserFunctions {

    // Fungsi untuk mendaftar pengguna baru
    public func signupUser(
        users : HashMap.HashMap<Principal, User.User>,
        usernames : HashMap.HashMap<Text, Principal>,
        caller : Principal,
        username : Text,
        detail : User.UserInformation,
        contact : User.UserContact,
    ) : Result.Result<(Bool, HashMap.HashMap<Principal, User.User>, HashMap.HashMap<Text, Principal>), Text> {
        if (users.get(caller) != null) {
            return #err("User has already exist with this address");
        };
        if (usernames.get(username) != null) {
            return #err("User has already exist with this username");
        };

        let user : User.User = {
            principal_id = caller;
            username = username;
            detail = detail;
            contact = contact;
            items_id = [];
        };

        // Buat HashMap baru atau ubah yang sudah ada (sesuai kebutuhan Anda, Motoko HashMap mutable)
        let newUsers = users;
        let newUsernames = usernames;
        newUsers.put(caller, user);
        newUsernames.put(username, caller);
        return #ok(true, newUsers, newUsernames);
    };

    // Fungsi untuk mendapatkan pengguna berdasarkan Principal ID
    public func getUserByAddress(
        users : HashMap.HashMap<Principal, User.User>,
        addr : Principal,
    ) : async ?User.User {
        return users.get(addr);
    };

    // Fungsi untuk mendapatkan pengguna berdasarkan username
    public func getUserByUsername(
        users : HashMap.HashMap<Principal, User.User>,
        usernames : HashMap.HashMap<Text, Principal>,
        name : Text,
    ) : async ?User.User {
        switch (usernames.get(name)) {
            case null { return null };
            case (?addr) { return users.get(addr) };
        };
    };

    // Fungsi untuk memperbarui daftar item ID pengguna
    public func updateUsersItems(
        users : HashMap.HashMap<Principal, User.User>,
        caller : Principal,
        newItemsIds : [Nat],
    ) : (Bool, HashMap.HashMap<Principal, User.User>) {
        switch (users.get(caller)) {
            case null { return (false, users) };
            case (?user) {
                let updatedUser : User.User = {
                    user with
                    items_id = newItemsIds
                };
                let newUsers = users; // Buat salinan atau gunakan yang sudah ada
                newUsers.put(caller, updatedUser);
                return (true, newUsers);
            };
        };
    };
};
