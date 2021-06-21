import { get, getIn, has, List, Map } from 'immutable';
import axios from 'axios';
import {
  bridgedResourceUrl,
  createSubmission,
  fetchForm,
  fetchSubmission,
  updateSubmission,
} from '@kineticdata/react';

const transformRecords = ({ fields, records }) =>
  records.reduce(
    (list, record) =>
      list.push(
        fields.reduce((map, field, i) => map.set(field, record[i]), Map()),
      ),
    List(),
  );

// because this method is called to pass to the dataSources config, the form
// parameter will ALWAYS be a native collection
export const generateDataSources = form =>
  List(form.bridgedResources)
    .reduce(
      (map, bridgedResource) =>
        map.set(bridgedResource.name, {
          fn: (form, values) =>
            axios.post(
              bridgedResourceUrl({
                formSlug: form.get('slug'),
                kappSlug: form.get('kapp').get('slug'),
                bridgedResourceName: bridgedResource.name,
                values: values.toJS(),
              }),
            ),
          params: ({ form, values }) => form && values && [form, values],
          transform: response => transformRecords(response.data.records),
        }),
      Map(),
    )
    .toObject();

export const fetchFormOrSubmission = ({ datastore, formSlug, id, kappSlug }) =>
  (id
    ? fetchSubmission({
        id,
        include: 'form,form.bridgedResources,form.pages,form.kapp,values',
      })
    : fetchForm({
        datastore,
        formSlug,
        kappSlug,
        include: 'bridgedResources,kapp,pages',
      })
  ).then(data => ({
    form: id ? data.submission.form : data.form,
    submission: id ? data.submission : null,
  }));

export const saveSubmission = ({ form, submission, values }) => {
  const saveFn = submission ? updateSubmission : createSubmission;
  const params = submission
    ? { id: get(submission, 'id') }
    : {
        formSlug: get(form, 'slug'),
        kappSlug: getIn(form, ['kapp', 'slug']),
      };
  const nextPageIndex = submission
    ? form
        .get('pages')
        .findIndex(page => page.get('name') === submission.get('currentPage')) +
      1
    : 1;
  return saveFn({
    ...params,
    completed: nextPageIndex === form.get('pages').size,
    currentPage: {
      name:
        nextPageIndex === form.get('pages').size
          ? null
          : form.getIn(['pages', nextPageIndex, 'name']),
    },
    values,
    include: 'values',
  }).then(data => data.submission);
};

// given a form definition and an optional submission, this helper function
// returns the page that should be shown
export const determinePage = (form, submission) => {
  const firstPage = getIn(form, ['pages', 0]);
  const matchesCurrentPage = page =>
    get(page, 'name') === get(submission, 'currentPage');
  return !submission || get(submission, 'currentPage') === null
    ? firstPage
    : List(get(form, 'pages')).find(matchesCurrentPage, firstPage);
};

// recursively traverses elements list looking for field elements, makes
// recursive call when it encounters a section element
export const getFieldElements = elements =>
  List(elements)
    .flatMap(element =>
      has(element, 'elements')
        ? getFieldElements(get(element, 'elements'))
        : List.of(element),
    )
    .filter(element => get(element, 'type') === 'field')
    .toArray();

const valueFn = valuesMap => name => valuesMap.get(name);
const resourcesFn = bindings => name => {
  const [_, resourceName, propName] = name.match(/^(.*):(.*)$/);
  return bindings[resourceName].get(propName);
};

export const evaluateExpression = (expression, values) => {
  // eslint-disable-next-line no-new-func
  const fn = new Function('values', `return !!(${expression})`);
  return fn(valueFn(values));
};

export const evaluateTemplate = (template, bindings) => {
  // eslint-disable-next-line no-new-func
  const fn = new Function('values', 'resources', `return \`${template}\``);
  return fn(valueFn(bindings.values), resourcesFn(bindings));
};

export const typeProp = fieldElement => {
  switch (fieldElement.get('renderType')) {
    case 'radio':
      return 'radio';
    case 'dropdown':
      return 'select';
    default:
      return 'text';
  }
};

export const optionsProp = fieldElement => bindings => {
  if (
    ['checkbox', 'radio', 'dropdown'].includes(fieldElement.get('renderType'))
  ) {
    const resourceName = fieldElement.get('choicesResourceName');
    if (resourceName) {
      if (bindings[resourceName]) {
        const { label, value } = fieldElement.get('choices').toJS();
        return bindings[resourceName].map(record =>
          Map({
            label: evaluateTemplate(label, { [resourceName]: record }),
            value: evaluateTemplate(value, { [resourceName]: record }),
          }),
        );
      } else {
        return List();
      }
    } else {
      return fieldElement.get('choices');
    }
  } else {
    return null;
  }
};

export const visibleProp = fieldElement => bindings => {
  if (!bindings.fieldsCurrent.includes(fieldElement)) {
    return false;
  }
  if (typeof fieldElement.get('visible') === 'boolean') {
    return fieldElement.get('visible');
  }
  return evaluateExpression(fieldElement.get('visible'), bindings.values);
};

export const initialValueProp = (submission, fieldElement) => {
  if (submission) {
    return submission.getIn(['values', fieldElement.get('name')], '');
  } else {
    return '';
  }
};