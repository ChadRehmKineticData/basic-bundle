import { Set } from 'immutable';
import { generateForm } from '@kineticdata/react';
import * as helpers from './submissionFormHelpers';

const dataSources = formOptions =>
  helpers.fetchFormOrSubmission(formOptions).then(({ form, submission }) => ({
    form: {
      fn: () => form,
      params: [],
    },
    submission: {
      fn: () => submission,
      params: [],
    },
    page: {
      fn: helpers.determinePage,
      params: ({ form, submission }) => form && [form, submission],
    },
    fieldsAll: {
      fn: form => helpers.getFieldElements(form.get('pages')),
      params: ({ form }) => form && [form],
    },
    fieldsCurrent: {
      fn: (fields, page) => {
        const pageFields = helpers.getFieldElements(page.get('elements'));
        return fields
          .filter(field => pageFields.includes(field))
          .reduce((set, field) => set.add(field), Set());
      },
      params: ({ fieldsAll, page }) => fieldsAll && page && [fieldsAll, page],
    },
    ...helpers.generateDataSources(form),
  }));

const fields = formOptions => ({ fieldsAll, fieldsCurrent, submission }) =>
  fieldsAll &&
  fieldsCurrent &&
  fieldsAll
    .map(field => ({
      label: field.get('name'),
      name: field.get('name'),
      type: helpers.typeProp(field),
      options: helpers.optionsProp(field),
      initialValue: helpers.initialValueProp(submission, field),
      visible: helpers.visibleProp(field),
    }))
    .push(
      formOptions.includeSubform && {
        label: 'Subform',
        name: 'Subform',
        type: 'subform',
        options: {
          kappSlug: 'services',
          formSlug: 'entry',
        },
        visible: true,
      },
    );

const handleSubmit = formOptions => (values, { form, submission }, actions) =>
  helpers.saveSubmission({ form, submission, values }).then(updated => {
    actions.setDataSource('submission', updated);
    return updated;
  });

export const SubmissionForm = generateForm({
  formOptions: ['datastore', 'formSlug', 'id', 'kappSlug', 'includeSubform'],
  dataSources,
  fields,
  handleSubmit,
});