import * as React from 'react';

export interface IWithErrorIndicatorProps {
    isError: boolean,
}

export const withErrorIndicator = <P extends object>(ErrorComponent: React.ComponentType, Component: React.ComponentType<P>) =>
    class WithErrorIndicator extends React.Component<P & IWithErrorIndicatorProps> {
        public render() {
            const {isError, ...props} = this.props as IWithErrorIndicatorProps;
            return (
                isError ? <ErrorComponent/> : <Component {...props}/>
            );
        }
    };


