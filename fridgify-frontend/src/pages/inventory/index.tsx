import { useInventory } from "@/api/inventory";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PencilIcon } from "lucide-react";
import { useCallback, useState } from "react";

export const InventoryPage = () => {
    const { isInventoryLoading, isInventoryError, inventory } = useInventory();
    const [searchQuery, setSearchQuery] = useState("");
    const onEdit = useCallback(() => {
    }, []);

    const expiringItems = Object.entries(inventory ?? {}).filter(([_, item]) => item.expirationDays < 7);
    const freshItems = Object.entries(inventory ?? {}).filter(([_, item]) => item.expirationDays >= 7);

    return (
        <div className="mx-4">
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
                    {expiringItems
                        .map(([itemName, item]) => (
                            <Card className="w-[300px]" key={itemName}>
                                <CardHeader>
                                    <CardTitle className="text-2xl">{itemName.charAt(0).toUpperCase() + itemName.slice(1)}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-5">
                                    <div className="text-xl">
                                        {item.quantity} {item.unit.toLowerCase()}
                                    </div>
                                    <div className="text-xl">
                                        Expires in: {item.expirationDays} Days
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    }
                    <h2 className="font-bold">Still Fresh:</h2>
                    {freshItems
                        .map(([itemName, item]) => (
                            <Card className="w-[300px]" key={itemName}>
                                <CardHeader>
                                    <CardTitle className="text-2xl">{itemName.charAt(0).toUpperCase() + itemName.slice(1)}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-5">
                                    <div className="text-xl">
                                        {item.quantity} {item.unit.toLowerCase()}
                                    </div>
                                    <div className="text-xl">
                                        Expires in: {item.expirationDays} Days
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    }
                </div>
                : <Alert>Loading Inventory...</Alert>}
        </div>
    );
}