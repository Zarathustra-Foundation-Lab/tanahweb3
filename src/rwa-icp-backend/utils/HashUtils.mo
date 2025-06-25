import Nat32 "mo:base/Nat32";

module {
    public func hashNat(n : Nat) : Nat32 {
        // Konversi Nat → Nat32 (mod 2^32)
        return Nat32.fromNat(n);
    };
};
