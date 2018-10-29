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
import * as R from "ramda";
import * as React from 'react';
import {RouteComponentProps, withRouter} from "react-router";
import * as API from "../../common/lib/api";
import {
    isServerResultFailure,
    vetSpecialtyToSummaryString,
} from "../../common/lib/util";
import {IServerErrorStatus, ISpecialty} from "../../common/types";
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

interface ICreateVetProps {
    [x: string]: any
}

interface ICreateVetState {
    isVetCreationSuccessful: boolean,
    selectedFirstName: string,
    selectedLastName: string,
    selectedSpecialty?: ISpecialty,
    vetCreationErrorReason: string
}

type ICreateVetsPropsDerived = ICreateVetProps & RouteComponentProps<any> & WithStyles<'root' | 'button' | 'list'>;

export default withStyles(styles)(
    withRouter(
        class Vets extends React.Component<ICreateVetsPropsDerived, ICreateVetState> {
            public state: ICreateVetState = {
                isVetCreationSuccessful: false,
                selectedFirstName: "",
                selectedLastName: "",
                selectedSpecialty: undefined,
                vetCreationErrorReason: ""
            };

            public render() {
                const {classes} = this.props;
                const {isVetCreationSuccessful, selectedFirstName, selectedLastName, vetCreationErrorReason} = this.state;
                return (
                    <div className={classes.root}>
                        <Grid container={true} spacing={8}>
                            <Grid container={true} spacing={8}>
                                <Grid item={true} xs={4}>
                                    <Typography variant='overline'>Select Initial Specialty</Typography>
                                    <SearchBasedEntitySelector searchLabel="Specialty name"
                                                               onSearchSubmit={API.get_vet_specialties}
                                                               stringify={vetSpecialtyToSummaryString}
                                                               onSelected={this.handleSpecialtySelected}
                                                               onUnSelected={this.handleSpecialtyUnselected}/>
                                </Grid>
                                <Grid item={true} xs={4}>
                                    <div>
                                        <TextField label="First Name" required={true} error={!selectedFirstName} onChange={this.onFirstNameChange}/>
                                    </div>
                                    <div>
                                        <TextField label="Last Name" required={true} error={!selectedLastName} onChange={this.onLastNameChange}/>
                                    </div>
                                </Grid>
                                <Grid item={true} xs={3}>
                                    <Button disabled={!this.isVetCreationParamsValid()}
                                            className={classes.button} color="primary" variant="outlined"
                                            onClick={this.handleCreateVet}>Create</Button>
                                    <Typography variant='overline' color='error'>
                                        {vetCreationErrorReason}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Dialog open={isVetCreationSuccessful}>
                            <DialogContent>
                                <DialogContentText>
                                    Vet created!
                                </DialogContentText>
                                <DialogActions>
                                    <div className={classes.root}>
                                        <Button variant='outlined' color='primary' onClick={this.handleBackToVets}>
                                            Back to Vets
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

            private handleSpecialtySelected = (specialty: ISpecialty) => {
                this.setState(
                    (prevState: ICreateVetState) => R.mergeDeepRight(
                        prevState,
                        {selectedSpecialty: specialty}
                    )
                )
            };

            private handleSpecialtyUnselected = () => {
                this.setState(
                    (prevState: ICreateVetState) => R.mergeDeepRight(
                        prevState,
                        {selectedSpecialty: undefined}
                    )
                )
            };

            private onFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                const {value} = event.target;
                this.setState(
                    prevState => R.mergeDeepRight(prevState, {selectedFirstName: value.trim()})
                )
            };

            private onLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                const {value} = event.target;
                this.setState(
                    prevState => R.mergeDeepRight(prevState, {selectedLastName: value.trim()})
                )
            };

            private isVetCreationParamsValid = () => {
                const {selectedSpecialty, selectedLastName, selectedFirstName} = this.state;
                return selectedSpecialty && selectedFirstName && selectedLastName;
            };

            private handleCreateVet = () => {
                const {selectedFirstName, selectedLastName, selectedSpecialty} = this.state;
                if(selectedFirstName && selectedLastName && selectedSpecialty) {
                    API.post_vets(
                        selectedFirstName, selectedLastName, [selectedSpecialty.id]
                    ).then(
                        (result) => {
                            if(isServerResultFailure(result)) {
                                let reason = "Server error";
                                switch(result.error) {
                                    case IServerErrorStatus.BAD_REQUEST:
                                        reason = "Bad request.";
                                        break;
                                    default:
                                        reason = "Server Error";
                                }
                                this.setState(prevState => R.mergeDeepRight(prevState, {vetCreationErrorReason: reason}))
                            } else {
                                this.setState(prevState => R.mergeDeepRight(prevState, {isVetCreationSuccessful: true}))
                            }
                        }
                    ).catch(
                        (error) => this.setState(prevState => R.mergeDeepRight(prevState, {vetCreationErrorReason: "Server error"}))
                    );
                }
            };

            private handleBackToVets = () => {
                const {history} = this.props;
                history.push("/vets");
            };

            private handleBackToAppointments = () => {
                const {history} = this.props;
                history.push("/appointments");
            };
        }
    )
);
