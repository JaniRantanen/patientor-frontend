
import React from "react";
import { HospitalEntry, OccupationalHealthCareEntry, HealthCheckEntry, HealthCheckRating } from '../types';
import { Icon, Label } from "semantic-ui-react";

export const Hospital: React.FC<{ entry: HospitalEntry }> = ({ entry }) => {
	return (
		<div>
			<b>Discharged:</b> {entry.discharge.date}
			<br />
			<b>Discharge reason:</b> {entry.discharge.criteria}
		</div >
	);
};

export const OccupationalHealthCare: React.FC<{ entry: OccupationalHealthCareEntry }> = ({ entry }) => {

	return (
		<div>
			<b>Employer:</b> {entry.employerName}
			<br />
			<b>Sick leave:</b> {entry.sickLeave ? `${entry.sickLeave?.startDate} - ${entry.sickLeave?.endDate}` : "No"}
		</div>
	);
};

export const HealthCheck: React.FC<{ entry: HealthCheckEntry }> = ({ entry }) => {

	const ratingToColor = (rating: HealthCheckRating) => {
		switch (rating) {
			case HealthCheckRating.Healthy:
				return "green";
			case HealthCheckRating.LowRisk:
				return "yellow";
			case HealthCheckRating.HighRisk:
				return "orange";
			case HealthCheckRating.CriticalRisk:
				return "red";
			default:
				return "black";
		}
	};

	const ratingToDescription = (rating: HealthCheckRating) => {
		switch (rating) {
			case HealthCheckRating.Healthy:
				return "Healthy";
			case HealthCheckRating.LowRisk:
				return "Low risk";
			case HealthCheckRating.HighRisk:
				return "High risk";
			case HealthCheckRating.CriticalRisk:
				return "Critical risk";
			default:
				return "Unknown health rating";
		}
	};

	return (
		<div>
			<Label>
				<Icon name="heart" color={ratingToColor(entry.healthCheckRating)} />
				{ratingToDescription(entry.healthCheckRating)}
			</Label>
		</div>
	);
};