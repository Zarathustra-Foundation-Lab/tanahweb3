import { ActorSubclass } from "@dfinity/agent";
import { _SERVICE as RwaICPService } from "../../../declarations/rwa-icp-backend/rwa-icp-backend.did";

import { type Principal } from "@dfinity/principal";

export const userService = (actor: ActorSubclass<RwaICPService>) => ({
  getUsers: async () => {
    return await actor.getUsers();
  },

  getUserByPrincipal: async (principal: Principal) => {
    return await actor.getUserByPrincipal(principal);
  },

  getUserByUsername: async (username: string) => {
    return await actor.getUserByUsername(username);
  },
});
