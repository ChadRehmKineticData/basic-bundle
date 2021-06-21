import React from 'react';

export const RadioField = props =>
  props.visible && (
    <div className="field is-horizontal">
      <div className="field-label">
        <label className="label">{props.label}</label>
      </div>
      <div className="field-body">
        <div className="field is-narrow">
          <div className="control">
            {props.options.map((option, i) => (
              <label className="radio" key={i}>
                <input
                  ref={i === 0 ? props.focusRef : null}
                  id={`${props.id}-${option.get('value')}`}
                  name={props.name}
                  type="radio"
                  value={option.get('value')}
                  checked={props.value === option.get('value')}
                  onChange={props.onChange}
                  onBlur={props.onBlur}
                  onFocus={props.onFocus}
                />
                &nbsp;
                {option.get('label')}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  export const SelectField = props =>
  props.visible && (
    <div className="field is-horizontal">
      <div className="field-label is-normal">
        <label className="label">{props.label}</label>
      </div>
      <div className="field-body">
        <div className="field is-narrow">
          <div className="control">
            <div className="select is-fullwidth">
              <select
                id={props.id}
                name={props.name}
                value={props.value}
                onBlur={props.onBlur}
                onChange={props.onChange}
                onFocus={props.onFocus}
              >
                <option value="">
                  {(!props.value &&
                    !props.touched &&
                    !props.focused &&
                    props.placeholder) ||
                    ''}
                </option>
                {props.options.map((option, i) => (
                  <option value={option.get('value')} key={i}>
                    {option.get('label')
                      ? option.get('label')
                      : option.get('value')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  export const TextField = props =>
  props.visible && (
    <div className="field is-horizontal">
      <div className="field-label is-normal">
        <label className="label">{props.label}</label>
      </div>
      <div className="field-body">
        <div className="field">
          <div className="control">
            <input
              className="input"
              type="text"
              id={props.id}
              name={props.name}
              value={props.value}
              onBlur={props.onBlur}
              onChange={props.onChange}
              onFocus={props.onFocus}
              placeholder={props.placeholder}
              disabled={!props.enabled}
            />
          </div>
        </div>
      </div>
    </div>
  );

  export const FormButtons = props => (
    <div className="field is-horizontal">
      <div className="field-label" />
      <div className="field-body">
        <div className="field is-grouped">
          <div className="control">
            <button
              className="button is-primary"
              type="submit"
              disabled={!props.dirty || props.submitting}
              onClick={props.submit}
            >
              {props.submitting ? (
                <span className="fa fa-circle-o-notch fa-spin fa-fw" />
              ) : (
                <span className="fa fa-check fa-fw" />
              )}
              Submit
            </button>
          </div>
          <div className="control">
            <button className="button is-link is-light">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );