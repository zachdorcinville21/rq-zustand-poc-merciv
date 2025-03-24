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
