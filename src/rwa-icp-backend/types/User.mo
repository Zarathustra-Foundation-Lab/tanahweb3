import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";

module {
    public type Users = HashMap.HashMap<Principal, User>;
    public type Usernames = HashMap.HashMap<Text, Principal>;
    public type collection = HashMap.HashMap<Principal, [Nat]>;

    public type User = {
        principal_id : Principal;
        username : Text;
        detail : Detail;
        contact : Contact;
    };

    public type Detail = {
        first_name : Text;
        last_name : Text;
        city : Text;
        country : Text;
        bio : ?Text;
    };

    public type Contact = {
        twitter : ?Text;
        instagram : ?Text;
        tiktok : ?Text;
        youtube : ?Text;
        discord : ?Text;
        twitch : ?Text;
        website : ?Text;
        facebook : ?Text;
    };

};
