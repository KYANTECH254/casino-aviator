declare global {
    interface Window {
      Konva: any; // Extend the Window interface to include Konva
      gifler: any; // Similarly extend for gifler
    }
  }
  
  export {};
  