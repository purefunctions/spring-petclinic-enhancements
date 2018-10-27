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

interface ICreateVetsProps {
    dummy: any
}

type IVetsPropsDerived = ICreateVetsProps & RouteComponentProps<any> & WithStyles<'root'>;

export default withStyles(styles)(
    withRouter(
        class Vets extends React.Component<IVetsPropsDerived> {
            public render() {
                return (
                    <div className="root">
                        <p>The vets component</p>
                    </div>
                )
            }
        }
    )
);
