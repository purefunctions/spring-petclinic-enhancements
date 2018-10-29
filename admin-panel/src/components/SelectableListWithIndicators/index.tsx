import {Theme} from "@material-ui/core";
import withStyles, {CSSProperties, WithStyles} from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography/Typography";
import * as React from 'react';
import SelectableList, {ISelectableListProps} from "../SelectableList"
import {IWithEmptyListIndicatorProps, withEmptyListIndicator} from "../Utils/WithEmptyListIndicator";
import {IWithErrorIndicatorProps, withErrorIndicator} from "../Utils/WithErrorIndicator";
import {IWithLoadingIndicatorProps, withLoadingIndicator} from "../Utils/WithLoadingIndicator";

const styles = (theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        flexGrow: 1,
        margin: '10px',
    } as CSSProperties,
});

const emptyListIndicatorComponent : React.ComponentType = (props) =>
    <div>
        <Typography align='left'>
            No results
        </Typography>
    </div>;
const errorIndicatorComponent : React.ComponentType = (props) =>
    <div>
        <Typography align='left' color='error'>
            Error loading items
        </Typography>
    </div>;
const loadingIndicatorComponent : React.ComponentType = (props) =>
    <div>
        <Typography align='left'>
            Loading...
        </Typography>
    </div>;


interface ISearchBasedEntitySelectorProps<T> {
    listItems: T[],
    onSelected: (item: T) => any,
    onUnSelected: () => any,
    stringify: (item: T) => string
}

type ISearchBasedEntitySelectorPropsDerived<T> =
    ISearchBasedEntitySelectorProps<T>
    & IWithEmptyListIndicatorProps<T>
    & IWithLoadingIndicatorProps
    & IWithErrorIndicatorProps
    & ISelectableListProps<T>
    & WithStyles<'root'>;

export default withStyles(styles)(
    class SearchBasedEntitySelector<T> extends React.Component<ISearchBasedEntitySelectorPropsDerived<T>> {
        public static defaultProps= SearchBasedEntitySelector.getDefaultProps();
        private static getDefaultProps<T>() : ISearchBasedEntitySelectorProps<T> {
            return {
                listItems: [],
                onSelected: (_: T) => undefined,
                onUnSelected: () => undefined,
                stringify: (item:T) => JSON.stringify(item)
            }
        }

        // TODO: figure out a way to not make any the type parameter
        private SelectableListWithIndicatorsHelper: React.ComponentType<any> = withEmptyListIndicator<ISelectableListProps<T>, T>(emptyListIndicatorComponent,
            withLoadingIndicator(loadingIndicatorComponent,
                withErrorIndicator(
                    errorIndicatorComponent,
                    (props) => <SelectableList {...props}/>
                )));


        public render() {
            return(
                <this.SelectableListWithIndicatorsHelper {...this.props}/>
            )
        }
    }
);

