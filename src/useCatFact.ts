import { useQuery } from "@tanstack/react-query";
import { useCatFactStore } from "./useCatFactStore";

export const useCatFact = () => {
  const setFact = useCatFactStore((state) => state.setFact);

  return useQuery({
    queryKey: ["cat-facts"],
    queryFn: async () => {
      const response = await fetch("https://catfact.ninja/fact");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setFact(data.fact);
      return data.fact;
    },
    staleTime: Infinity,
  });
};
