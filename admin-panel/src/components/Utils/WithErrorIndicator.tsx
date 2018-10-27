import * as React from 'react';

interface IWithErrorIndicator {
    isError: boolean,
}

export const withErrorIndicator = <P extends object>(ErrorComponent: React.ComponentType, Component: React.ComponentType<P>) =>
    class WithErrorIndicator extends React.Component<P & IWithErrorIndicator> {
        public render() {
            const {isError, ...props} = this.props as IWithErrorIndicator;
            return (
                isError ? <ErrorComponent/> : <Component {...props}/>
            );
        }
    };


