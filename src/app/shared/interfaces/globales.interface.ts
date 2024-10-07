// Interfaz para Bodegas
export interface Bodega {
    title: string;
    TIPOGUIA_COD: string;
    BOD: string;
  }
  
  // Interfaz para Básculas
  export interface Bascula {
    BAS_COD: string;
    BAS_ENDPOINT: string;
    BAS_BUTTON?: string;
    ACTIVA?: boolean;
  }
  
  // Interfaz para Guía
  export interface Guia {
    GUIA: string | null;
    GUIA_ANIO: number | null;
    GUIA_CORR: number | null;
    TIPOGUIA_COD: string | null;
    GUIA_CONSIGNATARIO: string | null;
    GUIA_PIEZA: number | null;
    GUIA_PESO: number | null;
    GUIA_PESOKG: number | null;
    GUIA_REPESOKG: number | null;
    ESTADO_COD: string | null;
    GUIA_ORDEN: string | null;
    fecha: string | null;
    GUIA_PIEZACF: number | null;
  }
  
  // Interfaz para Guardar Pesos
  export interface GuardarPesos {
    PESO_CFRIO: boolean;
    COBRO_ENCAJA: boolean;
  }
  
  // Interfaz para los Parámetros de Guía
  export interface GuiaParametros {
    guia_prefijo: string;
    guia_num: string;
    man_anio: string;
    man_corr: string;
    bod: Bodega | null;
  }
  
  export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
  }