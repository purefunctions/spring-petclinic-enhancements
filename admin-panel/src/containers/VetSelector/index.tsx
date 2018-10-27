import * as React from 'react';
import {IVetSummary} from "../../common/types";
import SearchBasedEntitySelector from "../../components/SearchBasedEntitySelector";

interface IVetSelectorProps {
    onVetSelected: (vetSummary: IVetSummary) => any,
    onVetUnselected: () => any,
}

interface IVetSelectorState {
    isLoading: boolean,
    isError: boolean,
    listItems: IVetSummary[]
}

export default class VetSelector extends React.Component<IVetSelectorProps> {
    public static defaultProps: IVetSelectorProps = {
        onVetSelected: () => null,
        onVetUnselected: () => null
    };

    public state: Readonly<IVetSelectorState> = {
        isError: false,
        isLoading: false,
        listItems: []
    };

    public render() {
        const {onVetSelected, onVetUnselected} = this.props;
        const {listItems, isError, isLoading} = this.state
        return(
            <SearchBasedEntitySelector searchResultItems={listItems}
                                       isError={isError}
                                       isSearching={isLoading}
                                       onSearchSubmit={this.handleSearchSubmit}
                                       onSelected={onVetSelected}
                                       onUnSelected={onVetUnselected}/>
        )
    }

    private handleSearchSubmit = (_: string) => {
        return null
    }
}
