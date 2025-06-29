import {
  Actor,
  HttpAgent,
  Identity,
  AnonymousIdentity,
  ActorSubclass,
} from "@dfinity/agent";

import { idlFactory } from "../../../declarations/rwa-icp-backend"; // Sesuaikan path jika perlu
import { _SERVICE } from "../../../declarations/rwa-icp-backend/rwa-icp-backend.did"; // Import tipe service

// Ganti dengan CANISTER_ID Anda yang sebenarnya.
// Anda bisa mendapatkan ini dari file .env atau dfx.json Anda.
export const CANISTER_ID =
  process.env.CANISTER_ID_RWA_ICP_BACKEND || "u6s2n-gx777-77774-qaaba-cai";

/**
 * Options interface for creating a canister actor.
 */
interface CreateActorOptions {
  agent?: HttpAgent; // Optional: Provide an existing agent
  identity?: Identity; // Optional: Provide an identity (e.g., from AuthClient)
  host?: string; // Optional: Manually set the host (e.g., "http://localhost:4943")
}

/**
 * Creates an actor instance for the RWA ICP Backend canister.
 * This function can create both authenticated and anonymous actors.
 * @param {CreateActorOptions} options - Options for creating the actor, including agent or identity.
 * @returns {Promise<_SERVICE>} An actor instance.
 */
export const createCanisterActor = async (
  options?: CreateActorOptions
): Promise<ActorSubclass<_SERVICE>> => {
  // Gunakan ActorSubclass untuk tipe yang lebih tepat
  let agent: HttpAgent;

  if (options?.agent) {
    agent = options.agent;
  } else {
    // If no agent is provided, create a new one.
    // Determine the effective host based on the environment or provided host.
    const effectiveHost =
      options?.host ||
      (process.env.NODE_ENV === "production"
        ? "https://icp0.io" // Mainnet
        : "http://localhost:4943"); // Local replica

    // Create HttpAgent with the specified host and identity.
    // If no identity is provided, it will default to AnonymousIdentity.
    agent = new HttpAgent({
      host: effectiveHost,
      identity: options?.identity || new AnonymousIdentity(), // Use provided identity or AnonymousIdentity
    });

    // Fetch root key only for local development environments.
    // This is necessary for local replica communication.
    if (process.env.NODE_ENV !== "production") {
      try {
        await agent.fetchRootKey();
      } catch (error) {
        console.warn(
          "Unable to fetch root key. This is common when running against a local replica that has not been started with the --clean flag.",
          error
        );
      }
    }
  }

  // Create the actor using the IDL factory and the configured agent.
  return Actor.createActor<_SERVICE>(idlFactory, {
    agent,
    canisterId: CANISTER_ID,
  });
};

// Export a default anonymous actor instance for public (non-authenticated) calls.
// This actor should not be used for calls requiring a specific user identity.
export default createCanisterActor;