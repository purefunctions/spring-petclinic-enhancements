import {Theme} from "@material-ui/core";
import withStyles, {CSSProperties, WithStyles} from "@material-ui/core/styles/withStyles";
import * as R from 'ramda';
import * as React from 'react';
import * as API from "../../common/lib/util";
import {IServerGetOp, IServerOpResult} from "../../common/types";
import SearchBar from "../SearchBar"
import SelectableList, {ISelectableListProps} from "../SelectableList"
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


interface ISearchBasedEntitySelectorProps<T> {
    searchLabel: string,
    onSearchSubmit: (text: string) => Promise<IServerOpResult<IServerGetOp, T[]>>,
    onSelected: (item: T) => any,
    onUnSelected: () => any,
    stringify: (item: T) => string
}

interface ISearchBasedEntitySelectorState<T> {
    isSearching: boolean,
    isError: boolean,
    searchResultItems: T[],
}

type ISearchBasedEntitySelectorPropsDerived<T> = ISearchBasedEntitySelectorProps<T> & WithStyles<'root'>;

export default withStyles(styles)(
    class SearchBasedEntitySelector<T> extends React.Component<ISearchBasedEntitySelectorPropsDerived<T>, ISearchBasedEntitySelectorState<T>> {
        public static defaultProps= SearchBasedEntitySelector.getDefaultProps();
        private static getDefaultProps<T>() : ISearchBasedEntitySelectorProps<T> {
            return {
                onSearchSubmit: async (_: string) => ({value: []}),
                onSelected: (_: T) => undefined,
                onUnSelected: () => undefined,
                searchLabel: "Query",
                stringify: (item:T) => JSON.stringify(item)
            }
        }

        public state: ISearchBasedEntitySelectorState<T> = {
            isError: false,
            isSearching: false,
            searchResultItems: []
        };

        // TODO: figure out a way to not make any the type parameter
        private SelectableListWithIndicators: React.ComponentType<any> = withEmptyListIndicator<ISelectableListProps<T>, T>(emptyListIndicatorComponent,
            withLoadingIndicator(loadingIndicatorComponent,
                withErrorIndicator(
                    errorIndicatorComponent,
                    (props) => <SelectableList {...props}/>
                )));


        public render() {
            const {searchLabel, classes, stringify, onUnSelected, onSelected} = this.props;
            const {isError, isSearching, searchResultItems} = this.state;
            return(
                    <div className={classes.root}>
                        <SearchBar label={searchLabel} onSubmit={this.handleSearchSubmit} />
                        <this.SelectableListWithIndicators listItems={searchResultItems}
                                                           isLoading={isSearching}
                                                           isError={isError}
                                                           onSelected={onSelected}
                                                           onUnselected={onUnSelected}
                                                           stringify={stringify}/>
                    </div>
            )
        }

        private handleSearchSubmit = (text: string) => {
            const {onSearchSubmit} = this.props;
            this.setState((prevState) => R.mergeDeepRight(prevState, {isSearching: true, searchResultItems: [], isError: false}));
            const result = onSearchSubmit(text);
            result.then(
                (value) => {
                    if (API.isServerResultFailure(value)) {
                        this.setState((prevState) => R.mergeDeepRight(prevState, {isSearching: false, searchResultItems: [], isError: true}));
                    } else {
                        this.setState((prevState) => R.mergeDeepRight(prevState, {isSearching: false, searchResultItems: value.value, isError: false}));
                    }
                }
            ).catch(
                () =>
                    this.setState((prevState) => R.mergeDeepRight(prevState, {isSearching: false, searchResultItems: [], isError: true}))
            );
        };
    }
);


