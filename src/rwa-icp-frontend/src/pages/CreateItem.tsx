import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";

// Assuming you have these UI components from @/components/ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Import useAuthContext and createItemService
import { useAuthContext } from "@/services/auth";
import { createItemService } from "@/services/ItemService";
import { Principal } from "@dfinity/principal";

// =====================================================================
// !! SECURITY WARNING: HARDCODED PINATA API KEYS !!
// This is done as per user request, but it is EXTREMELY INSECURE
// for production applications. These keys will be publicly visible.
// For production, ALWAYS use environment variables and consider an API proxy.
// =====================================================================
const PINATA_API_KEY = "ae9f22ada7a1d537f452"; // REPLACE WITH YOUR ACTUAL PINATA API KEY
const PINATA_SECRET_API_KEY =
  "8664706e13b16c5cd2be3f88b117ffb246e56fba2cdff4962bb07d25bd2bd3bd"; // REPLACE WITH YOUR ACTUAL PINATA SECRET API KEY
// =====================================================================

// ItemFormState matched with Motoko backend's CreateItemRequest and UpdateItemDetail
// where `document_hash` and `images_hash` are `?Text` (single optional text).
export type ItemFormState = {
  title: string;
  price: string; // Will be validated and converted to bigint
  description: string;
  location: {
    lat: string; // Will be converted to string[]
    long: string; // Will be converted to string[]
    square_meters: string; // Will be validated and converted to number
  };
  legal_identifier: string | null; // Optional Text
  document_hash: string | null; // Single hash (string | null)
  images_hash: string | null; // Single hash (string | null)
};

// Object to store validation error messages
type FormErrors = {
  [key: string]: string;
  location_lat?: string;
  location_long?: string;
  location_square_meters?: string;
  document_file?: string; // Error for single file input
  image_file?: string; // Error for single file input
  general?: string; // General error
};

