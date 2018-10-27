// import {Theme, WithStyles} from "@material-ui/core";
// import withStyles, {CSSProperties} from "@material-ui/core/styles/withStyles";
// import * as React from 'react';
// import * as API from '../../common/lib/api';
// import {IVetSummary} from "../../common/types";
// import SearchBasedEntitySelector from "../SearchBasedEntitySelector";
//
// const styles = (theme: Theme) => ({
//     root: {
//         backgroundColor: theme.palette.background.paper,
//         flexGrow: 1,
//         margin: '10px',
//         textAlign: 'center'
//     } as CSSProperties,
// });
//
// interface IVetSearchAndSelectProps {
//     onVetSelected: (vet: IVetSummary) => any,
//     onVetUnselected: () => any
// }
//
// type IVetSearchAndSelectPropsDerived = IVetSearchAndSelectProps & WithStyles<'root'>
//
// export default withStyles(styles)(
//     class VetSearchAndSelect extends React.Component<IVetSearchAndSelectPropsDerived> {
//         public static defaultProps = {
//             onVetSelected: (_: IVetSummary) => undefined,
//             onVetUnselected: () => undefined
//         };
//
//         public render () {
//             const {} = this.props;
//             return <SearchBasedEntitySelector searchLabel="Vet name"
//                                               onSearchSubmit={API.get_vets_summarized} onUnSelected/>;
//         }
//     }
// );
