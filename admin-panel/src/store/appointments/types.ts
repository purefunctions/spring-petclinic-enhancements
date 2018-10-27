import {Action} from "redux";
import {
    IAppointment,
    IServerGetOp,
    IServerOpFailure,
    IServerOpSuccess
} from "../../common/types"

export interface IAppointmentState {
    appointments: {
        appointmentsList: IAppointment[],
        isGetInProgress: boolean,
        serverFailure?: IServerOpFailure,
        dateFilter?: Date,
        vetIdFilter?: number,
        petIdFilter?: number
    }
}

/*
Actions for appointments store
 */
export interface IAppointmentsListGetRequest extends Action {
    type: "@@appointments/APPOINTMENTS_LIST_GET_REQUEST",
    payload: {
        date: Date,
        petId: number,
        vetId: number
    }
}

export interface IAppointmentsListGetSucceeded extends Action {
    type: "@@appointments/APPOINTMENTS_LIST_GET_SUCCEEDED",
    payload: {
        result: IServerOpSuccess<IServerGetOp, IAppointment[]>
    }
}

export interface IAppointmentsListGetFailed extends Action {
    type: "@@appointments/APPOINTMENTS_LIST_GET_FAILED",
    payload: {
        result: IServerOpFailure
    }
}

export type IAppointmentsAction = IAppointmentsListGetRequest | IAppointmentsListGetSucceeded | IAppointmentsListGetFailed;
