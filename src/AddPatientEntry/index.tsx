import React from 'react';
import { HospitalEntryForm } from './HospitalEntryForm';
import { OccupationealHealthcareForm } from './OccupationalHealthcareForm';
import { HealthCheckForm } from './HealthCheckForm';
import { Entry, EntryTypes } from '../types';
import { Header, Select, Divider } from 'semantic-ui-react';

interface Props {
	onSubmit: (values: Omit<Entry, "id">) => void;
}

const AddPatientEntry = ({ onSubmit }: Props) => {

	const [currentEntryType, setCurrentEntryType] = React.useState<string>();

	return (
		<>
			<Header as="h3">Add new entry</Header>

			<b>Entry type: </b>
			<Select
				placeholder='Select type'
				value={currentEntryType}
				onChange={(e, data) => setCurrentEntryType(data.value as string)}
				options={[
					{ key: "none", value: "none", text: '' },
					{ key: EntryTypes.Hospital, value: EntryTypes.Hospital, text: 'Hospital' },
					{ key: EntryTypes.OccupationalHealthcare, value: EntryTypes.OccupationalHealthcare, text: 'Occupational healthcare' },
					{ key: EntryTypes.HealthCheck, value: EntryTypes.HealthCheck, text: 'Health check' }
				]} />

			<Divider />

			{currentEntryType === EntryTypes.Hospital &&
				<HospitalEntryForm
					onSubmit={(formValues) => {
						setCurrentEntryType("");
						onSubmit(formValues);
					}}
					onCancel={() => setCurrentEntryType("")}
				/>
			}

			{currentEntryType === EntryTypes.OccupationalHealthcare &&
				<OccupationealHealthcareForm
					onSubmit={(formValues) => {
						setCurrentEntryType("");
						onSubmit(formValues);
					}}
					onCancel={() => setCurrentEntryType("")}
				/>
			}

			{currentEntryType === EntryTypes.HealthCheck &&
				<HealthCheckForm
					onSubmit={(formValues) => {
						setCurrentEntryType("");
						onSubmit(formValues);
					}}
					onCancel={() => setCurrentEntryType("")}
				/>
			}
		</>
	);
};

export default AddPatientEntry;