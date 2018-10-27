import {Theme} from "@material-ui/core";
import withStyles, {CSSProperties, WithStyles} from "@material-ui/core/styles/withStyles";
import * as React from 'react';
import SearchBar from "../SearchBar"
import SelectableList from "../SelectableList"
import {withEmptyListIndicator} from "../Utils/WithEmptyListIndicator";
import {withErrorIndicator} from "../Utils/WithErrorIndicator";
import {withLoadingIndicator} from "../Utils/WithLoadingIndicator";

const styles = (theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        flexGrow: 1,
        margin: '10px',
    } as CSSProperties,
});
const emptyListIndicatorComponent : React.ComponentType = (props) => <p>"Empty"</p>;
const errorIndicatorComponent : React.ComponentType = (props) => <p>"Error"</p>;
const loadingIndicatorComponent : React.ComponentType = (props) => <p>"Loading..."</p>;

const SelectableListWithIndicators = withEmptyListIndicator(emptyListIndicatorComponent,
    withLoadingIndicator(loadingIndicatorComponent,
        withErrorIndicator(
            errorIndicatorComponent,
            (props) => <SelectableList {...props}/>
        )));

interface ISearchBasedEntitySelectorProps<T> {
    isSearching: boolean,
    isError: boolean,
    searchLabel: string,
    onSearchSubmit: (text: string) => any,
    searchResultItems: T[],
    onSelected: (item: T) => any,
    onUnSelected: () => any,
    stringify: (item: T) => string
}

type ISearchBasedEntitySelectorPropsDevired<T> = ISearchBasedEntitySelectorProps<T> & WithStyles<'root'>;

export default withStyles(styles)(
    class SearchBasedEntitySelector<T> extends React.Component<ISearchBasedEntitySelectorPropsDevired<T>> {
        public static defaultProps= SearchBasedEntitySelector.getDefaultProps();

        private static getDefaultProps<T>() : ISearchBasedEntitySelectorProps<T> {
            return {
                isError: false,
                isSearching: false,
                onSearchSubmit: (_: string) => null,
                onSelected: (item: T) => null,
                onUnSelected: () => null,
                searchLabel: "Query",
                searchResultItems: [],
                stringify: (item:T) => JSON.stringify(item)
            }
        }

        public render() {
            const {searchLabel, isSearching, isError, searchResultItems, classes} = this.props;
            return(
                    <div className={classes.root}>
                        <SearchBar label={searchLabel}/>
                        <SelectableListWithIndicators listItems={searchResultItems} isLoading={isSearching} isError={isError}/>
                    </div>
            )
        }
    }
);


