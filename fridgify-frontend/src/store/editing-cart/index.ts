import { UnitTypes } from "@/store/types";

export interface EditingCartItem {
    name: string;
    cartItemId: string; // from userproduce_id
    quantity: number;
    unit: UnitTypes;
    expirationDays: number;
};