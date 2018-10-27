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

interface ISelectableListState {
    selectedIndex: number
}

type ISelectableListPropsDerived<T> = ISelectableListProps<T> & WithStyles<'root'>;

export default withStyles(styles)(
    class SelectableList<T> extends React.Component<ISelectableListPropsDerived<T>, ISelectableListState> {
        public static defaultProps = SelectableList.generateDefaultProps();

        private static generateDefaultProps<T>(): ISelectableListProps<T> {
            return {
                listItems: [],
                onSelected: (_: T) => null,
                onUnselected: () => null,
                stringify: (item: T) => JSON.stringify(item)
            }
        }

        public state: Readonly<ISelectableListState> = {
            selectedIndex: -1
        };

        public render() {
            const {classes, listItems, stringify} = this.props;
            const {selectedIndex} = this.state;
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
                (prevState: ISelectableListState, props: ISelectableListPropsDerived<T>) => {
                    const {onSelected, onUnselected, listItems} = this.props;
                    const prevIndex = prevState.selectedIndex;
                    if (prevIndex === selectedIndex) {
                        onUnselected();
                        return R.mergeDeepRight(prevState, {selectedIndex: -1});
                    }
                    onSelected(listItems[selectedIndex]);
                    return R.mergeDeepRight(prevState, {selectedIndex});
                }
            )
        };
    }
)
