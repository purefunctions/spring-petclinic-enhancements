import {Theme} from "@material-ui/core";
import Button from "@material-ui/core/Button/Button";
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

interface IPetsProps {
    dummy: any
}

type IPetsPropsDerived = IPetsProps & RouteComponentProps<any> & WithStyles<'root'>;

export default withStyles(styles)(
    withRouter(
        class Vets extends React.Component<IPetsPropsDerived> {
            public render() {
                return (
                    <div className="root">
                        <Button variant='outlined' color='primary' onClick={this.handleCreatePet}>
                            Create Pet
                        </Button>
                    </div>
                )
            }

            private handleCreatePet = () => {
                const {history} = this.props;
                history.push("/pets/new");
            }
        }
    )
);
