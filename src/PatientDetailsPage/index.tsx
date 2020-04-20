import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Header, Icon, Table, Container, Segment, Divider } from 'semantic-ui-react';

import { apiBaseUrl } from './../constants';
import { useStateValue, updatePatient } from "../state";
import { Patient, Entry, EntryTypes, Diagnosis, Gender } from "../types";
import { Hospital, OccupationalHealthCare, HealthCheck } from "./EntryComponents";

const PatientDetailsPage = () => {
	const { id } = useParams<{ id: string }>();
	const [{ patients, diagnosisCodes }, dispatch] = useStateValue();
	const currentPatient = patients[id];

	React.useEffect(() => {
		const shouldFetchData = currentPatient && !currentPatient.fetchTimestamp;
		if (shouldFetchData) {
			const fetchPatientDetails = async () => {
				try {
					const { data: patientDetails } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
					patientDetails.fetchTimestamp = Math.floor(Date.now() / 1000);
					dispatch(updatePatient(patientDetails));
				} catch (e) {
					console.error(e);
				}
			};
			fetchPatientDetails();
		}
	}, [currentPatient, dispatch, id]);

	const assertNever = (value: never): never => {
		throw new Error(`Unhandled value: ${JSON.stringify(value)}`);
	};

	const getGenderIconName = (gender: string) => {
		switch (gender) {
			case Gender.Male:
				return "man";
			case Gender.Female:
				return "woman";
			default:
				return "other gender horizontal";
		}
	};

	const getEntryTypeIconName = (type: string) => {
		switch (type) {
			case EntryTypes.Hospital:
				return "hospital";
			case EntryTypes.OccupationalHealthcare:
				return "medkit";
			case EntryTypes.HealthCheck:
				return "doctor";
			default:
				return "question";
		}
	};

	const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
		switch (entry.type) {
			case EntryTypes.Hospital:
				return <Hospital entry={entry} />;
			case EntryTypes.OccupationalHealthcare:
				return <OccupationalHealthCare entry={entry} />;
			case EntryTypes.HealthCheck:
				return <HealthCheck entry={entry} />;
			default:
				return assertNever(entry);
		}
	};

	const CodeList: React.FC<{ listOfCodes: string[] | undefined }> = ({ listOfCodes }) => {
		if (!listOfCodes) {
			return null;
		} else {
			return (
				<div>
					<Header as="h3">codes</Header>
					<ul>
						{listOfCodes.map((code) => {
							const matchingCode = diagnosisCodes.find((diagnosis: Diagnosis) => diagnosis.code === code);
							return (
								<li key={`${Math.random()}_${code}`}>
									{code} {matchingCode?.name}
								</li>);
						})}
					</ul>
				</div>
			);
		}
	};

	if (!currentPatient) {
		return null;
	} else {
		return (
			<Container>
				<Header as="h2">
					{currentPatient.name} <Icon name={getGenderIconName(currentPatient.gender)} />
				</Header>

				<Table celled>
					<Table.Body>
						<Table.Row>
							<Table.Cell>ssn</Table.Cell>
							<Table.Cell>{currentPatient.ssn}</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>occupation</Table.Cell>
							<Table.Cell>{currentPatient.occupation}</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>date of birth:</Table.Cell>
							<Table.Cell>{currentPatient.dateOfBirth}</Table.Cell>
						</Table.Row>
					</Table.Body>
				</Table>

				<Header as="h3">
					entries
				</Header>

				{currentPatient.entries?.map((entry: Entry) => {
					return (
						<Segment key={entry.id}>
							<Header as="h3">{entry.date} <Icon name={getEntryTypeIconName(entry.type)} /></Header>
							<i>{entry.description}</i>  - {entry.specialist}
							<Divider />
							<Header as="h4">Additional information</Header>
							<EntryDetails entry={entry} />
							<CodeList listOfCodes={entry.diagnosisCodes} />
						</Segment>
					);
				})
				}

			</Container>
		);
	}
};

export default PatientDetailsPage;