## React Query and Zustand POC

This poc demonstrates how react query can be used alone or with zustand. The following sections demonstrates each strategy.

### React Query only

With this approach, we can create a hook to fetch some data, then declaratively refetch as we wish. Here's an example of the hook:

```ts
import { useQuery } from "@tanstack/react-query";
import { useCatFactStore } from "./useCatFactStore";

export const useCatFact = () => {
  return useQuery({
    queryKey: ["cat-facts"],
    queryFn: async () => {
      const response = await fetch("https://catfact.ninja/fact");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.fact;
    },
    staleTime: Infinity,
  });
};
```

At the component level, we have this:

```tsx
import { useCatFact } from "./useCatFact";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";

export function Page() {
  const { data: catFact } = useCatFact();
  const queryClient = useQueryClient();
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
```

With this hook, the data will only refetch when:
- We call `queryClient.invalidateQueries`
- The `queryKey` changes

In any other case, when this hook is invoked, the data will be pulled from an in-memory cache rather than triggering a new network request. This can be useful for us, for example our `GetWorkspaces` request, where the list of workspaces does not need to be refetched unless a new one is created or one of them is updated.

At the component level, when we click the button, we declaratively invalidate the query, which triggers a new network request.


### React query and Zustand

With this approach, we can utilize both react query and zustand to fetch and store data. Here is the zustand store we're working with:

```ts
import { create } from "zustand";

interface CatFactStore {
  fact: string;
  setFact: (newFact: string) => void;
}

export const useCatFactStore = create<CatFactStore>((set) => ({
  fact: "",
  setFact: (newFact: string) => set({ fact: newFact }),
}));
```

The react query hook:
```ts
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
```
And finally the components:

#### page.tsx
```tsx
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { useCatFactStore } from "./useCatFactStore";

export function Page() {
  const catFact = useCatFactStore((state) => state.fact);
  const queryClient = useQueryClient();
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
```

#### App.tsx
```tsx
import "./App.css";
import { Route, Switch } from "wouter";
import { Page } from "./page";
import Page2 from "./page2";
import { useCatFact } from "./useCatFact";

function App() {
  useCatFact();
  return (
    <>
      <Switch>
        <Route path="/" component={Page} />
        <Route path="/page2" component={Page2} />
        <Route>404: No such page!</Route>
      </Switch>
    </>
  );
}

export default App;
```

In the react query hook, we can update the zustand store with the result from the network request. This way, whenever a component invokes the zustand hook, it will have the latest data. We call the react query hook `useCatFact` at the root level so we can execute the request on mount to then update our store.

We have the same functionality as before with `invalidateQueries`—when we click the button, react query will execute the network request again and update the zustand store.


### Normalization
If we want to store a transformed version of data coming from an API, we can use the `select` property which can be passed to `useQuery`. This can be used in any of the approaches. Example:

```ts
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
    select: data => {
      return data.slice(0, 4);
    }
    staleTime: Infinity,
  });
};
```
