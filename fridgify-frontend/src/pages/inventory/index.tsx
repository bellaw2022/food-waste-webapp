import { useInventory } from "@/api";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { EditingCartItem, UnitAbbreviations } from "@/store";
import { ClockIcon, PencilIcon } from "lucide-react";
import { useCallback, useState } from "react";

export const InventoryPage = () => {
    const { isInventoryLoading, isInventoryError, inventory } = useInventory();
    const [searchQuery, setSearchQuery] = useState("");
    const onEdit = useCallback(() => {
    }, []);

    const expiringItems = Object.entries(inventory ?? {}).filter(([_, item]) => item.expirationDays < 7);
    const freshItems = Object.entries(inventory ?? {}).filter(([_, item]) => item.expirationDays >= 7);

    return (
        <div className="mx-4 mb-10">
            <div className="flex flex-row items-center justify-between">
                <h1 className="text-3xl font-bold">Inventory</h1>
                <Button className="p-2 h-fit w-fit border-[green]" variant="ghost"
                    onClick={onEdit}
                >
                    <PencilIcon size={24} color="green" />
                </Button>
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
                    <h2 className="font-bold">Expiring Soon:</h2>
                    {expiringItems.map(([itemId, item]) => <InventoryCard key={itemId} item={item} expiringSoon={true} />)}
                    <h2 className="font-bold">Still Fresh:</h2>
                    {freshItems.map(([itemId, item]) => <InventoryCard key={itemId} item={item} expiringSoon={false} />)}
                </div>
                : <Alert>Loading Inventory...</Alert>}
        </div>
    );
}

const InventoryCard = ({ item, expiringSoon }: { item: EditingCartItem, expiringSoon: boolean }) => {
    return (
        <Card className={
            cn("w-[320px] bg-[lightgray] border-2 px-4 py-2 flex flex-row items-center justify-between", 
            expiringSoon ? "border-[orange]" : "border-[green]")}
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