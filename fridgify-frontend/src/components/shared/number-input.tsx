import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useState } from "react";

export const NumberInput = ({ onDecrement, onIncrement, onSetValue, value, minVal, maxVal }: 
    { onDecrement: () => void, onIncrement: () => void, onSetValue: (val: number) => void, value: number, minVal: number, maxVal?: number }
) => {
    const [temp, setTemp] = useState(value);
    const reset = useCallback(() => {
        setTemp(value);
    }, [setTemp, value]);

    useEffect(() => {
        reset();
    }, [reset, value]);

    return (
        <div className="flex flex-row items-center justify-center">
            <Button className="h-8 px-2 py-0 rounded-r-none" onClick={() => onDecrement()} disabled={value <= minVal}>-</Button>
            <Input className="w-12 h-8 p-0 border-t-[1px] border-b-[1px] border-black/10 
                text-center flex justify-center items-center rounded-none"
                value={temp} type="number" onChange={(e) => {
                    const newVal = parseInt(e.target.value);
                    setTemp(newVal);
                    if (!isNaN(newVal) && newVal >= 1) onSetValue(newVal);
                }}
                onBlur={reset}
            />
            <Button className="h-8 px-2 py-0 rounded-l-none" onClick={onIncrement} disabled={!!maxVal && value >= maxVal}>+</Button>
        </div>
    )
};