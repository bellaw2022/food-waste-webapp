import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useScanningCart } from "@/store/scanning-cart"
import { XIcon } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
  
const catalog = [
    {
        name: "Whole Milk",
        category: "Eggs & Dairy",
    },
    {
        name: "2% Milk",
        category: "Eggs & Dairy",
    },
    {
        name: "Almond Milk",
        category: "Eggs & Dairy",
    },
    {
        name: "Eggs",
        category: "Eggs & Dairy",
    },
    {
        name: "Chicken Breasts",
        category: "Meat",
    },
    {
        name: "Chicken Thighs",
        category: "Meat",
    },
    {
        name: "Chicken Wings",
        category: "Meat",
    },
    {
        name: "Ground Beef",
        category: "Meat",
    },
    {
        name: "Ground Turkey",
        category: "Meat",
    },
    {
        name: "Pork Ribs",
        category: "Meat",
    },
    {
        name: "Ham",
        category: "Meat",
    },
    {
        name: "Apple",
        category: "Fruit",
    },
    {
        name: "Banana",
        category: "Fruit",
    },
    {
        name: "Orange",
        category: "Fruit",
    },
    {
        name: "Grapefruit",
        category: "Fruit",
    },
    {
        name: "Grape",
        category: "Fruit",
    },
    {
        name: "Mango",
        category: "Fruit",
    },
    {
        name: "Papaya",
        category: "Fruit",
    },
    {
        name: "Canteloupe",
        category: "Fruit",
    },
    {
        name: "Watermelon",
        category: "Fruit",
    },
    {
        name: "Antelope",
        category: "Fruit",
    },
    {
        name: "Lettuce",
        category: "Vegetables",
    },
    {
        name: "Cabbage",
        category: "Vegetables",
    },
    {
        name: "Broccoli",
        category: "Vegetables",
    },
    {
        name: "Carrots",
        category: "Vegetables",
    },
    {
        name: "Spinach",
        category: "Vegetables",
    },
    {
        name: "Celery",
        category: "Vegetables",
    },
]

export const ManualInputModal = () => {
    const { isModalOpen, closeModal, cartItems, setItems } = useScanningCart();
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryQuery, setCategoryQuery] = useState("All");
    const [updatedItems, setUpdatedItems] = useState(cartItems);

    useEffect(() => {
        setUpdatedItems(cartItems); // Reset to cartItems every time modal is opened/closed
    }, [isModalOpen, cartItems]);

    const onSubmit = useCallback(() => {
        setItems(updatedItems);
        toast("Scanning cart updated!", {
            description: "You can click Finish to set quantities.",
        });
        closeModal();
    }, [setItems, updatedItems, closeModal]);

    if (!isModalOpen) return null;

    return (
        <div 
            className="z-[99] absolute top-0 left-0 w-[100vw] h-[100vh] bg-black/50
            flex flex-col justify-center items-center"
        >
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        Manual Selection
                        <Button onClick={closeModal} variant="ghost"
                            className="p-0"
                        >
                            <XIcon />
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Input placeholder="Search by Item Name" type="search"
                        value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="mt-2 flex items-center gap-4">
                        <Label htmlFor="framework">Category:</Label>
                        <Select value={categoryQuery} onValueChange={setCategoryQuery}>
                            <SelectTrigger id="framework">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent position="popper">
                                <SelectItem value="All">All Foods</SelectItem>
                                <SelectItem value="Fruit">Fruit</SelectItem>
                                <SelectItem value="Eggs & Dairy">Eggs & Dairy</SelectItem>
                                <SelectItem value="Meat">Meat</SelectItem>
                                <SelectItem value="Vegetables">Vegetables</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="mt-5 h-[280px] border-[1px] border-black/10 rounded-md shadow-sm overflow-y-scroll">
                        <Table>
                            <TableBody>
                                {catalog.map((catalogItem) => {
                                    if ((catalogItem.category === categoryQuery || categoryQuery=== "All") &&
                                        (searchQuery === "" || catalogItem.name.toUpperCase().includes(searchQuery.toUpperCase()))
                                    ) {
                                        return (
                                            <TableRow key={catalogItem.name} className="h-10">
                                                <TableCell className="font-medium">
                                                    <div className="ml-2">{catalogItem.name}</div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Checkbox 
                                                        className="mr-5" 
                                                        defaultChecked={catalogItem.name in updatedItems}
                                                        onCheckedChange={(e) => {
                                                            if (e) {
                                                                setUpdatedItems({ ...updatedItems, [catalogItem.name]: 1 })
                                                            } else {
                                                                setUpdatedItems((items) => {
                                                                    if (catalogItem.name in items) delete items[catalogItem.name];
                                                                    return items;
                                                                })
                                                            }
                                                        }} 
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        )
                                    }
                                    return null;
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={closeModal}>Cancel</Button>
                    <Button onClick={onSubmit}>Update</Button>
                </CardFooter>
            </Card>
        </div>
    );
}