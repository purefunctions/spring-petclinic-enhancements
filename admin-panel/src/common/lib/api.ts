import axios, {AxiosError, AxiosResponse} from 'axios'
import {IAppointmentSummary, IServerErrorStatus, IServerGetOp, IServerOpFailure, IServerOpResult} from "../types";
import {SERVICE_ENDPOINT} from "./config";

const APPOINTMENTS_ROUTE = [SERVICE_ENDPOINT, "appointments"].join("/");
// const VETS_ROUTE = [SERVICE_ENDPOINT, "vets"].join("/");
// const PETS_ROUTE = [SERVICE_ENDPOINT, "pets"].join("/");
// const OWNERS_ROUTE = [SERVICE_ENDPOINT, "owners"].join("/");
// const AVAILABILITIES_ROUTE = [SERVICE_ENDPOINT, "availabilities"].join("/");


export async function get_appointments(
    date?: Date,
    vetId?: number,
    petId?: number
): Promise<IServerOpResult<IServerGetOp, IAppointmentSummary[]>>{
    try {
        const response: AxiosResponse = await axios.get(
            APPOINTMENTS_ROUTE, {
                params: {
                    date: date ? date: null,
                    petId: petId ? petId: null,
                    vetId: vetId ? vetId: null
                }
            }
        );
        return {value: response.data};
    } catch (error) {
        return toRequestFailure(error);
    }
}

function toRequestFailure(error: AxiosError): IServerOpFailure {
    if (error.response) {
        const data = error.response.data;
        switch(error.response.status) {
            case 400:
                return {error: IServerErrorStatus.BAD_REQUEST, message: data};
            case 404:
                return {error: IServerErrorStatus.RESOURCE_NOT_FOUND, message: data};
            case 500:
                return {error: IServerErrorStatus.SERVER_ERROR, message: data};
            default:
                return {error: IServerErrorStatus.UNKNOWN_ERROR};
        }
    } else {
        return {error: IServerErrorStatus.NETWORK_ERROR};
    }
}
