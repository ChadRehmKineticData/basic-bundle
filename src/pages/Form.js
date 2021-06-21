import React from "react";
import { SubmissionForm } from "./submissionForm/SubmissionForm";

export const Form = ({ private: priv, formSlug, kappSlug }) => (
  <div>
    Viewing form <strong>{formSlug}</strong> in {priv ? "private" : "public"} mode
    <SubmissionForm kappSlug={kappSlug} formSlug={formSlug} />
  </div>
);
