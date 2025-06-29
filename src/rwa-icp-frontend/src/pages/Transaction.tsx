import { Principal } from "@dfinity/principal";
import React from "react";
import { useLocation } from "react-router-dom";

// Assuming you have a way to convert Principal to a readable string if needed.
// For now, we'll just show a shortened version of the Principal.
const shortenPrincipal = (principal) => {
  if (!principal) return "N/A";
  const pStr = principal?.toText();
  return `${pStr.substring(0, 5)}...${pStr.substring(pStr.length - 3)}`;
};

function Transaction() {
  const location = useLocation();

  // Dummy data for transactions based on your provided type.
  // In a real application, this data would come from an API.
  const transactionsData = [
    {
      transaction_id: 101,
      listing_id: 1,
      listing_item: {
        item_id: 1,
        owner: "2v6tm-rkaaa-aaaap-aagca-cai", // Example Principal
        name: "Vintage Camera",
        description: "A classic film camera from the 70s.",
        price: 350.0,
        available: false,
        properties: {},
      },
      seller_principal: "2v6tm-rkaaa-aaaap-aagca-cai", // Example Principal
      buyer_principal: "z7p7p-v4aaa-aaaap-aagcq-cai", // Example Principal
      datetime: 1719548400000000000, // Example timestamp (nanoseconds) for 2024-06-28 00:00:00 UTC
      notes: "Quick and smooth transaction.",
    },
    {
      transaction_id: 102,
      listing_id: 2,
      listing_item: {
        item_id: 2,
        owner: "z7p7p-v4aaa-aaaap-aagcq-cai",
        name: "Mechanical Keyboard",
        description: "Custom built with linear switches.",
        price: 180.0,
        available: false,
        properties: {},
      },
      seller_principal: "z7p7p-v4aaa-aaaap-aagcq-cai",
      buyer_principal: "2v6tm-rkaaa-aaaap-aagca-cai",
      datetime: 1719462000000000000, // Example timestamp for 2024-06-27 00:00:00 UTC
      notes: "Excellent condition, happy with the purchase.",
    },
    {
      transaction_id: 103,
      listing_id: 3,
      listing_item: {
        item_id: 3,
        owner: "xyz12-abcde-fghij-klmno-pqrst-uvwxy-z1234-56789-0abcd-ef", // Another example principal
        name: "Designer Handbag",
        description: "Limited edition, gently used.",
        price: 1200.0,
        available: false,
        properties: {},
      },
      seller_principal:
        "xyz12-abcde-fghij-klmno-pqrst-uvwxy-z1234-56789-0abcd-ef",
      buyer_principal: "2v6tm-rkaaa-aaaap-aagca-cai",
      datetime: 1719375600000000000, // Example timestamp for 2024-06-26 00:00:00 UTC
      notes: "Authentic and well-packaged.",
    },
  ];

  // Helper to format nanoseconds timestamp to a readable date string
  const formatDatetime = (nanoSeconds: number) => {
    if (!nanoSeconds) return "N/A";
    // Convert nanoseconds to milliseconds for JavaScript Date object
    const milliseconds = Number(nanoSeconds / 1_000_000);
    const date = new Date(milliseconds);
    return date.toLocaleString("en-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const handleViewDetails = (transactionId: number) => {
    console.log(`Viewing details for transaction: ${transactionId}`);
    // You might navigate to a detailed transaction page here
    // e.g., history.push(`/transactions/${transactionId}`);
  };

  const handleContact = (principal: Principal) => {
    console.log(`Contacting principal: ${principal}`);
    // Implement logic to initiate contact with the principal
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Transaction History
      </h1>

      {transactionsData.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-600">
          <p className="text-lg font-semibold">No transactions found.</p>
          <p className="mt-2">Your transaction history is empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transactionsData.map((transaction) => (
            <div
              key={transaction.transaction_id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              <h2 className="text-xl font-semibold mb-2 text-gray-900">
                Transaction ID: {transaction.transaction_id}
              </h2>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Item:</span>{" "}
                {transaction.listing_item.name}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Price:</span> $
                {transaction.listing_item.price.toFixed(2)}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Seller:</span>{" "}
                {transaction.seller_principal.toString()}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Buyer:</span>{" "}
                {transaction.buyer_principal.toString()}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Date: {formatDatetime(transaction.datetime)}
              </p>
              {transaction.notes && (
                <p className="text-gray-700 text-sm italic mb-4">
                  Notes: "{transaction.notes}"
                </p>
              )}

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleViewDetails(transaction.transaction_id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out text-sm"
                >
                  View Details
                </button>
                {/* Example of a conditional button, maybe to contact only if you are the seller/buyer */}
                {/* <button
                  onClick={() => handleContact(transaction.seller_principal)}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out text-sm"
                >
                  Contact Seller
                </button> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Transaction;
