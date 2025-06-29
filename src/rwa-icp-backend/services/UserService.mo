import Text "mo:base/Text";
import Result "mo:base/Result";
import HashMap "mo:base/HashMap";
import User "../types/User";
module UserService {

    public func Signup(users : User.Users, usernames : User.Usernames, caller : Principal, _username : Text, _payload : User.User) : Result.Result<(Bool, Text), (Bool, Text)> {
        if (users.get(caller) != null) {
            return #err(false, "User has already exist with this address");
        };
        if (usernames.get(_username) != null) {
            return #err(false, "User has already exist with this username");
        };

        // push data to mapping
        users.put(caller, _payload);
        usernames.put(_username, caller);

        return #ok(true, "Success register user");
    };

    public func _updateDetail(users : User.Users, caller : Principal, _payload : User.Detail) : Result.Result<(Bool, Text), (Bool, Text)> {
        // get user
        switch (users.get(caller)) {
            case (null) {
                return #err(false, "User not found.");
            };
            case (?user) {
                let newUpdate : User.User = {
                    principal_id = user.principal_id;
                    username = user.username;
                    detail = _payload;
                    contact = user.contact;
                };

                // update data
                users.put(caller, newUpdate);

                return #ok(true, "User detail updated successfully.");
            };
        };

    };

    public func _updateContact(users : User.Users, caller : Principal, _payload : User.Contact) : Result.Result<(Bool, Text), (Bool, Text)> {
        // get user
        switch (users.get(caller)) {
            case (null) {
                return #err(false, "User not found.");
            };
            case (?user) {
                let newUpdate : User.User = {
                    principal_id = user.principal_id;
                    username = user.username;
                    detail = user.detail;
                    contact = _payload;
                };

                // update data
                users.put(caller, newUpdate);

                return #ok(true, "User contact updated successfully.");
            };
        };
    };

};
