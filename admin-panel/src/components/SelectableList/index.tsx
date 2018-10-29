import {Theme, WithStyles} from "@material-ui/core";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import withStyles from "@material-ui/core/styles/withStyles";
import * as R from 'ramda';
import * as React from 'react';

const styles = (theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        flexGrow: 1,
        maxHeight: 400,
        overflow: 'auto'
    },
});

export interface ISelectableListProps<T> {
    listItems: T[],
    onSelected: (item: T) => any,
    onUnselected: () => any,
    stringify: (item: T) => string
}

interface ISelectableListState<T> {
    cachedListItems: T[],
    selectedIndex: number
}

type ISelectableListPropsDerived<T> = ISelectableListProps<T> & WithStyles<'root'>;

export default withStyles(styles)(
    class SelectableList<T> extends React.Component<ISelectableListPropsDerived<T>, ISelectableListState<T>> {
        public static defaultProps = SelectableList.generateDefaultProps();

        public static getDerivedStateFromProps<T>(nextProps: ISelectableListProps<T>, prevState: ISelectableListState<T>) {
            window.console.log("in getDerivedStateFromProps");
            window.console.log(nextProps);
            window.console.log(prevState);
            if(nextProps.listItems.length !== prevState.cachedListItems.length) {
                nextProps.onUnselected();
                return {selectedIndex: -1, cachedListItems: nextProps.listItems}
            } else {
                return {selectedIndex: prevState.selectedIndex, cachedListItems: nextProps.listItems};
            }
        }

        private static generateDefaultProps<T>(): ISelectableListProps<T> {
            return {
                listItems: [],
                onSelected: (_: T) => null,
                onUnselected: () => null,
                stringify: (item: T) => JSON.stringify(item)
            }
        }

        public state: Readonly<ISelectableListState<T>> = {
            cachedListItems: [],
            selectedIndex: -1
        };

        public render() {
            const {classes, listItems, stringify} = this.props;
            const {selectedIndex} = this.state;
            window.console.log(`selectedIndex: ${selectedIndex}`);
            return(
                <div className={classes.root}>
                    <List component='nav'>
                        {
                            listItems.map((item, index) => {
                                    return <ListItem button={true} selected={selectedIndex === index} key={`${index}`} onClick={this.handleOnClick(index)}>
                                        <ListItemText primary={stringify(item)}/>
                                    </ListItem>
                            }
                            )
                        }
                    </List>
                </div>
            )
        }

        private handleOnClick = (selectedIndex: number) => (_: any) => {
            this.setState(
                (prevState: ISelectableListState<T>, props: ISelectableListPropsDerived<T>) => {
                    const {onSelected, onUnselected, listItems} = this.props;
                    const prevIndex = prevState.selectedIndex;
                    if (prevIndex === selectedIndex) {
                        onUnselected();
                        return R.mergeDeepRight(prevState, {selectedIndex: -1});
                    }
                    if (selectedIndex >= 0) {
                        window.console.log(`calling onSelected with index ${selectedIndex} listItems.length ${listItems.length}`);
                        onSelected(listItems[selectedIndex]);
                    }
                    return R.mergeDeepRight(prevState, {selectedIndex});
                }
            )
        };
    }
)
