import {Theme, WithStyles} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton/IconButton";
import withStyles, {CSSProperties} from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField/TextField";
import SearchIcon from "@material-ui/icons/Search";
import * as R from 'ramda';
import * as React from 'react';

const styles = (theme: Theme) => ({
    button: {
        margin: theme.spacing.unit,
    },
    container: {
        margin: "12px"
    } as CSSProperties,  // Without the explicit coercing, typescript complains,
    form: {
        display: 'flex',
        flexWrap: 'wrap',
    } as CSSProperties,
    progress: {
        margin: theme.spacing.unit * 2
    },
    root: {
        backgroundColor: theme.palette.background.paper,
        flexGrow: 1,
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
});


interface ISearchBarState {
    text: string,
    errorMessage?: string
}

interface ISearchBarProps {
    label?: string,
    onSubmit: (text: string) => any,
}

type ISearchBarPropsDerived = ISearchBarProps & WithStyles<'button' | 'container' | 'form' | 'progress' | 'root' | 'textField'>;

export default withStyles(styles)(
    class SearchBar extends React.Component<ISearchBarPropsDerived, ISearchBarState> {
        public static defaultProps: ISearchBarProps = {
            label: "Query",
            onSubmit: (_: string) => null,
        };

        public state: Readonly<ISearchBarState> = {
            errorMessage: undefined,
            text: "",
        };

        public render() {
            const {text} = this.state;
            const {classes, label} = this.props;
            return <div className={classes.container}>
                <form noValidate={true} autoComplete='off'>
                    <div>
                        <TextField
                            id="searchBarId"
                            label={label ? label : SearchBar.defaultProps.label}
                            className={classes.textField}
                            value={text}
                            margin='normal'
                            onChange={this.handleTextChange}
                        />
                        <IconButton className={classes.button} aria-label="searchText" onClick={this.handleSearchClick}>
                            <SearchIcon/>
                        </IconButton>
                    </div>
                </form>
            </div>
        }

        private handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const {value} = event.target;
            this.setState(
                (prevState: ISearchBarState) => R.mergeDeepRight(prevState, {text: value})
            )
        };

        private handleSearchClick = () => {
            const {onSubmit} = this.props;
            const {text} = this.state;
            if(onSubmit) {onSubmit(text)}
        }
    }
)
