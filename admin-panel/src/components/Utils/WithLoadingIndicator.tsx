import * as React from 'react';

export interface IWithLoadingIndicatorProps {
    isLoading: boolean,
}

export const withLoadingIndicator = <P extends object>(LoadingIndicatorComponent: React.ComponentType, Component: React.ComponentType<P>) =>
    class WithLoadingIndicator extends React.Component<P & IWithLoadingIndicatorProps> {
        public render() {
            const {isLoading, ...props} = this.props as IWithLoadingIndicatorProps;
            return (
                isLoading ? <LoadingIndicatorComponent/> : <Component {...props}/>
            );
        }
    };


