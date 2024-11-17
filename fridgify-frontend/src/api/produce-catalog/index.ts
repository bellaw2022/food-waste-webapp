import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/api/constants";
import { CatalogItem } from "@/store";



export const useProduceCatalog = () => {
    const query = useQuery({
        refetchOnWindowFocus: false,
        queryKey: ["produce-catalog"],
        queryFn: async () => {
            const response1 = await fetch(`${API_URL}/all_produces`);
            if (response1.status !== 200) {
              throw new Error('Could not fetch names of produce catalog items!');
            }

            const data1 = await response1.json();
            const nameAndCategory = data1?.data;
            if (!nameAndCategory) {
                throw new Error("Could not get names from backend response!");
            }

            const result: Record<string, Record<string, string | number>> = {};
            Object.entries(nameAndCategory as Record<string, string[]>).forEach(([category, names]) => {
                names.forEach((name) => {
                    result[name] = { category };
                });
            })
            
            const response2 = await fetch(`${API_URL}/produce`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    produces: Object.keys(result),
                }),
            });
            if (response2.status !== 200) {
                throw new Error("Failed to get info about produce catalog items!");
            }

            const data2 = await response2.json();

            Object.keys(result).forEach((name) => {
                result[name] = {
                    ...result[name],
                    unit: data2.data[name].unit,
                    expirationDays: data2.data[name].common_expdate,
                    productId: data2.data[name].product_id,
                }
            });

            return result as unknown as Record<string, CatalogItem>;
        }
    });

    return {
        isCatalogLoading: query.isFetching,
        isCatalogError: query.isError,
        produceCatalog: query.data,
    }
};