export default function CreateItem() {
  const { principal, actor } = useAuthContext();
  const itemService = createItemService(actor);

  const [formData, setFormData] = useState<ItemFormState>({
    title: "",
    price: "",
    description: "",
    location: {
      lat: "",
      long: "",
      square_meters: "",
    },
    legal_identifier: null,
    document_hash: null,
    images_hash: null,
  });

  const [selectedDocumentFile, setSelectedDocumentFile] = useState<File | null>(
    null
  );
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [geolocationError, setGeolocationError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  // --- Pinata Upload Function (using direct fetch) ---
  const uploadFileToPinata = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const pinataMetadata = JSON.stringify({ name: file.name });
      formData.append("pinataMetadata", pinataMetadata);

      const pinataOptions = JSON.stringify({ cidVersion: 0 });
      formData.append("pinataOptions", pinataOptions);

      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_SECRET_API_KEY,
          },
          body: formData,
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          `Pinata API error: ${res.status} - ${
            errorData.error || res.statusText
          }`
        );
      }

      const jsonRes = await res.json();

      if (jsonRes.IpfsHash) {
        console.log(
          `Uploaded ${file.name} to Pinata. Hash: ${jsonRes.IpfsHash}`
        );
        return jsonRes.IpfsHash;
      } else {
        throw new Error(
          `Pinata upload failed for ${file.name}: No IpfsHash returned in response.`
        );
      }
    } catch (error: any) {
      console.error(`Error uploading ${file.name} to Pinata:`, error);
      throw new Error(
        `Failed to upload file to Pinata: ${error.message || "Unknown error"}`
      );
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.target.type === "file") {
      const fileInput = e.target as HTMLInputElement;
      const file = fileInput.files ? fileInput.files[0] : null;

      if (fileInput.name === "document_file") {
        setSelectedDocumentFile(file);
        if (errors.document_file) {
          setErrors((prev) => ({ ...prev, document_file: undefined }));
        }
      } else if (fileInput.name === "image_file") {
        setSelectedImageFile(file);
        if (file) {
          const url = URL.createObjectURL(file);
          setImagePreviewUrl(url);
        } else {
          setImagePreviewUrl(null);
        }
        if (errors.image_file) {
          setErrors((prev) => ({ ...prev, image_file: undefined }));
        }
      }
      return;
    }

    const { name, value } = e.target;
    const setNestedState = (
      parentKey: "location",
      fieldName: string,
      fieldValue: string
    ) => {
      setFormData((prev) => ({
        ...prev,
        [parentKey]: {
          ...prev[parentKey],
          [fieldName]: fieldValue,
        },
      }));
    };

    if (name.startsWith("location.")) {
      const fieldName = name.split(".")[1];
      setNestedState("location", fieldName, value);
    } else if (name === "legal_identifier") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? null : value,
      }));
    } else if (name === "verifier") {
      // New handling for verifier Principal input
      // Convert string to Principal object or null
      let principalValue: Principal | null = null;
      if (value.trim() !== "") {
        try {
          principalValue = Principal.fromText(value.trim());
          if (errors.verifier) {
            // Clear error if valid
            setErrors((prev) => ({ ...prev, verifier: undefined }));
          }
        } catch (e) {
          // If invalid Principal string, keep principalValue as null and set error
          setErrors((prev) => ({
            ...prev,
            verifier: "Invalid Principal ID format.",
          }));
        }
      } else {
        // If empty, clear any existing error
        if (errors.verifier) {
          setErrors((prev) => ({ ...prev, verifier: undefined }));
        }
      }
      // You don't have 'verifier' in ItemFormState, so this will cause a type error.
      // If you intend to add it, make sure to update ItemFormState.
      // For now, I'm commenting it out as it's not part of the provided ItemFormState.
      // setFormData((prev) => ({
      //   ...prev,
      //   verifier: principalValue,
      // }));
    } else {
      // For all other direct fields
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error for the field being changed (except file inputs handled above)
    if (errors[name] && e.target.type !== "file") {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleGetCurrentLocation = () => {
    setGeolocationError(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            location: {
              ...prev.location,
              lat: position.coords.latitude.toString(),
              long: position.coords.longitude.toString(),
            },
          }));
        },
        (error) => {
          let errorMessage = "Unable to retrieve your location.";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage =
                "Geolocation permission denied. Please allow location access in your browser settings.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "The request to get user location timed out.";
              break;
            default:
              errorMessage = `An unknown error occurred: ${error.message}`;
          }
          setGeolocationError(errorMessage);
          console.error("Geolocation Error:", error);
        }
      );
    } else {
      setGeolocationError("Geolocation is not supported by your browser.");
    }
  };

  const validateForm = (): boolean => {
    let newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.title.trim()) {
      newErrors.title = "Title is required.";
      isValid = false;
    }
    if (!formData.price.trim()) {
      newErrors.price = "Price is required.";
      isValid = false;
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Price must be a positive number.";
      isValid = false;
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
      isValid = false;
    }
    if (!formData.location.lat.trim()) {
      newErrors.location_lat = "Latitude is required.";
      isValid = false;
    }
    if (!formData.location.long.trim()) {
      newErrors.location_long = "Longitude is required.";
      isValid = false;
    }
    if (!formData.location.square_meters.trim()) {
      newErrors.location_square_meters = "Square meters is required.";
      isValid = false;
    } else if (
      isNaN(Number(formData.location.square_meters)) ||
      Number(formData.location.square_meters) <= 0
    ) {
      newErrors.location_square_meters =
        "Square meters must be a positive number.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(false);

    if (!validateForm()) {
      console.log("Form has validation errors.");
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    let documentHash: string | null = null;
    let imageHash: string | null = null;

    try {
      // --- Upload single files to Pinata ---
      if (selectedDocumentFile) {
        setErrors({ general: "Uploading document file to Pinata..." });
        documentHash = await uploadFileToPinata(selectedDocumentFile);
        setErrors({});
      }

      if (selectedImageFile) {
        setErrors({ general: "Uploading image file to Pinata..." });
        imageHash = await uploadFileToPinata(selectedImageFile);
        setErrors({});
      }

      // Constructing final payload based on Motoko's CreateItemRequest type
      const finalPayload = {
        title: formData.title.trim(),
        price: BigInt(formData.price),
        description: formData.description.trim(),
        location: {
          // Motoko's Item.Location expects `vec Text` (array of Text) for lat/long
          // so we keep them as string arrays for Candid.
          lat: [formData.location.lat.trim()],
          long: [formData.location.long.trim()],
          square_meters: parseFloat(formData.location.square_meters),
        },
        // Apply the standard `transformOptionalPrimitiveForCandid`
        legal_identifier: formData.legal_identifier
          ? [formData.legal_identifier]
          : [], // Fix: Wrap in array for ?Text
        verifier: [], // Assuming verifier is `?Principal` in Motoko and not set here
        document_hash: documentHash ? [documentHash] : [], // Fix: Wrap in array for ?Text
        images_hash: imageHash ? [imageHash] : [], // Fix: Wrap in array for ?Text
      };

      if (!principal) {
        throw new Error("User not authenticated. Please log in.");
      }
      if (!(principal instanceof Object)) {
        throw new Error(
          "Invalid Principal. User may not be fully authenticated."
        );
      }

      console.log(
        "Final Payload for ICP Canister (CreateItemRequest):",
        finalPayload
      );

      // --- Call your ICP Canister Service ---
      // Assuming itemService.createItem takes 'finalPayload' which matches CreateItemRequest.
      // Remove 'as any' if your itemService.createItem function is correctly typed
      await itemService.createItem(finalPayload as any);

      setSubmitSuccess(true);
      // Reset form and files after successful submission
      setFormData({
        title: "",
        price: "",
        description: "",
        location: { lat: "", long: "", square_meters: "" },
        legal_identifier: null,
        document_hash: null,
        images_hash: null,
      });
      setSelectedDocumentFile(null);
      setSelectedImageFile(null);
      setImagePreviewUrl(null);
    } catch (err: any) {
      console.error("Error during item creation:", err);
      setErrors({
        general: `Failed to create item: ${err.message || "Unknown error"}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-['Inter']">
      <div className="max-w-xl w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-200">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create New Item
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Fill in the details to list your new real estate item.
        </p>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {submitSuccess && (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md relative text-center"
              role="alert"
            >
              <span className="block sm:inline">
                Item created successfully!
              </span>
            </div>
          )}
          {errors.general && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative text-center"
              role="alert"
            >
              <span className="block sm:inline">{errors.general}</span>
            </div>
          )}
          {/* Main grid for 2 columns on desktop, 1 on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
            {/* Left Column - Primary Details */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title
                </label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  required
                  className={`appearance-none relative block w-full px-3 py-2 border rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., Luxury Apartment in City Center"
                  value={formData.title}
                  onChange={handleChange}
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-red-500">{errors.title}</p>
                )}
              </div>

              {/* Price */}
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Price (in Nat / ICP tokens)
                </label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="1"
                  min="0"
                  required
                  className={`appearance-none relative block w-full px-3 py-2 border rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    errors.price ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., 1000000000000"
                  value={formData.price}
                  onChange={handleChange}
                />
                {errors.price && (
                  <p className="mt-1 text-xs text-red-500">{errors.price}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  className={`appearance-none relative block w-full px-3 py-2 border rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Provide a detailed description of the item."
                  value={formData.description}
                  onChange={handleChange}
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Location Section */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                  Location Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="location.lat"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Latitude
                    </label>
                    <Input
                      id="location.lat"
                      name="location.lat"
                      type="text"
                      required
                      className={`appearance-none relative block w-full px-3 py-2 border rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                        errors.location_lat
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="e.g., -6.200000"
                      value={formData.location.lat}
                      onChange={handleChange}
                    />
                    {errors.location_lat && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.location_lat}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="location.long"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Longitude
                    </label>
                    <Input
                      id="location.long"
                      name="location.long"
                      type="text"
                      required
                      className={`appearance-none relative block w-full px-3 py-2 border rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                        errors.location_long
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="e.g., 106.816666"
                      value={formData.location.long}
                      onChange={handleChange}
                    />
                    {errors.location_long && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.location_long}
                      </p>
                    )}
                  </div>
                </div>
                {/* Button to get current location */}
                <div className="flex justify-end mt-2">
                  <Button
                    type="button"
                    onClick={handleGetCurrentLocation}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ease-in-out duration-150 text-sm"
                  >
                    Get Current Location
                  </Button>
                </div>
                {geolocationError && (
                  <p className="mt-1 text-xs text-red-500 text-center">
                    {geolocationError}
                  </p>
                )}

                <div>
                  <label
                    htmlFor="location.square_meters"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Square Meters
                  </label>
                  <Input
                    id="location.square_meters"
                    name="location.square_meters"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    className={`appearance-none relative block w-full px-3 py-2 border rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                      errors.location_square_meters
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="e.g., 150.5"
                    value={formData.location.square_meters}
                    onChange={handleChange}
                  />
                  {errors.location_square_meters && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.location_square_meters}
                    </p>
                  )}
                </div>
              </div>
            </div>{" "}
            {/* End of Left Column */}
            {/* Right Column - Optional Information and Files */}
            <div className="space-y-6 pt-4 md:pt-0 md:border-l md:pl-6 md:border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Optional Information
              </h3>
              <div>
                <label
                  htmlFor="legal_identifier"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Legal Identifier (e.g., Certificate No.)
                </label>
                <Input
                  id="legal_identifier"
                  name="legal_identifier"
                  type="text"
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Optional legal identification number"
                  value={formData.legal_identifier || ""}
                  onChange={handleChange}
                />
              </div>

              {/* Document File Input (Now singular to match Motoko) */}
              <div>
                <label
                  htmlFor="document_file"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Legal Document File
                </label>
                <Input
                  id="document_file"
                  name="document_file"
                  type="file"
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  onChange={handleChange}
                />
                {selectedDocumentFile && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected file: {selectedDocumentFile.name}
                  </p>
                )}
                {errors.document_file && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.document_file}
                  </p>
                )}
              </div>

              {/* Image File Input and Preview (Now singular to match Motoko) */}
              <div>
                <label
                  htmlFor="image_file"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Property Image File
                </label>
                <Input
                  id="image_file"
                  name="image_file"
                  type="file"
                  accept="image/*"
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  onChange={handleChange}
                />
                {selectedImageFile && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected file: {selectedImageFile.name}
                  </p>
                )}
                {imagePreviewUrl && (
                  <div className="mt-4 border border-gray-300 rounded-md p-2">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Image Preview:
                    </p>
                    <img
                      src={imagePreviewUrl}
                      alt="Property Image Preview"
                      className="max-w-full h-auto rounded-md object-cover"
                      style={{ maxHeight: "200px" }}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "https://placehold.co/200x200/ccc/white?text=Image+Broken";
                      }}
                    />
                  </div>
                )}
                {errors.image_file && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.image_file}
                  </p>
                )}
              </div>
            </div>{" "}
            {/* End of Right Column */}
          </div>{" "}
          {/* End of main grid for 2 columns */}
          <div className="mt-8">
            {" "}
            {/* Submit Button outside the main grid */}
            <Button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ease-in-out duration-150"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Item..." : "Create Item"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
