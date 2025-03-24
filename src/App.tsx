import "./App.css";
import { Link, Route, Switch } from "wouter";
import { Page } from "./page";
import Page2 from "./page2";
import { useCatFact } from "./useCatFact";
function App() {
  useCatFact();
  return (
    <>
      {/* 
      Routes below are matched exclusively -
      the first matched route gets rendered
    */}
      <Switch>
        <Route path="/" component={Page} />
        <Route path="/page2" component={Page2} />
        {/* Default route in a switch */}
        <Route>404: No such page!</Route>
      </Switch>
    </>
  );
}

export default App;
