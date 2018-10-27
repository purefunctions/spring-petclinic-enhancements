import {Theme} from "@material-ui/core";
import withStyles, {CSSProperties, WithStyles} from "@material-ui/core/styles/withStyles";
import * as React from 'react';
import {RouteComponentProps, withRouter} from "react-router";

const styles = (theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        flexGrow: 1,
        margin: '10px',
        textAlign: 'center'
    } as CSSProperties,
});

interface ICreateAppointmentProps {
    dummy: any
}

type ICreateAppointmentPropsDerived = ICreateAppointmentProps & RouteComponentProps<any> & WithStyles<'root'>;

export default withStyles(styles)(
    withRouter(
        class CreateAppointment extends React.Component<ICreateAppointmentPropsDerived> {
            public render() {
                const {classes} = this.props;
                return (
                    <div className={classes.root}>
                        <p>The appointments creation component</p>
                    </div>
                )
            }
        }
    )
);
