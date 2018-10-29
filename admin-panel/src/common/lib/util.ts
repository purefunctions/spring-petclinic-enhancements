import * as moment from "moment";
import {
    IAppointment,
    IOwner,
    IPet,
    IPetType,
    IServerOp,
    IServerOpFailure,
    IServerOpResult,
    ISpecialty,
    IVet
} from "../types";

export function checkNever(_: never): void {
    return;
}

export function isServerResultFailure<Op extends IServerOp, T> (result: IServerOpResult<Op, T>): result is IServerOpFailure {
    return ((result as IServerOpFailure).error !== undefined);
}

export function vetToSummaryString(vet: IVet) {
    let specialties = "";
    if(vet.specialties && vet.specialties.length > 0) {
        specialties = ` (${vet.specialties.map((specialty: ISpecialty) => specialty.name).join(", ")})`;
    }
    return `${vet.lastName}, ${vet.firstName} ${specialties}`;
}

export function petToSummaryString(pet: IPet) {
    return `${pet.name} - ${pet.type.name} (${pet.owner.lastName}, ${pet.owner.firstName})`;
}

export function appointmentToSummaryString(appt: IAppointment) {
    return `${dateTimeToUSString(appt.startTime)} -- ${vetToSummaryString(appt.vet)} -- ${petToSummaryString(appt.pet)}`;
}

export function ownerToSummaryString(owner: IOwner) {
    return `${owner.lastName}, ${owner.firstName} - ${owner.telephone}`;
}

export function petTypeToSummaryString(petType: IPetType) {
    return petType.name;
}

export function dateTimeToUSString(date: Date) {
    return moment(date).format("MMM DD YYYY, HH:mm")
}
