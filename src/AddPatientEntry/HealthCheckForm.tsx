import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form } from "formik";

import { TextField } from "../AddPatientModal/FormField";
import { EntryTypes, HealthCheckEntry, HealthCheckRating } from "../types";
import { useStateValue } from "../state";
import { DiagnosisSelection } from './../AddPatientModal/FormField';
import { isValidDateString } from './../validationHelpers';

interface Props {
	onSubmit: (values: Omit<HealthCheckEntry, "id">) => void;
	onCancel: () => void;
}

export const HealthCheckForm: React.FC<Props> = ({ onSubmit, onCancel }) => {

	const [{ diagnosisCodes }] = useStateValue();

	const formDefaults = {
		description: "",
		date: "",
		specialist: "",
		diagnosisCodes: [],
		healthCheckRating: HealthCheckRating.Healthy,
	};

	return (
		<Formik
			initialValues={formDefaults}
			onSubmit={(formValues) => {
				//Handle transforming data to correct type
				onSubmit({
					description: formValues.description,
					date: formValues.date,
					specialist: formValues.specialist,
					diagnosisCodes: formValues.diagnosisCodes,
					type: EntryTypes.HealthCheck,
					healthCheckRating: Number(formValues.healthCheckRating)
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
							label="Health rating"
							placeholder=""
							name="healthCheckRating"
							component="select"
						>
							<option value={HealthCheckRating.Healthy}>Healthy</option>
							<option value={HealthCheckRating.LowRisk}>Low risk</option>
							<option value={HealthCheckRating.HighRisk}>High risk</option>
							<option value={HealthCheckRating.CriticalRisk}>Critical risk</option>

						</Field>


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

export default HealthCheckForm;
