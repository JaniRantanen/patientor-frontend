import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form } from "formik";

import { TextField } from "../AddPatientModal/FormField";
import { HospitalEntry, EntryTypes } from "../types";
import { useStateValue } from "../state";
import { DiagnosisSelection } from './../AddPatientModal/FormField';
import { isValidDateString } from './../validationHelpers';

interface Props {
	onSubmit: (values: Omit<HospitalEntry, "id">) => void;
	onCancel: () => void;
}

export const HospitalEntryForm: React.FC<Props> = ({ onSubmit, onCancel }) => {

	const [{ diagnosisCodes }] = useStateValue();

	/*
		NOTE TO SELF
		Even though Formik says it supports nested values using the dot notation in field names (ie: "discharge.date" is handled as an object),
		this seems to cause problems on the validation site. Formik's ErrorMessage component not detect the error, even though the errors 
		are added to the error-object in the forms validation function.

		Just for simplicity's sake the form data will be flattened for now. As long as the form component submits the proper object everything should be fine.

		TODO: Investigate the proper solution for handling nested objects in Formik
		More information: https://jaredpalmer.com/formik/docs/api/field#name, https://github.com/jaredpalmer/formik/issues/1091
	*/

	const formDefaults = {
		description: "",
		date: "",
		specialist: "",
		diagnosisCodes: [],
		dischargeDate: "",
		dischargeCriteria: ""
	};

	return (
		<Formik
			initialValues={formDefaults}
			onSubmit={(formValues) => {
				//Handle transforming data back to the correct nested structure after flattening it
				onSubmit({
					description: formValues.description,
					date: formValues.date,
					specialist: formValues.specialist,
					diagnosisCodes: formValues.diagnosisCodes,
					type: EntryTypes.Hospital,
					discharge: {
						date: formValues.dischargeDate,
						criteria: formValues.dischargeCriteria
					}
				});
			}}
			validate={(values) => {
				const requiredError = "Field is required";
				const errors: { [field: string]: string } = {};

				if (!values.description) {
					errors.description = requiredError;
				}

				if (!values.date) {
					errors.date = requiredError;
				} else if (!isValidDateString(values.date)) {
					errors.date = "Date is formatted incorrectly. Expected YYYY-MM-DD format";
				}

				if (!values.specialist) {
					errors.specialist = requiredError;
				}

				if (!values.dischargeDate) {
					errors.dischargeDate = requiredError;
				} else if (!isValidDateString(values.date)) {
					errors.dischargeDate = "Discharge date is formatted incorrectly. Expected YYYY-MM-DD format";
				}

				if (!values.dischargeCriteria) {
					errors.dischargeCriteria = requiredError;
				}
				return errors;
			}}
		>

			{({ isValid, dirty, setFieldValue, setFieldTouched }) => {
				return (
					<Form className="form ui">
						<Field
							label="Description"
							placeholder="Description"
							name="description"
							component={TextField}
						/>

						<Field
							label="Date"
							placeholder="YYYY-MM-DD"
							name="date"
							component={TextField}
						/>

						<Field
							label="Specialist"
							placeholder="Specialist"
							name="specialist"
							component={TextField}
						/>

						<Field
							label="Discharge date"
							placeholder="YYYY-MM-DD"
							name="dischargeDate"
							component={TextField}
						/>

						<Field
							label="Criteria"
							placeholder="Criteria"
							name="dischargeCriteria"
							component={TextField}
						/>

						<DiagnosisSelection
							setFieldValue={setFieldValue}
							setFieldTouched={setFieldTouched}
							diagnoses={Object.values(diagnosisCodes)}
						/>

						<Grid>

							<Grid.Column floated="left" width={5}>
								<Button type="button" onClick={onCancel} color="red">Cancel</Button>
							</Grid.Column>

							<Grid.Column floated="right" width={5}>
								<Button
									type="submit"
									floated="right"
									color="green"
									disabled={!dirty || !isValid}
								>
									Add entry
								</Button>
							</Grid.Column>

						</Grid>
					</Form>
				);
			}}

		</Formik >
	);
};

export default HospitalEntryForm;
