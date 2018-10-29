export interface IOwner {
    id: number,
    firstName: string,
    lastName: string,
    telephone: string
    address:string,
    city: string,
}

export interface IVet {
    id: number,
    firstName: string,
    lastName: string,
    specialties: ISpecialty[]
}

export interface IPet {
    id: number,
    name: string,
    birthDate: Date,
    type: IPetType,
    owner: IOwner
}

export interface ISpecialty {
    id: number,
    name: string
}

export interface IPetType {
    id: number,
    name: string
}

export interface IAppointment {
    id: number,
    pet: IPet,
    vet: IVet,
    startTime: Date
    endTime: Date
}

export interface IServerOp {
    serverOp: never
}

export interface IServerGetOp extends IServerOp {
    getOp: never
}

export interface IServerPostOp extends IServerOp {
    postOp: never
}

export interface IServerDeleteOp extends IServerOp {
    deleteOp: never
}

export interface IServerOpSuccess<Op extends IServerOp, ReturnValueType> {
    value: ReturnValueType
}

export type IServerOpResult<Op extends IServerOp, T> = IServerOpSuccess<Op, T> | IServerOpFailure;

export interface IServerOpFailure {
    error: IServerErrorStatus,
    message?: string
}

export enum IServerErrorStatus {
    RESOURCE_NOT_FOUND,
    BAD_REQUEST,
    CONFLICT,
    SERVER_ERROR,
    UNKNOWN_ERROR,
    NETWORK_ERROR
}

