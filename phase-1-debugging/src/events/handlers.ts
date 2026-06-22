import { initInventorySubscriber } from "../services/inventoryService";

export function registerEventHandlers(): void {
  initInventorySubscriber();
  console.log("Event handlers registered");
}
