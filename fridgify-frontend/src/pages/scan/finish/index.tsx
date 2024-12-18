import { useAddInventory } from "@/api";
import { NumberInput } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useScanningCart } from "@/store";
import { CheckCircleIcon, PlusCircleIcon, XIcon } from "lucide-react";
import { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";

export const FinishScanningPage = () => {
    const { cartItems, removeItem, updateItem, setItems } = useScanningCart();
    const { addInventory, isUpdating } = useAddInventory();
    const navigate = useNavigate();

    const onFinish = useCallback(async () => {
        if (isUpdating) return;

        await addInventory(cartItems).then(() => {
            setItems({}); // Clear local storage
            navigate("/inventory");
        });
    }, [isUpdating, addInventory, cartItems, setItems, navigate]);

    return (
        <div className="mx-10 my-10">
            <div className="flex flex-row items-center justify-between">
                <h1 className="text-3xl font-bold">Inputs</h1>
                <div className="flex flex-row items-center justify-center gap-2">
                    <Link to="/scan">
                        <Button className="p-2 h-fit w-fit rounded-full bg-[green]" variant="outline">
                            <PlusCircleIcon size={24} color="white" />
                        </Button>
                    </Link>
                    <Button className="p-2 h-fit w-fit border-[green]" variant="outline"
                        onClick={onFinish}
                    >
                        <CheckCircleIcon size={24} color="green" />
                    </Button>
                </div>   
            </div>
            <div className="mt-8 flex flex-col items-center gap-4">
                {Object.entries(cartItems).map(([name, item]) => (
                    <Card className="w-[300px]" key={name}>
                        <CardHeader className="flex flex-row justify-between items-center">
                            <CardTitle className="text-2xl">{name.charAt(0).toUpperCase() + name.slice(1)}</CardTitle>
                            <Button variant="destructive" className="p-2 w-fit h-fit rounded-full"
                                onClick={() => removeItem(name)}
                            >
                                <XIcon size={16} />
                            </Button>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-5">
                            <div className="flex flex-row justify-between">
                                <div className="flex flex-row items-center justify-center">
                                    <NumberInput
                                        value={item.quantity}
                                        minVal={1}
                                        onIncrement={() => updateItem(name, { quantity: item.quantity+1 })}
                                        onDecrement={() => updateItem(name, { quantity: Math.max(1, item.quantity-1) })}
                                        onSetValue={(newQuantity: number) => updateItem(name, { quantity: newQuantity })}
                                    />
                                </div>
                                <div id="unit-selection" className="w-[120px] p-1 text-center font-semibold">
                                    {item.unit.toLowerCase()}
                                </div>
                            </div>
                            <div className="flex flex-row items-center gap-2 text-xl">
                                Expires in:
                                <NumberInput
                                    value={item.expirationDays}
                                    minVal={1}
                                    onIncrement={() => updateItem(name, { expirationDays: item.expirationDays+1 })}
                                    onDecrement={() => updateItem(name, { expirationDays: Math.max(1, item.expirationDays-1) })}
                                    onSetValue={(newExpirationDays: number) => updateItem(name, { expirationDays: newExpirationDays })}
                                />
                                Days
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}