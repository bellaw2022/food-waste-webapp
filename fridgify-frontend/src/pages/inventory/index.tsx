import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PencilIcon } from "lucide-react";
import { useCallback, useState } from "react";

export const InventoryPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const onEdit = useCallback(() => {
    }, []);

    return (
        <div className="mx-4">
            <div className="flex flex-row items-center justify-between">
                <h1 className="text-3xl font-bold">Inputs</h1>
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
                    Edit
                </Button>
            </div>
            <div className="mt-8 flex flex-col items-start gap-4">
                <h2>Expiring Soon:</h2>
                <h2>Still Fresh:</h2>
            </div>
        </div>
    );
}