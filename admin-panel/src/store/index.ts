import {routerReducer, RouterState} from "react-router-redux";
import {Action, combineReducers, Dispatch, Reducer} from 'redux';

import appointmentsReducer from "./appointments/reducer"
import { IAppointmentState } from "./appointments/types";

// top level state
export interface IRootState {
    appointments: IAppointmentState,
    router: RouterState
}

// Whenever an action is dispatched, Redux will update each top-level application state property
// using the reducer with the matching name. It's important that the names match exactly, and that
// the reducer acts on the corresponding IRootState property type.

export const reducers: Reducer<IRootState> = combineReducers<IRootState>({
    appointments: appointmentsReducer,
    router: routerReducer
});

// Additional props for connected React components. This prop is passed by default with `connect()`
export interface IConnectedReduxProps<S extends Action<any>> {
    // Correct types for the `dispatch` prop passed by `react-redux`.
    // Additional type information is given through generics.
    dispatch: Dispatch<S>;
}
