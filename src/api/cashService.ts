import axios from "axios";
import { CashData } from "../types/cash";

export async function getCashData(): Promise<CashData> {
  const response = await axios.get<CashData>("/api/cash");
  return response.data;
}