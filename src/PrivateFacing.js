import React, {useState} from "react";
import { Link, Route, Switch } from "react-router-dom";
import { logoutDirect } from "@kineticdata/react";
import { Form } from "./pages/Form";
import { FormList } from "./pages/FormList";
import { KappList } from "./pages/KappList";
import { Submission } from "./pages/Submission";
import { SubmissionList } from "./pages/SubmissionList";
import { NotFound } from "./pages/NotFound";
import { appLogout } from "./App";

export const PrivateFacing = () => {
  const [kappSlug, setKappSlug] = useState();
  return <>
    <header className="private">
      <h1>Private</h1>
      <Link to="/kapps">Kapps</Link>
      {kappSlug && <Link to={`/kapps/${kappSlug}/submissions`}>Submissions</Link>}
      <div className="buttons">
        <button onClick={logoutDirect}>Timeout</button>
        <button onClick={appLogout}>Logout</button>
      </div>
    </header>
    <main>
      <Switch>
        <Route path="/" render={() => "Welcome to the secret stuff"} exact />
        <Route path="/kapps" render={() => <KappList private />} exact />
        <Route path="/kapps/:kappSlug" render={({match}) => {
          setKappSlug(match.params.kappSlug);
          return <FormList kappSlug={match.params.kappSlug} private />
        }} exact />
        <Route
          path="/kapps/:kappSlug/forms/:formSlug"
          render={({ match }) => <Form private kappSlug={match.params.kappSlug} formSlug={match.params.formSlug} />}
        />
        <Route path="/kapps/:kappSlug/submissions" render={({match}) => <SubmissionList kappSlug={match.params.kappSlug}/>} exact />
        <Route path="/submissions/:id" component={Submission} />
        <Route component={NotFound} />
      </Switch>
    </main>
  </>
};
