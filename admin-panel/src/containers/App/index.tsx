import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

// global styles for entire app
import * as React from 'react';
import {Redirect, Route, Switch} from "react-router";
import {HashRouter} from "react-router-dom";
import Navigation from "../../components/Navigation";
import WelcomeView from "../../containers/Welcome";

const appTheme = createMuiTheme({});

// Because we are decorating our LoginView component with, redux props (which gives dispatch property)
// the end type of the props for our component is a typescript intersection type
// that contains ILoginViewProps (our base props for App) and IConnectedReducProps which gives us 'dispatch' property

export default class App extends React.Component<{}> {
    public render() {
        return this.mainApp();
    };

    private mainApp() {
        return (
            <React.Fragment>
                <CssBaseline/>
                <MuiThemeProvider theme={appTheme}>
                    <div>
                        <HashRouter>
                            <div className="container">
                                <header>
                                    <AppBar position='static' color='primary'>
                                        <Toolbar>
                                            <Typography variant='title' color='inherit'>
                                                Pet Clinic - Admins
                                            </Typography>
                                        </Toolbar>
                                    </AppBar>
                                    <Navigation/>
                                </header>
                                <div>
                                    <Switch>
                                        <Route path="/welcome" component={WelcomeView}/>
                                        <Redirect from="/" to="/welcome"/>
                                    </Switch>
                                </div>
                            </div>
                        </HashRouter>
                    </div>
                </MuiThemeProvider>
            </React.Fragment>
        );
    }
}
