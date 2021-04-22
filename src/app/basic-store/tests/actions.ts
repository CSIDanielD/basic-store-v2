import { ProviderBuilder } from "../providerBuilder";
import { bookActions } from "./bookActions";
import { customerActions } from "./customerActions";
import { inventoryActions } from "./inventoryActions";
import { purchaseActions } from "./purchaseActions";

export function getTestActions() {
  return new ProviderBuilder()
    .mergeProvider({ ...bookActions })
    .mergeProvider({ ...customerActions })
    .mergeProvider({ ...inventoryActions })
    .mergeProvider({ ...purchaseActions }).provider;
}
