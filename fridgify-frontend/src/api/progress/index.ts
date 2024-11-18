import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/api/constants";

interface WasteSavingWeeklyProgress {
    week: string;
    amount: number;
}

export const useWasteSavingProgress = () => {
    const query = useQuery({
        refetchOnWindowFocus: false,
        queryKey: ["waste-saving-progress"],
        queryFn: async () => {
            const userIdString = localStorage.getItem('user_id');
            if (!userIdString) throw new Error("Could not fetch user_id from local_storage");
            const userId = parseInt(userIdString);

            const response = await fetch(`${API_URL}/user/${userId}/wastesaving`);
            if (response.status !== 200) {
              throw new Error('Could not fetch user waste-saving data!');
            }

            const data = await response.json();
            const wasteSavingProgress = data?.data;
            if (!wasteSavingProgress) {
                throw new Error("Could not get waste-saving data from backend response!");
            }

            const result: WasteSavingWeeklyProgress[] = [];
            Object.keys(wasteSavingProgress).forEach((key, idx) => {
                result.push({
                    week: `Week ${idx+1}`,
                    amount: Math.max(0, wasteSavingProgress[key]) / 1000, // ensure each week is at least 0
                });
            });

            return result;
        }
    });

    return {
        isProgressLoading: query.isFetching,
        isProgressError: query.isError,
        progress: query.data,
    }
};