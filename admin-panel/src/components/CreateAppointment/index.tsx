import {Theme} from "@material-ui/core";
import withStyles, {CSSProperties, WithStyles} from "@material-ui/core/styles/withStyles";
import * as moment from 'moment';
import * as R from 'ramda';
import * as React from 'react';
import {connect} from "react-redux";
import {RouteComponentProps, withRouter} from "react-router";
import {Action} from "redux";
import * as API from '../../common/lib/api';
import {dateTimeToUSString, isServerResultFailure, petToSummaryString, vetToSummaryString} from "../../common/lib/util"
import {IAppointment, IPet, IServerErrorStatus, IServerOpFailure, IVet} from "../../common/types";
import {IConnectedReduxProps, IRootState} from "../../store";
import {
    appointmentsList,
    getAppointmentsListServerError,
    isGetAppointmentsListInProgress
} from "../../store/appointments/reducer";

import Button from "@material-ui/core/Button/Button";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import Grid from "@material-ui/core/Grid/Grid";
import TextField from "@material-ui/core/TextField/TextField";
import Typography from "@material-ui/core/Typography/Typography";
import SearchBasedEntitySelector from "../SearchSelectableListWithIndicators";
import SelectableListWithIndicators from "../SelectableListWithIndicators";


const styles = (theme: Theme) => ({
    button: {
        margin: theme.spacing.unit,
    },
    list: {
        maxHeight: 400,
        overflow: 'auto'
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
    availabilities: Date[],
    createdAppointment?: IAppointment,
    selectedAvailability?: Date,
    selectedDate?: Date,
    selectedVet?: IVet,
    selectedPet?: IPet,
    appointmentCreateErrorReason: string,
    isCreatingAppointment: boolean,
    isAvailabilitiesGetError: boolean,
    appointmentCreationSuccessful: boolean,
}

type IAppointmentsPropsDerived =
    IAppointmentsProps
    & IConnectedReduxProps<Action<any>>
    & RouteComponentProps<any>
    & WithStyles<'root' | 'button' | 'list'>;

export default withStyles(styles)(
    withRouter(
        connect(mapStateToProps)(
            class CreateAppointment extends React.Component<IAppointmentsPropsDerived, IAppointmentsState> {
                public state: IAppointmentsState = {
                    appointmentCreateErrorReason: "",
                    appointmentCreationSuccessful: false,
                    availabilities: [],
                    createdAppointment: undefined,
                    isAvailabilitiesGetError: false,
                    isCreatingAppointment: false,
                    selectedAvailability: undefined,
                    selectedDate: undefined,
                    selectedPet: undefined,
                    selectedVet: undefined,
                };

                public render() {
                    const {classes} = this.props;
                    const {appointmentCreationSuccessful, isAvailabilitiesGetError, availabilities, isCreatingAppointment, selectedDate, appointmentCreateErrorReason} = this.state;
                    return (
                        <div className={classes.root}>
                            <Grid container={true} spacing={8}>
                                <Grid container={true} spacing={8}>
                                    <Grid item={true} xs={3}>
                                        <Typography variant='overline'>Select Vet</Typography>
                                        <SearchBasedEntitySelector searchLabel="Vet last name"
                                                                   onSearchSubmit={API.get_vets}
                                                                   stringify={vetToSummaryString}
                                                                   onSelected={this.handleVetSelected}
                                                                   onUnSelected={this.handleVetUnselected}/>
                                    </Grid>
                                    <Grid item={true} xs={3}>
                                        <Typography variant='overline'>Select Availability</Typography>
                                        <TextField type="date" required={true} error={!selectedDate} onChange={this.onSelectedDateChange}/>
                                        <SelectableListWithIndicators listItems={availabilities}
                                                                      stringify={dateTimeToUSString}
                                                                      isError={isAvailabilitiesGetError}
                                                                      isLoading={isCreatingAppointment}
                                                                      onSelected={this.handleOnAvailabilitySelected}
                                                                      onUnselected={this.handleOnAvailabilityUnselected}/>
                                    </Grid>
                                    <Grid item={true} xs={3}>
                                        <Typography variant='overline'>Select Pet</Typography>
                                        <SearchBasedEntitySelector searchLabel="Pet name"
                                                                   onSearchSubmit={API.get_pets}
                                                                   stringify={petToSummaryString}
                                                                   onSelected={this.handlePetSelected}
                                                                   onUnSelected={this.handlePetUnselected}/>
                                    </Grid>
                                    <Grid item={true} xs={3}>
                                        <Typography variant='overline'>Appointment Actions</Typography>
                                        <Button disabled={!this.isCreateAppointmentParamsValid()}
                                                className={classes.button} color="primary" variant="outlined"
                                                onClick={this.handleCreateAppointment}>Create</Button>
                                        <Typography variant='overline' color='error'>
                                            {appointmentCreateErrorReason}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Dialog open={appointmentCreationSuccessful}>
                                <DialogContent>
                                    <DialogContentText>
                                       Appointment created!
                                    </DialogContentText>
                                    <DialogActions>
                                        <Button variant='outlined' color='primary' onClick={this.handleSuccessDialogClose}>
                                            Back to Appointments
                                        </Button>
                                    </DialogActions>
                                </DialogContent>
                            </Dialog>
                        </div>
                    );
                }

                private handleSuccessDialogClose = () => {
                    const {history} = this.props;
                    history.push("/appointments");
                };

                private handleVetSelected = (vet: IVet) => {
                    this.setState(
                        (prevState: IAppointmentsState) => R.mergeDeepRight(
                            prevState,
                            {selectedVet: vet}
                        ),
                        () => this.handleFindAvailabilities()
                    )
                };

                private handleVetUnselected = () => {
                    this.setState(
                        (prevState: IAppointmentsState) => R.mergeDeepRight(
                            prevState,
                            {selectedVet: undefined}
                        ),
                        () => this.handleFindAvailabilities()
                    )
                };

                private handlePetSelected = (pet: IPet) => {
                    this.setState(
                        (prevState: IAppointmentsState) => R.mergeDeepRight(
                            prevState,
                            {selectedPet: pet}
                        )
                    )
                };

                private handlePetUnselected = () => {
                    this.setState(
                        (prevState: IAppointmentsState) => R.mergeDeepRight(
                            prevState,
                            {selectedPet: undefined}
                        )
                    )
                };

                private handleFindAvailabilities = () => {
                    const {selectedVet, selectedDate} = this.state;

                    // Go through thunk actions when we figure out dispatch typescript errors
                    if(selectedDate && selectedVet) {
                        API.get_availabilities(
                            selectedVet.id,
                            selectedDate
                        ).then(
                            (result) => {
                                if (!isServerResultFailure(result)) {
                                    this.setState(
                                        (prevState) => R.mergeDeepRight(prevState, {availabilities: result.value})
                                    )
                                }
                            }
                        )
                    }
                };

                private handleOnAvailabilitySelected = (time: Date) => {
                    this.setState(
                    (prevState: IAppointmentsState) => R.mergeDeepRight(prevState,{selectedAvailability: time}),
                        () => this.handleFindAvailabilities()
                    );
                };

                private handleOnAvailabilityUnselected = () => {
                    this.setState((prevState: IAppointmentsState) => R.mergeDeepRight(
                        prevState,
                        {selectedAvailability: undefined}
                    ));
                };

                private onSelectedDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                    const parsed = moment(event.target.value, "YYYY-MM-DD", true);
                    if (parsed.isValid()) {
                        this.setState(
                            (prevState => R.mergeDeepRight(prevState, {selectedDate: parsed.toDate()})),
                            () => this.handleFindAvailabilities()
                        )
                    } else {
                        this.setState((prevState => R.mergeDeepRight(prevState, {availabilities: []})))
                    }
                };

                private handleCreateAppointment = () => {
                    const {selectedAvailability, selectedPet, selectedVet} = this.state;
                    if(selectedPet && selectedVet && selectedAvailability) {
                        window.console.log(`posting to appointments with petId ${selectedPet.id}, vetId ${selectedVet.id}`);
                        API.post_appointments(
                            selectedVet.id, selectedPet.id, selectedAvailability
                        ).then(
                            (result) => {
                                if(isServerResultFailure(result)) {
                                    let reason = "Server error";
                                    switch(result.error) {
                                        case IServerErrorStatus.CONFLICT:
                                            reason = "Appointment conflict. Select available time again";
                                            break;
                                        case IServerErrorStatus.BAD_REQUEST:
                                            reason = "Bad request. Perhaps trying for an appointment in the past?";
                                            break;
                                        default:
                                            reason = "Server Error";
                                    }
                                    this.setState(prevState => R.mergeDeepRight(prevState, {appointmentCreateErrorReason: reason}))
                                } else {
                                    this.setState(prevState => R.mergeDeepRight(prevState, {appointmentCreationSuccessful: true}))
                                }
                            }
                        ).catch(
                            (error) => this.setState(prevState => R.mergeDeepRight(prevState, {isAppointmentCreateError: true, appointmentCreateReason: "Server error"}))
                        );
                    }
                };

                private isCreateAppointmentParamsValid = () => {
                    const {selectedVet, selectedPet, selectedAvailability} = this.state;
                    return selectedVet && selectedPet && selectedAvailability;
                };
            }
        )
    )
);
