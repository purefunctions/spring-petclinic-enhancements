import {Theme} from "@material-ui/core";
import withStyles, {CSSProperties, WithStyles} from "@material-ui/core/styles/withStyles";
import * as React from 'react';
import {RouteComponentProps, withRouter} from "react-router";
import {IAppointmentSummary} from "../../common/types";

const styles = (theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        flexGrow: 1,
        margin: '10px',
        textAlign: 'center'
    } as CSSProperties,
});

interface IAppointmentsProps {
    isAppointmentsDownloadInProgress: boolean,
    appointments: [IAppointmentSummary]
}

type IAppointmentsPropsDerived = IAppointmentsProps & RouteComponentProps<any> & WithStyles<'root'>;

export default withStyles(styles)(
    withRouter(
        class Appointments extends React.Component<IAppointmentsPropsDerived> {

        }
    )
);
