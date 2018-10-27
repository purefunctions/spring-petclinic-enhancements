import * as React from 'react';

interface IWithLoadingIndicator {
    isLoading: boolean,
}

export const withLoadingIndicator = <P extends object>(LoadingIndicatorComponent: React.ComponentType, Component: React.ComponentType<P>) =>
    class WithLoadingIndicator extends React.Component<P & IWithLoadingIndicator> {
        public render() {
            const {isLoading, ...props} = this.props as IWithLoadingIndicator;
            return (
                isLoading ? <LoadingIndicatorComponent/> : <Component {...props}/>
            );
        }
    };


