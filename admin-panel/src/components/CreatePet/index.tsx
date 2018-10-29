import {Theme} from "@material-ui/core";
import Button from "@material-ui/core/Button/Button";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import DialogActions from "@material-ui/core/es/DialogActions/DialogActions";
import Grid from "@material-ui/core/Grid/Grid";
import withStyles, {CSSProperties, WithStyles} from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField/TextField";
import Typography from "@material-ui/core/Typography/Typography";
import * as moment from "moment";
import * as R from "ramda";
import * as React from 'react';
import {RouteComponentProps, withRouter} from "react-router";
import * as API from "../../common/lib/api";
import {
    isServerResultFailure,
    ownerToSummaryString,
    petTypeToSummaryString
} from "../../common/lib/util";
import {IOwner, IPetType, IServerErrorStatus} from "../../common/types";
import SearchBasedEntitySelector from "../SearchSelectableListWithIndicators";

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
        margin: '10px',
        textAlign: 'center'
    } as CSSProperties,
});

interface ICreatePetProps {
    [x: string]: any
}

interface ICreatePetState {
    isPetCreationSuccessful: boolean,
    selectedOwner?: IOwner,
    selectedPetType?: IPetType,
    selectedBirthDate?: Date,
    selectedName: string,
    petCreationErrorReason: string
}

type ICreatePetsPropsDerived = ICreatePetProps & RouteComponentProps<any> & WithStyles<'root' | 'button' | 'list'>;

export default withStyles(styles)(
    withRouter(
        class Pets extends React.Component<ICreatePetsPropsDerived, ICreatePetState> {
            public state: ICreatePetState = {
                isPetCreationSuccessful: false,
                petCreationErrorReason: "",
                selectedBirthDate: undefined,
                selectedName: "",
                selectedOwner: undefined,
                selectedPetType: undefined,
            };

            public render() {
                const {classes} = this.props;
                const {isPetCreationSuccessful, selectedBirthDate, selectedName, petCreationErrorReason} = this.state;
                return (
                    <div className={classes.root}>
                        <Grid container={true} spacing={8}>
                            <Grid container={true} spacing={8}>
                                <Grid item={true} xs={3}>
                                    <Typography variant='overline'>Select Owner</Typography>
                                    <SearchBasedEntitySelector searchLabel="Owner last name"
                                                               onSearchSubmit={API.get_owners}
                                                               stringify={ownerToSummaryString}
                                                               onSelected={this.handleOwnerSelected}
                                                               onUnSelected={this.handleOwnerUnselected}/>
                                </Grid>
                                <Grid item={true} xs={3}>
                                    <Typography variant='overline'>Select Pet Type</Typography>
                                    <SearchBasedEntitySelector searchLabel="Pet type"
                                                               onSearchSubmit={API.get_pet_types}
                                                               stringify={petTypeToSummaryString}
                                                               onSelected={this.handlePetTypeSelected}
                                                               onUnSelected={this.handlePetTypeUnselected}/>
                                </Grid>
                                <Grid item={true} xs={3}>
                                    <div>
                                        <TextField type="date" required={true} error={!selectedBirthDate} onChange={this.onBirthDateChange}/>
                                    </div>
                                    <div>
                                        <TextField label='Name' required={true} error={!selectedName} onChange={this.onNameChange}/>
                                    </div>
                                </Grid>
                                <Grid item={true} xs={3}>
                                    <Button disabled={!this.isPetCreationParamsValid()}
                                            className={classes.button} color="primary" variant="outlined"
                                            onClick={this.handleCreatePet}>Create</Button>
                                    <Typography variant='overline' color='error'>
                                        {petCreationErrorReason}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Dialog open={isPetCreationSuccessful}>
                            <DialogContent>
                                <DialogContentText>
                                    Pet created!
                                </DialogContentText>
                                <DialogActions>
                                    <div className={classes.root}>
                                        <Button variant='outlined' color='primary' onClick={this.handleBackToPets}>
                                            Back to Pets
                                        </Button>
                                    </div>
                                    <div className={classes.root}>
                                        <Button variant='outlined' color='primary' onClick={this.handleBackToAppointments}>
                                            Back to Appointments
                                        </Button>
                                    </div>
                                </DialogActions>
                            </DialogContent>
                        </Dialog>
                    </div>
                )
            }

            private handleOwnerSelected = (owner: IOwner) => {
                this.setState(
                    (prevState: ICreatePetState) => R.mergeDeepRight(
                        prevState,
                        {selectedOwner: owner}
                    )
                )
            };

            private handleOwnerUnselected = () => {
                this.setState(
                    (prevState: ICreatePetState) => R.mergeDeepRight(
                        prevState,
                        {selectedOwner: undefined}
                    )
                )
            };

            private handlePetTypeSelected = (petType: IPetType) => {
                this.setState(
                    (prevState: ICreatePetState) => R.mergeDeepRight(
                        prevState,
                        {selectedPetType: petType}
                    )
                )
            };

            private handlePetTypeUnselected = () => {
                this.setState(
                    (prevState: ICreatePetState) => R.mergeDeepRight(
                        prevState,
                        {selectedPetType: undefined}
                    )
                )
            };

            private onBirthDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                const parsed = moment(event.target.value, "YYYY-MM-DD", true);
                if (parsed.isValid()) {
                    this.setState(
                        prevState => R.mergeDeepRight(prevState, {selectedBirthDate: parsed.toDate()})
                    )
                }
            };

            private onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                const {value} = event.target;
                this.setState(prevState => R.mergeDeepRight(prevState, {selectedName: value.trim()}))
            };

            private isPetCreationParamsValid = () => {
                const {selectedOwner, selectedName, selectedPetType, selectedBirthDate} = this.state;
                return selectedName && selectedBirthDate && selectedOwner && selectedPetType;
            }

            private handleCreatePet = () => {
                const {selectedBirthDate, selectedOwner, selectedName, selectedPetType} = this.state;
                if(selectedBirthDate && selectedOwner && selectedName && selectedPetType) {
                    API.post_pets(
                        selectedName,
                        selectedBirthDate,
                        selectedOwner.id,
                        selectedPetType.id
                    ).then(
                        (result) => {
                            if(isServerResultFailure(result)) {
                                let reason = "Server error";
                                switch(result.error) {
                                    case IServerErrorStatus.CONFLICT:
                                        reason = "Name exists. Select a different name";
                                        break;
                                    case IServerErrorStatus.BAD_REQUEST:
                                        reason = "Bad request.";
                                        break;
                                    default:
                                        reason = "Server Error";
                                }
                                this.setState(prevState => R.mergeDeepRight(prevState, {petCreationErrorReason: reason}))
                            } else {
                                this.setState(prevState => R.mergeDeepRight(prevState, {isPetCreationSuccessful: true}))
                            }
                        }
                    ).catch(
                        (error) => this.setState(prevState => R.mergeDeepRight(prevState, {petCreationErrorReason: "Server error"}))
                    );
                }
            };

            private handleBackToPets = () => {
                const {history} = this.props;
                history.push("/pets");
            };

            private handleBackToAppointments = () => {
                const {history} = this.props;
                history.push("/appointments");
            };
        }
    )
);
