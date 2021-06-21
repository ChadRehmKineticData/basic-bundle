import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchKapps } from "@kineticdata/react";
import { WallySpinner } from "./Loading";

export const KappList = props => {
  const [{ kapps, error }, setKapps] = useState({});

  useEffect(() => {
    fetchKapps({
      public: !props.private
    }).then(setKapps);
  }, [props.private]);

  return kapps ? (
    <Fragment>
      <h1>Kapps</h1>
      <ul>
        {kapps
          .map(kapp => (
            <li key={kapp.slug}>
              <Link to={`/kapps/${kapp.slug}`}>{kapp.name}</Link>
            </li>
          ))}
      </ul>
    </Fragment>
  ) : error ? (
    <pre>{JSON.stringify(error)}</pre>
  ) : (
    <WallySpinner />
  );
};
