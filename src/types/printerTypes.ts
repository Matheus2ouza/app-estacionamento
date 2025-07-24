export type PrinterConnectionType = "bluetooth" | "network";

export interface PrinterDevice {
  id: string;
  name: string;
  type: PrinterConnectionType;
  address: string; // Endereço MAC para Bluetooth ou IP para rede
}

export interface PrinterSettings {
  width: number;
  height: number;
  margin: number;
  connectionType: PrinterConnectionType;
}