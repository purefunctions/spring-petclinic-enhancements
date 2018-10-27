import axios, {AxiosError, AxiosResponse} from 'axios'
import {
    IAppointment, IPet,
    IServerErrorStatus,
    IServerGetOp,
    IServerOpFailure,
    IServerOpResult,
    IVet
} from "../types";
import {SERVICE_ENDPOINT} from "./config";

const APPOINTMENTS_ROUTE = [SERVICE_ENDPOINT, "appointments"].join("/");
const VETS_ROUTE = [SERVICE_ENDPOINT, "vets"].join("/");
const PETS_ROUTE = [SERVICE_ENDPOINT, "pets"].join("/");
// const OWNERS_ROUTE = [SERVICE_ENDPOINT, "owners"].join("/");
// const AVAILABILITIES_ROUTE = [SERVICE_ENDPOINT, "availabilities"].join("/");


export async function get_appointments(
    date?: Date,
    vetId?: number,
    petId?: number
): Promise<IServerOpResult<IServerGetOp, IAppointment[]>>{
    try {
        window.console.log("Sending");
        const response: AxiosResponse = await axios.get(
            APPOINTMENTS_ROUTE, {
                params: {
                    date: date ? date: null,
                    petId: petId ? petId: null,
                    vetId: vetId ? vetId: null
                }
            }
        );
        window.console.log("Sent without exception");
        return {value: response.data};
    } catch (error) {
        window.console.log("Sent with exception");
        return toRequestFailure(error);
    }
}

export async function get_vets(
    lastName?: string,
): Promise<IServerOpResult<IServerGetOp, IVet[]>>{
    try {
        const response: AxiosResponse = await axios.get(
            VETS_ROUTE, {
                params: {
                    lastName: lastName ? lastName: null,
                }
            }
        );
        return {value: response.data};
    } catch (error) {
        return toRequestFailure(error);
    }
}

export async function get_pets(
    name?: string,
): Promise<IServerOpResult<IServerGetOp, IPet[]>>{
    try {
        const response: AxiosResponse = await axios.get(
            PETS_ROUTE, {
                params: {
                    name: name ? name: null,
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
