import { useMutation, useQuery } from "@tanstack/react-query";
import { API_URL } from "@/api/constants";
import { CartItem } from "@/store";
import { EditingCartItem } from "@/store/editing-cart";

const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;

export const useAddInventory = () => {
    const mutation = useMutation({
        mutationFn: async (cart: Record<string, CartItem>) => {
            const userIdString = localStorage.getItem('user_id');
            if (!userIdString) throw new Error("Could not fetch user_id from local_storage");
            const userId = parseInt(userIdString);

            const formattedInputs = Object.keys(cart).map((itemName) => ({
                produce_name: itemName,
                quantity: cart[itemName].quantity,
                purchase_date: (
                    new Date()
                ).toISOString().split("T")[0],
                expiration_date: (
                    new Date(
                        Date.now() + cart[itemName].expirationDays * MILLISECONDS_IN_DAY
                    )
                ).toISOString().split("T")[0],
            }));

            const res = await fetch(`${API_URL}/user/${userId}/produce`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formattedInputs),
            });

            if (!res.ok) throw new Error("Error communicating with backend to update inventory!");
            const resJson = await res.json();
            console.log(resJson);
            if (resJson.status !== 200) throw new Error("Error response from backend!");
        },
        onSuccess: () => {
            // toast success
        },
        onError: () => {
            // toast error
        }
    })

    return {
        updateInventory: async (cart: Record<string, CartItem>) => {
            await mutation.mutateAsync(cart);
        },
        isUpdating: mutation.isPending,
    }
}

export const useInventory = () => {
    const query = useQuery({
        queryKey: ["inventory"],
        queryFn: async () => {
            const userIdString = localStorage.getItem('user_id');
            if (!userIdString) throw new Error("Could not fetch user_id from local_storage");
            const userId = parseInt(userIdString);

            const res = await fetch(`${API_URL}/user/${userId}/produce`, { method: "GET" }).then(
                res => res.json()
            ).catch((error) => { throw new Error(error) });

            const todayDate = new Date((new Date()).toISOString().split("T")[0]);

            const inventory: Record<string, EditingCartItem> = {};
            res.data?.forEach((item) => {
                inventory[item.userproduce_id] = {
                    cartItemId: item.userproduce_id,
                    name: item.produce_name,
                    quantity: item.quantity,
                    unit: item.unit,
                    expirationDays: Math.floor((Date.parse(item.expiration_date) - todayDate.getTime()) / MILLISECONDS_IN_DAY),
                }
            })

            return inventory as Record<string, EditingCartItem>;
        }
    });

    return {
        isInventoryLoading: query.isFetching,
        isInventoryError: query.isError,
        inventory: query.data,
    }
};