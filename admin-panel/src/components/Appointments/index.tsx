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
import {IAppointment, IPet, IServerOpFailure, IVet} from "../../common/types";
import {IConnectedReduxProps, IRootState} from "../../store";
import {
    appointmentsList,
    getAppointmentsListServerError,
    isGetAppointmentsListInProgress
} from "../../store/appointments/reducer";

import Button from "@material-ui/core/Button/Button";
import Grid from "@material-ui/core/Grid/Grid";
import SearchBasedEntitySelector from "../SearchBasedEntitySelector";
import SelectableList from "../SelectableList";


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
    appointments: IAppointment[]
}

type IAppointmentsPropsDerived = IAppointmentsProps & IConnectedReduxProps<Action<any>> & RouteComponentProps<any> & WithStyles<'root' | 'button' | 'appointmentList'>;

export default withStyles(styles)(
    withRouter(
        connect(mapStateToProps)(
            class Appointments extends React.Component<IAppointmentsPropsDerived, IAppointmentsState> {
                public state: IAppointmentsState = {
                    appointments: [],
                    selectedAppointment: undefined,
                    selectedPet: undefined,
                    selectedVet: undefined,
                };

                public render() {
                    const {classes} = this.props;
                    const {appointments} = this.state;
                    return (
                        <div className={classes.root}>
                            <Grid container={true} spacing={8}>
                                <Grid container={true} spacing={8}>
                                    <Grid item={true} xs={3}>
                                        <SearchBasedEntitySelector searchLabel="Vet last name"
                                                                   onSearchSubmit={API.get_vets}
                                                                   stringify={vetToSummaryString}
                                                                   onSelected={this.handleVetSelected}
                                                                   onUnSelected={this.handleVetUnselected}/>
                                    </Grid>
                                    <Grid item={true} xs={3}>
                                        <SearchBasedEntitySelector searchLabel="Pet name"
                                                                   onSearchSubmit={API.get_pets}
                                                                   stringify={petToSummaryString}
                                                                   onSelected={this.handlePetSelected}
                                                                   onUnSelected={this.handlePetUnselected}/>
                                    </Grid>
                                    <Grid item={true} xs={3}>
                                        <Button className={classes.button} color="primary" variant="text" onClick={this.handleFindAppointments}>Find Appointments</Button>
                                        <SelectableList listItems={appointments} stringify={appointmentToSummaryString}/>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </div>
                    );
                }

                private handleVetSelected = (vet: IVet) => {
                    this.setState((prevState: IAppointmentsState) => R.mergeDeepRight(
                        prevState,
                        {selectedVet: vet}
                    ))
                };

                private handleVetUnselected = () => {
                    this.setState((prevState: IAppointmentsState) => R.mergeDeepRight(
                        prevState,
                        {selectedVet: undefined}
                    ))
                };

                private handlePetSelected = (pet: IPet) => {
                    this.setState((prevState: IAppointmentsState) => R.mergeDeepRight(
                        prevState,
                        {selectedPet: pet}
                    ))
                };

                private handlePetUnselected = () => {
                    this.setState((prevState: IAppointmentsState) => R.mergeDeepRight(
                        prevState,
                        {selectedPet: undefined}
                    ))
                };

                private handleFindAppointments = () => {
                    const {selectedVet, selectedPet} = this.state;

                    // Go through thunk actions when we figure out dispatch typescript errors
                    API.get_appointments(
                        undefined,
                        selectedVet ? selectedVet.id : undefined,
                        selectedPet ? selectedPet.id : undefined
                    ).then(
                        (result) => {
                            if(!isServerResultFailure(result)) {
                                this.setState(
                                    (prevState) => R.mergeDeepRight(prevState, {appointments: result.value})
                                )
                            }
                        }
                    )
                }
            }
        )
    )
);
