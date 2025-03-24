import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { useCatFactStore } from "./useCatFactStore";

export function Page() {
  const queryClient = useQueryClient();
  const catFact = useCatFactStore((state) => state.fact);
  console.log("🚀 ~ App ~ catFacts:", catFact);
  return (
    <>
      <div>
        <h1>Cat Facts</h1>
        <Link href="/page2">Go to Page 2</Link>
        <button
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: ["cat-facts"] })
          }
          style={{ marginLeft: "20px" }}
        >
          Invalidate query and update store
        </button>
      </div>
      <div>
        <div>
          <h2>{catFact}</h2>
        </div>
      </div>
    </>
  );
}
