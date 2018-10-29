import {Theme, withStyles, WithStyles} from "@material-ui/core/styles";
import {CSSProperties} from "@material-ui/core/styles/withStyles";
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import * as React from 'react';
import {RouteComponentProps, withRouter} from "react-router-dom";
import {checkNever} from "../../common/lib/util";

const styles = (theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        flexGrow: 1,
    } as CSSProperties
});

type routeType = '/appointments' | '/pets' | '/vets';

interface INavBarProps {
    [x:string]: any
}

interface INavBarState {
    currentRoute: routeType
}

// The combined type of the Navigation component's props:
// Start with the type of INavBarProps and add
// 1. RouteComponentProps<{}> which provides 'history' and 'blob' properties and
// 2. WithStyles<'root'> which provides a 'classes' property which contains a 'root' key
// Omitting this type in the anonymous class below doesn't let typescript infer the property type of
// the react component
type INavigationPropsDerived = INavBarProps  & RouteComponentProps<any> & WithStyles<'root'>

export default withStyles(styles)(
    withRouter(
        class Navigation extends React.Component<INavigationPropsDerived, INavBarState> {
            public state: INavBarState = {
                currentRoute: "/appointments"
            };

            public componentWillReceiveProps(nextProps: INavigationPropsDerived) {
                const {location} = nextProps;
                this.handleRoute(location.pathname as routeType);
            }

            public componentDidMount() {
                const {location} = this.props;
                this.handleRoute(location.pathname as routeType);
            }

            public render() {
                const {currentRoute} = this.state;
                return (
                    <div>
                        <Tabs value={'/' + currentRoute.split("/").slice(1, 2)} onChange={this.handleChange}>
                            <Tab label='Appointments' value="/appointments"/>
                            <Tab label='Vets' value="/vets"/>
                            <Tab label='Pets' value="/pets"/>
                        </Tabs>
                    </div>
                );
            }

            private handleChange = (event : React.ChangeEvent<{}>, value: routeType) => {
                this.handleRoute(value, false)
            };

            private handleRoute(route: routeType, skipURLUpdate: boolean = true) {
                this.setState({
                    currentRoute: route
                });
                window.console.log(route);
                if(!skipURLUpdate) {
                    this.pushRoute(route);
                }
            }

            private pushRoute(route: routeType) {
                const {history} = this.props;
                switch(route) {
                    case "/appointments":
                        history.push('/appointments');
                        break;
                    case "/vets":
                        history.push('/vets');
                        break;
                    case "/pets":
                        history.push('/pets');
                        break;
                    default:
                        checkNever(route);
                        break;
                }
            }
        }
    )
);

