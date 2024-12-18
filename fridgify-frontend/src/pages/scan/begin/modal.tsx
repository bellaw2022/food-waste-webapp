import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { makeDefaultItem, useScanningCart } from "@/store"
import { XIcon } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

import {
    Table,
    TableBody,
    TableCell,
    TableRow,
  } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useProduceCatalog } from "@/api"
import { useToast } from "@/hooks/use-toast"
  
export const ManualInputModal = () => {
    const { produceCatalog } = useProduceCatalog();

    const { isModalOpen, closeModal, cartItems, setItems } = useScanningCart();
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryQuery, setCategoryQuery] = useState("All");
    const [updatedItems, setUpdatedItems] = useState(cartItems);

    useEffect(() => {
        setUpdatedItems(cartItems); // Reset to cartItems every time modal is opened/closed
    }, [isModalOpen, cartItems]);

    const { toast } = useToast();

    const onSubmit = useCallback(() => {
        setItems(updatedItems);
        toast({
            title: "Scanning cart updated!",
            description: "You can click Finish to set quantities.",
        });
        closeModal();
    }, [setItems, updatedItems, toast, closeModal]);

    if (!isModalOpen) return null;
    if (!produceCatalog) return null;

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
                        <Label htmlFor="category-selection">Category:</Label>
                        <Select value={categoryQuery} onValueChange={setCategoryQuery}>
                            <SelectTrigger id="category-selection">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent position="popper">
                                <SelectItem value="All">All Foods</SelectItem>
                                <SelectItem value="Fruits">Fruits</SelectItem>
                                <SelectItem value="Egg & Dairy">Egg & Dairy</SelectItem>
                                <SelectItem value="Vegetables">Vegetables</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="mt-5 h-[280px] border-[1px] border-black/10 rounded-md shadow-sm overflow-y-scroll">
                        <Table>
                            <TableBody>
                                {Object.entries(produceCatalog).map(([name, item]) => {
                                    if (
                                        (item.category.toUpperCase() === categoryQuery.toUpperCase() || categoryQuery=== "All") &&
                                        (searchQuery === "" || name.toUpperCase().includes(searchQuery.toUpperCase()))
                                    ) {
                                        return (
                                            <TableRow key={item.productId} className="h-10">
                                                <TableCell className="font-medium">
                                                    <div className="ml-2">{name.charAt(0).toUpperCase() + name.slice(1)}</div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Checkbox 
                                                        className="mr-5" 
                                                        defaultChecked={name in updatedItems}
                                                        onCheckedChange={(e) => {
                                                            if (e) {
                                                                setUpdatedItems({ ...updatedItems, [name]: makeDefaultItem(item) })
                                                            } else {
                                                                setUpdatedItems((items) => {
                                                                    if (name in items) delete items[name];
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