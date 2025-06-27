import Principal "mo:base/Principal";
module Auth {
    public func isAuthenticate(caller : Principal) : Bool {
        return Principal.isAnonymous(caller);
    };
};
