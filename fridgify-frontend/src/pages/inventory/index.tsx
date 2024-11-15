import { useInventory } from "@/api";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { EditingCartItem, UnitAbbreviations, useEditingCart } from "@/store";
import { ChevronLeftIcon, ClockIcon, PencilIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { EditingCartSheet } from "./sheet";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";

export const InventoryPage = () => {
    const { isInventoryLoading, inventory } = useInventory();
    const { isEditing, toggleEditing, addItem, removeItem, cartItems } = useEditingCart();
    const [searchQuery, setSearchQuery] = useState("");

    const expiringItems = Object.entries(inventory ?? {}).filter(([_, item]) => item.expirationDays < 7);
    const freshItems = Object.entries(inventory ?? {}).filter(([_, item]) => item.expirationDays >= 7);

    const onToggleSelect = useCallback((itemId: string) => {
        if (!inventory) return;

        if (itemId in cartItems) removeItem(itemId);
        else addItem(itemId, inventory[itemId]);
    }, [inventory, cartItems, addItem, removeItem]);

    return (
        <Sheet>
            <div className="mx-4 mb-10">
                {isEditing && 
                    <SheetTrigger asChild>
                        <Button
                            variant="outline" 
                            className="fixed right-0 top-[13em] 
                            rounded-r-none border-2 border-r-0 border-black px-4 py-6
                            bg-[white]"
                        >
                            <ChevronLeftIcon />
                        </Button>
                    </SheetTrigger>}
                <EditingCartSheet />
                <div className="flex flex-row items-center justify-between">
                    <h1 className="text-3xl font-bold">Inventory</h1>
                    <div className="flex flex-row items-center justify-between gap-2 cursor-pointer"
                        onClick={toggleEditing}
                    >
                        <Button className="p-2 h-fit w-fit border-[green]" variant="ghost">
                            <PencilIcon size={24} color="green" />
                        </Button>
                        {isEditing && <div className="font-bold">Editing</div>}
                    </div>
                </div>
                <div className="mt-4 flex flex-row items-center justify-between gap-4">
                    <Input placeholder="Enter Item Name" type="search"
                        value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button variant="default">
                        Filter
                    </Button>
                </div>
                {inventory ?
                    <div className="mt-8 flex flex-col items-start gap-4">
                        <h2 className="text-2xl font-bold">Expiring Soon:</h2>
                        {expiringItems.map(([itemId, item]) => 
                            <InventoryCard key={itemId}
                                isEditing={isEditing}
                                onToggle={() => onToggleSelect(itemId)}
                                isSelected={itemId in cartItems} 
                                item={item} expiringSoon={true} 
                            />
                        )}
                        <h2 className="text-2xl font-bold">Still Fresh:</h2>
                        {freshItems.map(([itemId, item]) => 
                            <InventoryCard key={itemId}
                                isEditing={isEditing}
                                onToggle={() => onToggleSelect(itemId)}
                                isSelected={itemId in cartItems} 
                                item={item} expiringSoon={false} 
                            />
                        )}
                    </div>
                    : isInventoryLoading ? <Alert>Loading Inventory...</Alert>
                        : <Alert variant="destructive">Error loading inventory</Alert>}
            </div>
        </Sheet>
    );
}

const InventoryCard = ({ item, onToggle, isEditing, isSelected, expiringSoon }: 
    { item: EditingCartItem, onToggle: () => void, isEditing: boolean, isSelected: boolean, expiringSoon: boolean }) => {
    return (
        <Card className={
            cn(
            isEditing && isSelected ? "border-4" : "border",
            "w-[320px] bg-[lightgray] px-4 py-2 flex flex-row items-center justify-between", 
            expiringSoon ? "border-[orange]" : "border-[green]")}
            onClick={isEditing ? onToggle : () => {}}
        >
            <div className="text-md">
                {item.quantity} {UnitAbbreviations?.[item.unit]}
            </div>
            <div className="text-xl px-4 py-2 rounded-md bg-white">{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</div>
            <div className="text-md flex flex-row items-center justify-between gap-1">
                <ClockIcon size={18} />
                {item.expirationDays}
            </div>
        </Card>
    );
}