import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";

module {
    public type UserContact = {
        callnumber : Text;
        instagram : Text;
        whatapps : Text;
    };

    public type UserInformation = {
        first_name : Text;
        last_name : Text;
        bio : Text;
        city : Text;
        country : Text;
    };

    public type User = {
        principal_id : Principal;
        username : Text;
        detail : UserInformation;
        contact : UserContact;
        items_id : [Nat];
    };

    public type Users = HashMap.HashMap<Principal, User>;
    public type Usernames = HashMap.HashMap<Text, Principal>;
};
