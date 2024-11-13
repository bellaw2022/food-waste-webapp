import { useMutation, useQuery } from "@tanstack/react-query";
import { API_URL } from "@/api/constants";
import { CartItem, CatalogItem } from "@/store";

export const useUpdateInventory = () => {
    const mutation = useMutation({
        mutationFn: async () => {
            await fetch(`${API_URL}/user/`)
        }
    })

    return {
        updateInventory: (items: CartItem[]) => {
            mutation.mutate()
        }
    }
}

export const useInventory = () => {
    const query = useQuery({
        queryKey: ["inventory"],
        queryFn: async () => {
            const response1 = await fetch(`${API_URL}/all_produces`);
            if (response1.status !== 200) {
              throw new Error('Could not fetch names of produce catalog items!');
            }

            const data1 = await response1.json();
            const names = data1?.data;
            if (!names) {
                throw new Error("Could not get names from backend response!");
            }
            
            const response2 = await fetch(`${API_URL}/produce`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    produces: names,
                }),
            });
            if (response2.status !== 200) {
                throw new Error("Failed to get info about produce catalog items!");
            }

            const data2 = await response2.json();
            
            const result = data2.data;
            Object.keys(result).forEach((name) => {
                result[name] = {
                    category: result[name].category ?? undefined,
                    unit: result[name].unit,
                    expirationDays: result[name].common_expdate,
                    productId: result[name].product_id,
                }
            });

            return result as Record<string, CatalogItem>;
        }
    });

    return {
        isCatalogLoading: query.isFetching,
        isCatalogError: query.isError,
        produceCatalog: query.data,
    }
};