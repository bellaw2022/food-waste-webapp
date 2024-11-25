import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "@/api/constants";
import { CartItem, UnitTypes } from "@/store";
import { EditingCartItem } from "@/store/editing-cart";
import { useToast } from "@/hooks/use-toast";

const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;

export const getExpirationDays = (today: Date, expirationDate: Date) => {
    return Math.ceil(
        (expirationDate.getTime() - today.getTime()) / (MILLISECONDS_IN_DAY)
    );
}

export const useAddInventory = () => {
    const { toast } = useToast();

    const mutation = useMutation({
        mutationFn: async (cart: Record<string, CartItem>) => {
            const userIdString = localStorage.getItem('user_id');
            if (!userIdString) {
                window.location.href = "/";
                return;
            }
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
                headers: new Headers({
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "69420",
                }),
                body: JSON.stringify(formattedInputs),
            });

            if (!res.ok) throw new Error("Error communicating with backend to add inventory!");
            const resJson = await res.json();
            if (resJson.status !== 200) throw new Error("Error response from backend!");
        },
        onSuccess: () => {
            // toast success
            toast({
                title: "Successfully added items!",
                description: "Your items have been saved to your inventory.",
            });
        },
        onError: () => {
            // toast error
            toast({
                variant: "destructive",
                title: "Error adding items :(",
                description: "Please try again.",
            });
        }
    })

    return {
        addInventory: async (cart: Record<string, CartItem>) => {
            await mutation.mutateAsync(cart);
        },
        isUpdating: mutation.isPending,
    }
}

export const useEditInventory = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const mutation = useMutation({
        mutationFn: async (cart: Record<string, EditingCartItem>) => {
            const userIdString = localStorage.getItem('user_id');
            if (!userIdString) {
                window.location.href = "/";
                return;
            }
            const userId = parseInt(userIdString);

            const trashedItems: Record<string, number> = {};
            const consumedItems: Record<string, number> = {};
            Object.values(cart).forEach((item) => {
                if (item.isTrash) {
                    trashedItems[item.cartItemId] = item.quantity;
                } else {
                    consumedItems[item.cartItemId] = item.quantity;
                }
            });

            if (Object.keys(trashedItems).length > 0) {
                const res1 = await fetch(`${API_URL}/user/${userId}/produce/trash`, {
                    method: "PUT",
                    headers: new Headers({
                        "Content-Type": "application/json",
                        "ngrok-skip-browser-warning": "69420",
                    }),
                    body: JSON.stringify(trashedItems),
                });

                if (!res1.ok) throw new Error("Error communicating with backend to edit inventory (trashing items)!");
                const resJson1 = await res1.json();
                if (resJson1.status !== 200) throw new Error("Error response from backend (trashing items)!");
            }

            if (Object.keys(consumedItems).length > 0) {
                const res2 = await fetch(`${API_URL}/user/${userId}/produce`, {
                    method: "PUT",
                    headers: new Headers({
                        "Content-Type": "application/json",
                        "ngrok-skip-browser-warning": "69420",
                    }),
                    body: JSON.stringify(consumedItems),
                });

                if (!res2.ok) throw new Error("Error communicating with backend to edit inventory (consuming items)!");
                const resJson2 = await res2.json();
                if (resJson2.status !== 200) throw new Error("Error response from backend (consuming items)!");
            }
        },
        onSuccess: () => {
            // toast success
            toast({
                title: "Successfully edited inventory!",
                description: "Your inventory and statistics have been updated.",
            });

            queryClient.invalidateQueries({ queryKey: ['inventory'] });
        },
        onError: () => {
            // toast error
            toast({
                variant: "destructive",
                title: "Error editing inventory :(",
                description: "Please try again.",
            });
        }
    })

    return {
        editInventory: async (cart: Record<string, EditingCartItem>) => {
            await mutation.mutateAsync(cart);
        },
        isUpdating: mutation.isPending,
    }
}

interface InventoryResponse {
    userproduce_id: string,
    produce_name: string,
    quantity: number,
    unit: UnitTypes,
    expiration_date: string,
    purchase_date: string;
}

export const useInventory = () => {
    const query = useQuery({
        queryKey: ["inventory"],
        queryFn: async () => {
            const userIdString = localStorage.getItem('user_id');
            if (!userIdString) {
                window.location.href = "/";
                return;
            }
            const userId = parseInt(userIdString);
            
            console.log(API_URL);
            const res = await fetch(`${API_URL}/user/${userId}/produce`, {
                method: "GET",
                headers: new Headers({
                    "ngrok-skip-browser-warning": "69420",
                })
            }).then(
                res => res.json()
            ).catch((error) => { console.error(error) });
            if (res) console.log("Retrieved response from backend: ", res);

            const todayDate = new Date();

            const inventory: Record<string, EditingCartItem> = {};
            res.data?.forEach((item: InventoryResponse) => {
                const expirationDays = getExpirationDays(
                    todayDate, new Date(item.expiration_date),
                )
                inventory[item.userproduce_id] = {
                    cartItemId: item.userproduce_id,
                    name: item.produce_name,
                    quantity: item.quantity,
                    unit: item.unit,
                    expirationDays: expirationDays,
                    isTrash: false,
                }
            });

            return inventory as Record<string, EditingCartItem>;
        }
    });

    return {
        isInventoryLoading: query.isFetching,
        isInventoryError: query.isError,
        inventory: query.data,
    }
};