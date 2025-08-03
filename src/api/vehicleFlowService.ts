import {
  Response,
  EditData,
  EntryData,
  ParkedVehiclesResponse,
  RegisterVehicleResponse,
  SecondticketResponse,
  VehicleResponse,
  ResponseCalculateOutstanding,
  exitData,
  ResponseRegisterExit
} from "../types/vehicleFlow";
import axiosInstance from "./axiosInstance";

export const VehicleApi = {
  registerEntry: async (data: EntryData): Promise<RegisterVehicleResponse> => {
    const formData = new FormData();

    formData.append("plate", data.plate);
    formData.append("category", data.category);
    if (data.observation) formData.append("observation", data.observation);

    if (data.photo) {
      formData.append("photo", {
        uri: data.photo,
        name: `${data.plate}.jpg`,
        type: "image/jpeg",
      } as any);
    }

    const response = await axiosInstance.post<RegisterVehicleResponse>(
      "/vehicles/entries",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  editdataVehicle: async (data: EditData): Promise<RegisterVehicleResponse> => {
    const response = await axiosInstance.post<RegisterVehicleResponse>(
      "/vehicles/editVehicle",
      data
    );
    return response.data;
  },

  deleteVehicle: async (data: { id: string }): Promise<Response> => {
    const response = await axiosInstance.post<Response>(
      "/vehicles/deleteVehicle",
      data
    );
    return response.data;
  },

  secondTicket: async (id: string): Promise<SecondticketResponse> => {
    const response = await axiosInstance.get(`/vehicles/${id}/ticket`);
    return response.data;
  },

  reactivateVehicle: async (data: {
    id: string;
    plate: string;
  }): Promise<Response> => {
    const response = await axiosInstance.post<Response>(
      "/vehicles/reactivate-vehicle",
      data
    );
    return response.data;
  },

  getUniquevehicle: async (
    id: string,
    plate: string
  ): Promise<VehicleResponse> => {
    const response = await axiosInstance.get(
      `/vehicles/${id}/${plate}/vehicle`
    );
    return response.data;
  },

  getParked: async (): Promise<ParkedVehiclesResponse> => {
    const response = await axiosInstance.get<ParkedVehiclesResponse>(
      "/vehicles/parked"
    );
    return response.data;
  },

  getParkedExit: async (): Promise<ParkedVehiclesResponse> => {
    const response = await axiosInstance.get<ParkedVehiclesResponse>(
      "/vehicles/parked-exit"
    );
    return response.data;
  },

  calculateOutstanding: async (data: {
    category: string;
    stayDuration: string;
  }): Promise<ResponseCalculateOutstanding> => {
    const response = await axiosInstance.post(
      "/vehicles/calculate-outstanding",
      data
    );
    return response.data;
  },

  registerExit: async (
    data: exitData & { photo?: string }
  ): Promise<ResponseRegisterExit> => {
    const formData = new FormData();

    // Adiciona os campos básicos
    formData.append("plate", data.plate);
    formData.append("exit_time", data.exit_time);
    formData.append("openCashId", data.openCashId);
    formData.append("amount_received", String(data.amount_received));
    formData.append("change_given", String(data.change_given));
    formData.append("discount_amount", String(data.discount_amount));
    formData.append("final_amount", String(data.final_amount));
    formData.append("original_amount", String(data.original_amount));
    formData.append("method", data.method);

    // Se houver foto, adiciona como arquivo
    if (data.photo) {
      formData.append("photo", {
        uri: data.photo,
        name: `${data.plate}_saida.jpg`,
        type: "image/jpeg",
      } as any); // `as any` é necessário para compatibilidade com FormData no RN
    }

    const response = await axiosInstance.post("/vehicles/exits", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },
};
