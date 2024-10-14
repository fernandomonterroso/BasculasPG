export class GuardarPesos {
    constructor(
      public USER: string = '',
      public GUIA_CORR: number = 0,
      public GUIA_ANIO: number = 0,
      public TIPOGUIA_COD: string = '',
      public PESO_CORR: number = 0,
      public PESO_CORREQUIPO: number = 0,
      public PESO_PESOBRUTOLB: number = 0,
      public PESO_FECHOR: string = '',
      public PESO_CFRIO: 'Y' | 'N' = 'N',
      public PESO_USOBASCULA: 'Y' | 'N' = 'Y',
      public BAS_BODEGA: number = 0,
      public BAS_COD: number = 0,
      public PESO_PESOBRUTOKG: number = 0,
      public PESO_TARAKG: number = 0,
      public PESO_NETOKG: number = 0,
      public PESO_TARAMAN: number = 0,
      public PESO_TARAMANKG: number = 0,
      public COBRO_ENCAJA: 'Y' | 'N' = 'N',
      public PESO_ANIOCOD: number = 0,
      public PESO_CODIGO: number = 0,
      public PESO_TOTALENTABLACONSULTAKG: number = 0,
      public PESO_TOTALENTABLACONSULTALB: number = 0
    ) {}
  }