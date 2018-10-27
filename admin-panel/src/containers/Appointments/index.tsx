import {Theme} from "@material-ui/core";
import withStyles, {CSSProperties, WithStyles} from "@material-ui/core/styles/withStyles";
import * as React from 'react';
import {connect} from "react-redux";
import {RouteComponentProps, withRouter} from "react-router";
import {Action} from "redux";
import {IAppointmentSummary, IServerOpFailure} from "../../common/types";
import {IConnectedReduxProps, IRootState} from "../../store";
import {
    appointmentsList,
    getAppointmentsListServerError,
    isGetAppointmentsListInProgress
} from "../../store/appointments/reducer";

import Grid from "@material-ui/core/Grid/Grid";
// import Paper from "@material-ui/core/Paper/Paper";
import SearchBasedEntitySelector from "../../components/SearchBasedEntitySelector";


const styles = (theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        flexGrow: 1,
        margin: '10px',
    } as CSSProperties,
});

const mapStateToProps = (rootState: IRootState) => ({
    appointments: appointmentsList(rootState),
    isAppointmentsDownloadInProgress: isGetAppointmentsListInProgress(rootState),
    serverError: getAppointmentsListServerError(rootState)
});

interface IAppointmentsProps {
    isAppointmentsDownloadInProgress: boolean,
    appointments: [IAppointmentSummary],
    serverError: IServerOpFailure
}

type IAppointmentsPropsDerived = IAppointmentsProps & IConnectedReduxProps<Action<any>> & RouteComponentProps<any> & WithStyles<'root'>;

export default withStyles(styles)(
    withRouter(
        connect(mapStateToProps)(
            class Appointments extends React.Component<IAppointmentsPropsDerived> {
                public render() {
                    const {classes} = this.props;
                    return (
                        <div className={classes.root}>
                            <Grid container={true} spacing={8}>
                                <Grid container={true} spacing={8}>
                                    <Grid item={true} xs={4}>
                                        <SearchBasedEntitySelector searchLabel="Vet name..." searchResultItems={[{}, {"2": 2}]}/>
                                    </Grid>
                                    <Grid item={true} xs={4}>
                                        <p>Calendar goes here</p>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </div>
                    )
                }
            }
        )
    )
);
