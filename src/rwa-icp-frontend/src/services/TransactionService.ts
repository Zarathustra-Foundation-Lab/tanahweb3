import { ActorSubclass } from "@dfinity/agent";
import { _SERVICE as RwaICPService } from "../../../declarations/rwa-icp-backend/rwa-icp-backend.did";

export const transactionService = (actor: ActorSubclass<RwaICPService>) => ({
  getAllTransactions: async () => {
    return await actor.getAlltransaction();
  },
  getMyTransactions: async () => {
    return await actor.getMyTransaction();
  },
});
