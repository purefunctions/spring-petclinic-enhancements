import * as R from 'ramda';
import {Reducer} from 'redux';
import {checkNever} from "../../common/lib/util";
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
        errorMessage: "",
        isGetInProgress: false,
        petIdFilter: undefined,
        serverError: undefined,
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
                        errorMessage: "",
                        isGetInProgress: true,
                        petIdFilter: action.payload.petId !== undefined ? action.payload.petId : undefined,
                        serverError: undefined,
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
                        errorMessage: "",
                        isGetInProgress: false,
                        serverError: undefined,
                    }
                }
            );
        case "@@appointments/APPOINTMENTS_LIST_GET_FAILED":
            return R.mergeDeepRight(
                state,
                {
                    appointments: {
                        appointmentsList: [],
                        errorMessage: action.payload.result.message,
                        isGetInProgress: false,
                        serverError: action.payload.result.error,
                    }
                }
            );
        default:
            checkNever(action);
            return state;
    }
};

export default reducer;
