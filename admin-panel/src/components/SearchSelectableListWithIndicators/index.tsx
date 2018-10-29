import {Theme} from "@material-ui/core";
import withStyles, {CSSProperties, WithStyles} from "@material-ui/core/styles/withStyles";
import * as R from 'ramda';
import * as React from 'react';
import * as API from "../../common/lib/util";
import {IServerGetOp, IServerOpResult} from "../../common/types";
import SearchBar from "../SearchBar"
import SelectableListWithIndicators from "../SelectableListWithIndicators"

const styles = (theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        flexGrow: 1,
        margin: '10px',
    } as CSSProperties,
});

interface ISearchSelectableListWithIndicatorsProps<T> {
    searchLabel: string,
    onSearchSubmit: (text: string) => Promise<IServerOpResult<IServerGetOp, T[]>>,
    onSelected: (item: T) => any,
    onUnSelected: () => any,
    stringify: (item: T) => string
}

interface ISearchSelectableListWithIndicatorsState<T> {
    isSearching: boolean,
    isError: boolean,
    searchResultItems: T[],
}

type ISearchSelectableListWithIndicatorsPropsDerived<T> = ISearchSelectableListWithIndicatorsProps<T> & WithStyles<'root'>;

export default withStyles(styles)(
    class SearchSelectableListWithIndicators<T> extends React.Component<ISearchSelectableListWithIndicatorsPropsDerived<T>, ISearchSelectableListWithIndicatorsState<T>> {
        public static defaultProps= SearchSelectableListWithIndicators.getDefaultProps();
        private static getDefaultProps<T>() : ISearchSelectableListWithIndicatorsProps<T> {
            return {
                onSearchSubmit: async (_: string) => ({value: []}),
                onSelected: (_: T) => undefined,
                onUnSelected: () => undefined,
                searchLabel: "Query",
                stringify: (item:T) => JSON.stringify(item)
            }
        }

        public state: ISearchSelectableListWithIndicatorsState<T> = {
            isError: false,
            isSearching: false,
            searchResultItems: []
        };

        public render() {
            const {searchLabel, classes, stringify, onUnSelected, onSelected} = this.props;
            const {isError, isSearching, searchResultItems} = this.state;
            return(
                    <div className={classes.root}>
                        <SearchBar label={searchLabel} onSubmit={this.handleSearchSubmit} />
                        <SelectableListWithIndicators listItems={searchResultItems}
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


