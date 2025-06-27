import Text "mo:base/Text";
import Nat8 "mo:base/Nat8";
module {
    public type ResponseFormater = {
        message : Text;
        status : Nat8;
    };
};
