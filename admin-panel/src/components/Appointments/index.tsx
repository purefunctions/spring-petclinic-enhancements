import {Theme} from "@material-ui/core";
import withStyles, {CSSProperties, WithStyles} from "@material-ui/core/styles/withStyles";
import * as R from 'ramda';
import * as React from 'react';
import {connect} from "react-redux";
import {RouteComponentProps, withRouter} from "react-router";
import {Action} from "redux";
import * as API from '../../common/lib/api';
import {
    appointmentToSummaryString,
    isServerResultFailure,
    petToSummaryString,
    vetToSummaryString
} from "../../common/lib/util"
import {IAppointment, IPet, IServerErrorStatus, IServerOpFailure, IVet} from "../../common/types";
import {IConnectedReduxProps, IRootState} from "../../store";
import {
    appointmentsList,
    getAppointmentsListServerError,
    isGetAppointmentsListInProgress
} from "../../store/appointments/reducer";

import Button from "@material-ui/core/Button/Button";
import Grid from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography/Typography";
import SearchBasedEntitySelector from "../SearchSelectableListWithIndicators";
import SelectableListWithIndicators from "../SelectableListWithIndicators";


const styles = (theme: Theme) => ({
    appointmentList: {
        maxHeight: 400,
        overflow: 'auto'
    },
    button: {
        margin: theme.spacing.unit,
    },
    root: {
        backgroundColor: theme.palette.background.paper,
        flexGrow: 1,
    } as CSSProperties,
});

const mapStateToProps = (rootState: IRootState) => ({
    appointments: appointmentsList(rootState),
    isAppointmentsDownloadInProgress: isGetAppointmentsListInProgress(rootState),
    serverError: getAppointmentsListServerError(rootState)
});

interface IAppointmentsProps {
    isAppointmentsDownloadInProgress: boolean,
    appointments: [IAppointment],
    serverError: IServerOpFailure
}

interface IAppointmentsState {
    selectedAppointment?: IAppointment,
    selectedVet?: IVet,
    selectedPet?: IPet,
    appointments: IAppointment[],
    isAppointmentsFetchError: boolean,
    isLoadingAppointments: boolean,
    appointmentDeleteErrorReason: string,
    isAppointmentDeleteError: boolean,
}

type IAppointmentsPropsDerived =
    IAppointmentsProps
    & IConnectedReduxProps<Action<any>>
    & RouteComponentProps<any>
    & WithStyles<'root' | 'button' | 'appointmentList'>;

