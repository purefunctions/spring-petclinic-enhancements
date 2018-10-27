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

interface ICreateVetProps {
    dummy: any
}

type ICreateVetsPropsDerived = ICreateVetProps & RouteComponentProps<any> & WithStyles<'root'>;

export default withStyles(styles)(
    withRouter(
        class Vets extends React.Component<ICreateVetsPropsDerived> {
            public render() {
                return (
                    <div className="root">
                        <p>The vet creation component</p>
                    </div>
                )
            }
        }
    )
);
