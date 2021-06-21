import React from "react";

export const Form = ({ private: priv, formSlug, kappSlug }) => (
  <div>
    Viewing form <strong>{formSlug}</strong> in {priv ? "private" : "public"} mode
  </div>
);
