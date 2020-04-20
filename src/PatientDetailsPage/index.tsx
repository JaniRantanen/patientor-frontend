import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { apiBaseUrl } from './../constants';
import { useStateValue, updatePatient } from "../state";
import { Header, Icon, Table, Container, Segment } from 'semantic-ui-react';
import { Patient, Entry } from "../types";
import { Diagnosis } from './../types';

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

	const getGenderIconName = (gender: string) => {
		switch (gender) {
			case "male":
				return "man";
			case "female":
				return "woman";
			default:
				return "other gender horizontal";
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
							{entry.date} <i>{entry.description}</i>
							<ul>
								{entry.diagnosisCodes?.map((code) => {
									const matchingCode = diagnosisCodes.find((diagnosis: Diagnosis) => diagnosis.code === code);
									return (
										<li key={`${Math.random()}_${code}`}>
											{code} {matchingCode?.name}
										</li>);
								})}
							</ul>
						</Segment>
					);
				})}

			</Container>
		);
	}
};

export default PatientDetailsPage;