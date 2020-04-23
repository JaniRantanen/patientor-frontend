import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form } from "formik";

import { TextField } from "../AddPatientModal/FormField";
import { EntryTypes, OccupationalHealthCareEntry } from "../types";
import { useStateValue } from "../state";
import { DiagnosisSelection } from './../AddPatientModal/FormField';
import { isValidDateString } from './../validationHelpers';

interface Props {
	onSubmit: (values: Omit<OccupationalHealthCareEntry, "id">) => void;
	onCancel: () => void;
}

export const OccupationealHealthcareForm: React.FC<Props> = ({ onSubmit, onCancel }) => {

	const [{ diagnosisCodes }] = useStateValue();

	const formDefaults = {
		description: "",
		date: "",
		specialist: "",
		diagnosisCodes: [],
		employerName: "",
		sickLeaveStartDate: "",
		sickLeaveEndDate: ""
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
					type: EntryTypes.OccupationalHealthcare,
					employerName: formValues.employerName,
					sickLeave: {
						startDate: formValues.sickLeaveStartDate,
						endDate: formValues.sickLeaveEndDate
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

				if (!values.employerName) {
					errors.employerName = requiredError;
				}

				if (values.sickLeaveStartDate !== "" && !isValidDateString(values.sickLeaveStartDate)) {
					errors.sickLeaveStartDate = "Sick leave start date is formatted incorrectly. Expected empty or YYYY-MM-DD format";
				}

				if (values.sickLeaveEndDate !== "" && !isValidDateString(values.sickLeaveEndDate)) {
					errors.sickLeaveEndDate = "Sick leave start date is formatted incorrectly. Expected empty or YYYY-MM-DD format";
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
							label="Employer name"
							placeholder="Employer name"
							name="employerName"
							component={TextField}
						/>

						<Field
							label="Sick leave start date"
							placeholder="YYYY-MM-DD"
							name="sickLeaveStartDate"
							component={TextField}
						/>

						<Field
							label="Sick leave end date"
							placeholder="YYYY-MM-DD"
							name="sickLeaveEndDate"
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

export default OccupationealHealthcareForm;
