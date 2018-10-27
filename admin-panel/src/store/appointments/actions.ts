import {ActionCreator} from "redux";
import {ThunkAction} from "redux-thunk";
import  * as api from '../../common/lib/api';
import {isServerResultFailure} from "../../common/lib/util";
import {
    IAppointment,
    IServerGetOp,
    IServerOpFailure,
    IServerOpResult,
    IServerOpSuccess
} from "../../common/types";
import {IRootState} from "../index";
import {IAppointmentsAction} from "./types";

export const getAppointmentsList : ActionCreator<ThunkAction<void, IRootState, void, any>> = (dateFilter, vetIdFilter, petIdFilter) => {
    return async (dispatch) => {
        dispatch({
            payload: {
                date: dateFilter,
                petId: petIdFilter,
                vetId: vetIdFilter,
            },
            type: "@@appointments/APPOINTMENTS_LIST_GET_REQUEST",
        });
        const result : IServerOpResult<IServerGetOp, IAppointment[]> = await api.get_appointments(dateFilter, vetIdFilter, petIdFilter);
        if(isServerResultFailure(result)) {
            dispatch(declareUserGetAppointmentsFailed(result));
        } else {
            dispatch(declareUserGetAppointmentsSucceeded(result));
        }
    }
};

export const declareUserGetAppointmentsSucceeded : ActionCreator<IAppointmentsAction> =
    (result: IServerOpSuccess<IServerGetOp, IAppointment[]>) => ({
        payload: {
            result
        },
        type: "@@appointments/APPOINTMENTS_LIST_GET_SUCCEEDED",
    });

export const declareUserGetAppointmentsFailed : ActionCreator<IAppointmentsAction> =
    (result: IServerOpFailure) => ({
        payload: {
            result
        },
        type: "@@appointments/APPOINTMENTS_LIST_GET_FAILED",
    });
