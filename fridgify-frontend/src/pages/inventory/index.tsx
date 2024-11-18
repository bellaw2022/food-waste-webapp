import { useEditInventory, useInventory } from "@/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { EditingCartItem, UnitAbbreviations, useEditingCart } from "@/store";
import { ChevronLeftIcon, ChevronRightIcon, ClockIcon, PencilIcon, PlusCircleIcon, TrashIcon, UtensilsIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { NumberInput } from "@/components/shared";
import { Link } from "react-router-dom";

export const InventoryPage = () => {
    const { isInventoryLoading, inventory } = useInventory();
    const { editInventory, isUpdating } = useEditInventory();
    const { isEditing, toggleEditing, addItem, removeItem, updateItem, setItems, cartItems } = useEditingCart();
    
    const [tempQuery, setTempQuery] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredItems = useMemo(() => 
        Object.values(inventory ?? {}).filter((item) => 
            searchQuery === "" || item.name.toLowerCase().startsWith(searchQuery.toLowerCase())),
    [searchQuery, inventory]);

    const expiringItems = useMemo(() => 
        filteredItems.filter((item) => item.expirationDays < 7)
    , [filteredItems]);
    const freshItems = useMemo(() => 
        filteredItems.filter((item) => item.expirationDays >= 7)
    , [filteredItems]);

    const onToggleSelect = useCallback((itemId: string) => {
        if (!inventory) return;

        if (itemId in cartItems) removeItem(itemId);
        else addItem(itemId, inventory[itemId]);
    }, [inventory, cartItems, addItem, removeItem]);
    
    const [isSheetOpen, setSheetOpen] = useState(false);
    useEffect(() => {
        if (!isEditing) setSheetOpen(false);
    }, [isEditing, setSheetOpen]);

    const clearCart = useCallback(() => {
        setItems({});
        setSheetOpen(false);
    }, [setItems, setSheetOpen]);
    
    const onSubmit = useCallback(() => {
        if (isUpdating) return;
        editInventory(cartItems);
        clearCart();
    }, [isUpdating, editInventory, cartItems, clearCart]);
    
    return (
        <div className="mx-4 mb-10">
            {isEditing && isSheetOpen &&
                <Card
                    className="fixed right-0 top-[25vh]
                    rounded-r-none border-2 border-r-0 border-black
                    w-[320px] h-[380px] bg-[white]
                    flex flex-col"
                >
                    <CardHeader>
                        <CardTitle>Editing Inventory List</CardTitle>
                    </CardHeader>
                    <CardContent className="border rounded-md mx-4 mb-4 h-full overflow-scroll">
                        {Object.entries(cartItems).length === 0 && <div className="p-2">Edit items by clicking them and adjusting quantities here.</div>}
                        {Object.entries(cartItems).map(([itemId, item], idx) => (
                            <div className={
                                cn(idx !== Object.entries(cartItems).length ? "border-b" : "", 
                                "py-2 w-full flex flex-col items-center gap-2")}
                            >
                                <div key={itemId} className="w-full flex flex-row items-center justify-between">
                                    <div className="text-md">{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</div>
                                    <div className="flex flex-row items-center justify-between gap-2">
                                        <NumberInput
                                            value={item.quantity}
                                            minVal={0} maxVal={inventory?.[itemId].quantity}
                                            onIncrement={() => updateItem(itemId, { quantity: item.quantity+1 })}
                                            onDecrement={() => updateItem(itemId, { quantity: Math.max(0, item.quantity-1) })}
                                            onSetValue={(newQuantity: number) => updateItem(itemId, { quantity: newQuantity })}
                                        />
                                        <div className="w-[1em]">{UnitAbbreviations?.[item.unit]}</div>
                                    </div>
                                </div>
                                <TrashConsumeButton isTrash={item.isTrash} setIsTrash={(val: boolean) => updateItem(itemId, { isTrash: val})} />
                            </div>
                        ))}
                    </CardContent>
                    <CardFooter className="mt-auto mx-auto gap-2">
                        <Button variant="outline" className="border-[black]" onClick={clearCart}>
                            Cancel
                        </Button>
                        <Button variant="default" onClick={onSubmit}>
                            Save
                        </Button>
                    </CardFooter>
                </Card>}
            {isEditing &&
                <Button
                    variant="outline" 
                    className={cn(isSheetOpen ? "rounded-none" : "", 
                        "fixed right-0 top-[25vh] \
                        rounded-r-none border-2 border-r-0 border-black px-4 py-6 \
                        bg-[#f3f3f3]")}
                    onClick={() => setSheetOpen((isOpen) => !isOpen)}
                >
                    {isSheetOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </Button>}
            <div className="flex flex-row items-center justify-between">
                <h1 className="text-3xl font-bold">
                    Inventory
                    <Link to="/scan" onClick={() => { toggleEditing(false); clearCart(); }}>
                        <Button className="ml-2 p-2 h-fit w-fit rounded-full bg-[green]" variant="outline">
                            <PlusCircleIcon size={18} color="white" />
                        </Button>
                    </Link>
                </h1>
                <div className="flex flex-row items-center justify-between gap-2 cursor-pointer"
                    onClick={() => toggleEditing()}
                >
                    <Button className="p-2 h-fit w-fit border-[green]" variant="ghost">
                        <PencilIcon size={24} color="green" />
                    </Button>
                    {isEditing && <div className="font-bold">Editing</div>}
                </div>
            </div>
            <div className="mt-4 flex flex-row items-center justify-between gap-4">
                <Input placeholder="Enter Item Name" type="search"
                    value={tempQuery} onChange={(e) => setTempQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') setSearchQuery(tempQuery);
                    }}
                />
                <Button variant="default" onClick={() => setSearchQuery(tempQuery)}>
                    Filter
                </Button>
            </div>
            {inventory ?
                <div className="mt-8 flex flex-col items-start gap-4">
                    <h2 className="text-2xl font-bold">Expiring Soon:</h2>
                    {expiringItems.map((item) => 
                        <InventoryCard key={item.cartItemId}
                            isEditing={isEditing}
                            onToggle={() => onToggleSelect(item.cartItemId)}
                            isSelected={item.cartItemId in cartItems} 
                            item={item} expiringSoon={true} 
                        />
                    )}
                    <h2 className="text-2xl font-bold">Still Fresh:</h2>
                    {freshItems.map((item) => 
                        <InventoryCard key={item.cartItemId}
                            isEditing={isEditing}
                            onToggle={() => onToggleSelect(item.cartItemId)}
                            isSelected={item.cartItemId in cartItems} 
                            item={item} expiringSoon={false} 
                        />
                    )}
                </div>
                : 
                <div className="p-2">
                    {isInventoryLoading ? "Loading Inventory..." : "Error loading inventory"}
                </div>
            }
        </div>
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

const TrashConsumeButton = ({ isTrash, setIsTrash }: 
    { isTrash: boolean, setIsTrash: (val: boolean) => void }) => {
    return (
        <div className="w-full flex flex-row items-center justify-center gap-0">
            <Button 
                className={
                    cn("w-full p-2 gap-2 rounded-r-none hover:bg-[red]/30 hover:text-[red]",
                        isTrash ? "border-2 text-[red] border-[red] bg-[red]/30"
                            : "text-[red]/50 border-[red]/50 bg-[red]/10"
                    )}
                onClick={() => setIsTrash(true)}
                variant="outline"
            >
                Trash <TrashIcon />
            </Button>
            <Button className={
                cn("w-full p-2 gap-2 rounded-l-none hover:bg-[green]/30 hover:text-[green]",
                    !isTrash ? "border-2 text-[green] border-[green] bg-[green]/30"
                        : "text-[green]/50 border-[green]/50 bg-[green]/10")
            }
                onClick={() => setIsTrash(false)}
                variant="outline"
            >
                Consume <UtensilsIcon />
            </Button>
        </div>
    )
}