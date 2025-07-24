declare module 'react-native-bluetooth-escpos-printer' {
  interface Device {
    name: string;
    address: string;
  }

  interface BluetoothManagerType {
    isBluetoothEnabled(): Promise<boolean>;
    enableBluetooth(): Promise<Device[]>;
    connect(address: string): Promise<void>;
    unpaire(address: string): Promise<void>;
  }

  interface BluetoothPrinterType {
    printText(
      text: string,
      options?: {
        encoding?: string;
        codepage?: number;
        widthtimes?: number;
        heigthtimes?: number;
        fonttype?: number;
      }
    ): Promise<void>;
  }

  export const BluetoothManager: BluetoothManagerType;
  export const BluetoothEscposPrinter: BluetoothPrinterType;
}
