import * as React from 'react';

interface IWithEmptyListIndicatorProps<T> {
    listItems: T[]
}

export const withEmptyListIndicator = <P extends object, T>(EmptyListComponent: React.ComponentType, Component: React.ComponentType<P>) =>
    class WithEmptyListIndicator extends React.Component<P & IWithEmptyListIndicatorProps<T>> {
        public render() {
            const {listItems} = this.props as IWithEmptyListIndicatorProps<T>;
            return (
                listItems.length > 0 ? <Component {...this.props}/> : <EmptyListComponent/>
            );
        }
    };


