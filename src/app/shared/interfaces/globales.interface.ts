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

export interface Peso {
  Peso_Usobascula: string;
  Bas_cod: string;
  Peso_Cfrio: string;
  Tembalaje_Cod: string | null;
  Peso_Pesobrutokg: number;
  PESO_PESOBRUTOLB: number;
  PESO_TARAKG: number;
  PESO_NETOKG: number;
  Peso_Fechor: string;
  Peso_Aniocod: number | null;
  Peso_Codigo: number | null;
  peso_corr: number;
  Peso_Correquipo: number;
  Guia_Corr: number;
}

export interface InfoPeso {
  CORRELATIVO: number; // Correlativo de información
  PARAMETRO: number; // Parámetro (puede ser usado para diferentes propósitos)
  PESO_CODIGO: number; // Código del peso
  PESO_ANIOCOD: number; // Año del peso
}

export interface DetallePeso {
  DETPESO_CORR: number;
  DETPESO_ANIOREP: number;
  DETPESO_CODREP: number;
  DETPESO_BASCULA: number;
  DETPESO_TARA: number;
  DETPESO_PESOBRUTO: number;
  DETPESO_PESOBRUTOKG: number;
  DETPESO_BASCULALB?: string; // Este valor parece ser calculado y devuelto como cadena con decimales
}

export interface User {
  USER_ID?: number;
  USER_GAFETE?: string;
  USER_NOMBRE?: string;
  USER_APELLIDO?: string;
  USER_DOC?: string;
  USER_PUESTO?: string;
  USER_TELEFONO?: string;
  USER_CORREO?: string;
  USER_USUARIO?: string;
  USER_PASS?: string;
  USER_TIPO?: string;
  USER_FECHA?: string;  // También puede ser `Date` si es necesario
  EMPR_ID?: number;
  TIPO_EMPR?: number;
  USER_ESTADO?: string;
  ROL_ID?: number;
  photoURL?: string | null;
  BASCULAS?: string;
}