export default withStyles(styles)(
    withRouter(
        connect(mapStateToProps)(
            class Appointments extends React.Component<IAppointmentsPropsDerived, IAppointmentsState> {
                public state: IAppointmentsState = {
                    appointmentDeleteErrorReason: "",
                    appointments: [],
                    isAppointmentDeleteError: false,
                    isAppointmentsFetchError: false,
                    isLoadingAppointments: false,
                    selectedAppointment: undefined,
                    selectedPet: undefined,
                    selectedVet: undefined,
                };

                public componentDidMount() {
                    this.handleFindAppointments();
                }

                public render() {
                    const {classes, match} = this.props;
                    window.console.log(match);
                    const {appointments, isAppointmentsFetchError, isLoadingAppointments, selectedAppointment} = this.state;
                    return (
                        <div className={classes.root}>
                            <Grid container={true} spacing={8}>
                                <Grid container={true} spacing={8}>
                                    <Grid item={true} xs={3}>
                                        <Typography variant='overline'>Filter by Vet</Typography>
                                        <SearchBasedEntitySelector searchLabel="Vet last name"
                                                                   onSearchSubmit={API.get_vets}
                                                                   stringify={vetToSummaryString}
                                                                   onSelected={this.handleVetSelected}
                                                                   onUnSelected={this.handleVetUnselected}/>
                                    </Grid>
                                    <Grid item={true} xs={3}>
                                        <Typography variant='overline'>Filter by Pet</Typography>
                                        <SearchBasedEntitySelector searchLabel="Pet name"
                                                                   onSearchSubmit={API.get_pets}
                                                                   stringify={petToSummaryString}
                                                                   onSelected={this.handlePetSelected}
                                                                   onUnSelected={this.handlePetUnselected}/>
                                    </Grid>
                                    <Grid item={true} xs={3}>
                                        <Typography variant='overline'>Select an Appointment</Typography>
                                        <Button className={classes.button} color="primary" variant="outlined"
                                                onClick={this.handleFindAppointments}>List Appointments</Button>
                                        <SelectableListWithIndicators listItems={appointments}
                                                                      stringify={appointmentToSummaryString}
                                                                      isError={isAppointmentsFetchError}
                                                                      isLoading={isLoadingAppointments}
                                                                      onSelected={this.handleOnAppointmentSelected}
                                                                      onUnselected={this.handleOnAppointmentUnselected}/>
                                    </Grid>
                                    <Grid item={true} xs={3}>
                                        <Typography variant='overline'>Appointment Actions</Typography>
                                        <Button className={classes.button} color="primary" variant="outlined"
                                                onClick={this.handleDeleteAppointment}
                                                disabled={!selectedAppointment}>Cancel Appointment</Button>
                                        <Button className={classes.button} color="primary" variant="outlined"
                                                onClick={this.handleCreateAppointment}>New Appointment</Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </div>
                    );
                }

                private handleVetSelected = (vet: IVet) => {
                    this.setState(
                        (prevState: IAppointmentsState) => R.mergeDeepRight(
                                prevState,
                            {selectedVet: vet}
                            ),
                        () => this.handleFindAppointments()
                        )
                };

                private handleVetUnselected = () => {
                    this.setState(
                        (prevState: IAppointmentsState) => R.mergeDeepRight(
                            prevState,
                            {selectedVet: undefined}
                        ),
                        () => this.handleFindAppointments()
                    )
                };

                private handlePetSelected = (pet: IPet) => {
                    this.setState(
                        (prevState: IAppointmentsState) => R.mergeDeepRight(
                            prevState,
                            {selectedVet: pet}
                        ),
                        () => this.handleFindAppointments()
                    )
                };

                private handlePetUnselected = () => {
                    this.setState(
                        (prevState: IAppointmentsState) => R.mergeDeepRight(
                            prevState,
                            {selectedVet: undefined}
                        ),
                        () => this.handleFindAppointments()
                    )
                };

                private handleFindAppointments = () => {
                    const {selectedVet, selectedPet} = this.state;
                    window.console.log(selectedPet);
                    window.console.log(selectedVet);

                    // Go through thunk actions when we figure out dispatch typescript errors
                    API.get_appointments(
                        undefined,
                        selectedVet ? selectedVet.id : undefined,
                        selectedPet ? selectedPet.id : undefined
                    ).then(
                        (result) => {
                            if (!isServerResultFailure(result)) {
                                this.setState(
                                    (prevState) => R.mergeDeepRight(prevState, {appointments: result.value})
                                )
                            }
                        }
                    )
                };

                private handleOnAppointmentSelected = (appt: IAppointment) => {
                    this.setState((prevState: IAppointmentsState) => R.mergeDeepRight(
                        prevState,
                        {selectedAppointment: appt}
                    ));
                };

                private handleOnAppointmentUnselected = () => {
                    this.setState((prevState: IAppointmentsState) => R.mergeDeepRight(
                        prevState,
                        {selectedAppointment: undefined}
                    ));
                };

                private handleCreateAppointment = () => {
                    const {history} = this.props;
                    history.push("/appointments/new");
                };

                private handleDeleteAppointment = () => {
                    const {selectedAppointment} = this.state;
                    if(selectedAppointment) {
                        API.delete_appointment(
                            selectedAppointment.id
                        ).then(
                            (result) => {
                                if(isServerResultFailure(result)) {
                                    let reason = "Server error";
                                    switch(result.error) {
                                        case IServerErrorStatus.RESOURCE_NOT_FOUND:
                                            reason = "Appointment not found";
                                    }
                                    this.setState(prevState => R.mergeDeepRight(prevState, {isAppointmentDeleteError: true, appointmentDeleteErrorReason: reason}))
                                } else {
                                    this.handleFindAppointments();
                                }
                            }
                        ).catch(
                            (error) => this.setState(prevState => R.mergeDeepRight(prevState, {isAppointmentDeleteError: true, appointmentDeleteReason: "Server error"}))
                        );
                    }
                }
            }
        )
    )
);
