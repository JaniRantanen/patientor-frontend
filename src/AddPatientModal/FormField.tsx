import React from "react";
import { v4 as uuidv4 } from 'uuid';
import { ErrorMessage, Field, FieldProps, FormikProps } from "formik";
import { Dropdown, DropdownProps, Form } from "semantic-ui-react";
import { Diagnosis, Gender } from "../types";

// structure of a single option
export type GenderOption = {
  value: Gender;
  label: string;
};

// props for select field component
type SelectFieldProps = {
  name: string;
  label: string;
  options: GenderOption[];
  id?: string;
};

export const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  options,
  id
}: SelectFieldProps) => {
  id = id ? id : uuidv4();
  return (
    <Form.Field>
      <label htmlFor={id}>{label}</label>
      <Field id={id} as="select" name={name} className="ui dropdown">
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label || option.value}
          </option>
        ))}
      </Field>
    </Form.Field>
  );
};

interface TextProps extends FieldProps {
  label: string;
  placeholder: string;
  id?: string;
}

export const TextField: React.FC<TextProps> = ({
  field,
  label,
  placeholder,
  id
}) => {
  id = id ? id : uuidv4();
  return (
    <Form.Field>
      <label htmlFor={id}>{label}</label>
      <Field id={id} placeholder={placeholder} {...field} />
      <div style={{ color: 'red' }}>
        <ErrorMessage name={field.name} />
      </div>
    </Form.Field>
  );
};

/*
  for exercises 9.24.-
*/
interface NumberProps extends FieldProps {
  label: string;
  errorMessage?: string;
  min: number;
  max: number;
  id?: string;
}

export const NumberField: React.FC<NumberProps> = ({ field, label, min, max, id }) => {
  id = id ? id : uuidv4();
  return (
    <Form.Field>
      <label htmlFor={id}>{label}</label>
      <Field id={id} {...field} type='number' min={min} max={max} />

      <div style={{ color: 'red' }}>
        <ErrorMessage name={field.name} />
      </div>
    </Form.Field>
  );
};

export const DiagnosisSelection = ({
  diagnoses,
  setFieldValue,
  setFieldTouched
}: {
  diagnoses: Diagnosis[];
  setFieldValue: FormikProps<{ diagnosisCodes: string[] }>["setFieldValue"];
  setFieldTouched: FormikProps<{ diagnosisCodes: string[] }>["setFieldTouched"];
}) => {
  const field = "diagnosisCodes";
  const onChange = (
    _event: React.SyntheticEvent<HTMLElement, Event>,
    data: DropdownProps
  ) => {
    setFieldTouched(field, true);
    setFieldValue(field, data.value);
  };

  const stateOptions = diagnoses.map(diagnosis => ({
    key: diagnosis.code,
    text: `${diagnosis.name} (${diagnosis.code})`,
    value: diagnosis.code
  }));

  return (
    <Form.Field>
      <label>Diagnoses</label>
      <Dropdown
        fluid
        multiple
        search
        selection
        options={stateOptions}
        onChange={onChange}
      />
      <ErrorMessage name={field} />
    </Form.Field>
  );
};
