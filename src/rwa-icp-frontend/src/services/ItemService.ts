import { ActorSubclass } from "@dfinity/agent";
import { _SERVICE as RwaICPService } from "../../../declarations/rwa-icp-backend/rwa-icp-backend.did";

export const itemService = (actor: ActorSubclass<RwaICPService>) => ({
  getItems: async () => {
    return await actor.getItems();
  },
  getUserCollection: async () => {
    return await actor.getUserCollection();
  },
});
