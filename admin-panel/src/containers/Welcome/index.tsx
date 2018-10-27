import {Theme} from "@material-ui/core";
import withStyles, {CSSProperties, WithStyles} from "@material-ui/core/styles/withStyles";
import * as React from 'react';
import {RouteComponentProps, withRouter} from "react-router";
import {Link} from "react-router-dom";

const styles = (theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        flexGrow: 1,
        margin: '10px',
        textAlign: 'center'
    } as CSSProperties,
});

type IWelcomePropsDerived = WithStyles<'root'> & {} & RouteComponentProps<any>;

export default withStyles(styles)(
    withRouter(
    class Welcome extends React.Component<IWelcomePropsDerived> {
        public render() {
            return (
                <div>
                    <p>Welcome</p>
                    <Link to="/appointments">Appointments</Link>
                    <br/>
                    <Link to="/appointments/new">New Appointment</Link>
                    <br/>
                    <Link to="/vets">Vets</Link>
                    <br/>
                    <Link to="/vets/new">New Vet</Link>
                    <br/>
                    <Link to="/pets">Pets</Link>
                    <br/>
                    <Link to="/pets/new">New Pet</Link>
                </div>
            )
        }
    }
));
