import * as R from 'ramda';
import {Reducer} from 'redux';
import {checkNever} from "../../common/lib/util";
import {IAppointmentSummary, IServerOpFailure} from "../../common/types";
import {IRootState} from "../index";
// import {IRootState} from "../index";
import {
    IAppointmentsAction,
    // IAppointmentsListGetRequest,
    // IAppointmentsListGetSucceeded,
    // IAppointmentsListGetFailed,
    IAppointmentState
} from "./types";

const initState: IAppointmentState = {
    appointments: {
        appointmentsList: [],
        dateFilter: undefined,
        isGetInProgress: false,
        petIdFilter: undefined,
        serverFailure: undefined,
        vetIdFilter: undefined,
    }
};

const reducer: Reducer<IAppointmentState> = (state: IAppointmentState = initState, action: IAppointmentsAction) => {
    switch (action.type) {
        case "@@appointments/APPOINTMENTS_LIST_GET_REQUEST":
            return R.mergeDeepRight(
                state,
                {
                    appointments: {
                        appointmentsList: [],
                        dateFilter: action.payload.date !== undefined ? action.payload.date : undefined,
                        isGetInProgress: true,
                        petIdFilter: action.payload.petId !== undefined ? action.payload.petId : undefined,
                        serverFailure: undefined,
                        vetIdFilter: action.payload.vetId !== undefined ? action.payload.vetId : undefined,
                    }
                }
            );
        case "@@appointments/APPOINTMENTS_LIST_GET_SUCCEEDED":
            return R.mergeDeepRight(
                state,
                {
                    appointments: {
                        appointmentsList: action.payload.result.value,
                        isGetInProgress: false,
                        serverFailure: undefined,
                    }
                }
            );
        case "@@appointments/APPOINTMENTS_LIST_GET_FAILED":
            return R.mergeDeepRight(
                state,
                {
                    appointments: {
                        appointmentsList: [],
                        isGetInProgress: false,
                        serverFailure: action.payload.result
                    }
                }
            );
        default:
            checkNever(action);
            return state;
    }
};

/* Selectors */

export function isGetAppointmentsListInProgress(rootState: IRootState) : boolean {
    return rootState.appointments.appointments.isGetInProgress;
}

export function appointmentsList(rootState: IRootState) : IAppointmentSummary[] {
    return rootState.appointments.appointments.appointmentsList;
}

export function getAppointmentsListServerError(rootState: IRootState) : IServerOpFailure | undefined {
    return rootState.appointments.appointments.serverFailure;
}

export default reducer;
