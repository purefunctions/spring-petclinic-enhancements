import {IServerOp, IServerOpFailure, IServerOpResult} from "../types";

export function checkNever(_: never): void {
    return;
}

export function isServerResultFailure<Op extends IServerOp, T> (result: IServerOpResult<Op, T>): result is IServerOpFailure {
    return ((result as IServerOpFailure).error !== undefined);
}
