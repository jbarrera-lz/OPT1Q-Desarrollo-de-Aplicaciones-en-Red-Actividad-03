import { Coordenates } from './coordenates';
import { ListaEESSPrecio } from './petrolStation';
import * as L from 'leaflet';

export class EstacionTerrestre {
  // Public
  public drawn: boolean = false;

  // Private
  private _marker!: L.Marker;
  private _coordenates!:  Coordenates;
  private _localidad: string = "";
  private _address: string = "";
  private _timetable: string = "";
  private _rotulo: string = "";
  private _council: string = "";
  private _county: string = "";

  // Precios combustibles más comúnes
  private  "Precio Adblue":                      number = NaN;
  private  "Precio Gas Natural Comprimido":      number = NaN;
  private  "Precio Gas Natural Licuado":         number = NaN;
  private  "Precio Gases licuados del petróleo": number = NaN;
  private  "Precio Gasoleo A":                   number = NaN;
  private  "Precio Gasoleo B":                   number = NaN;
  private  "Precio Gasoleo Premium":             number = NaN;
  private  "Precio Gasolina 95 E10":             number = NaN;
  private  "Precio Gasolina 95 E25":             number = NaN;
  private  "Precio Gasolina 95 E5":              number = NaN;
  private  "Precio Gasolina 95 E5 Premium":      number = NaN;
  private  "Precio Gasolina 95 E85":             number = NaN;
  private  "Precio Gasolina 98 E10":             number = NaN;
  private  "Precio Gasolina 98 E5":              number = NaN;

  
  private readonly _iconPetrolStation = new L.Icon(
    {
      iconUrl: 'src/assets/img/local_gas.svg',
      iconSize: [24, 24],
      iconAnchor: [0, 0],
      popupAnchor: [0, 0],
      className: 'gas-station-icon'
    }
  )
  private static readonly DAY_ORDER: string[] = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
private static readonly DAY_TO_JS: Record<string, number> = {
  'D': 0, // Domingo
  'L': 1,
  'M': 2,
  'X': 3,
  'J': 4,
  'V': 5,
  'S': 6,
};

private static timeToMinutes(str: string): number {
  const [hStr, mStr] = str.split(':');
  let h = parseInt(hStr, 10);
  let m = parseInt(mStr, 10);

  // Caso especial 24:00 -> lo dejamos como 23:59
  if (h === 24 && m === 0) {
    h = 23;
    m = 59;
  }

  return h * 60 + m;
}

private static expandDayRange(token: string): number[] {
  token = token.trim().toUpperCase();

  // Rango tipo "L-V" o "S-D"
  if (token.includes('-')) {
    const [from, to] = token.split('-').map(t => t.trim().toUpperCase());
    const startIdx = EstacionTerrestre.DAY_ORDER.indexOf(from);
    const endIdx   = EstacionTerrestre.DAY_ORDER.indexOf(to);

    if (startIdx === -1 || endIdx === -1) {
      return [];
    }

    const result: number[] = [];
    let i = startIdx;

    // Recorremos circularmente L,M,X,J,V,S,D
    while (true) {
      const dayChar = EstacionTerrestre.DAY_ORDER[i];
      const jsDay = EstacionTerrestre.DAY_TO_JS[dayChar];
      if (jsDay !== undefined) {
        result.push(jsDay);
      }

      if (i === endIdx) break;
      i = (i + 1) % EstacionTerrestre.DAY_ORDER.length;
    }

    return result;
  }

  // Día suelto "L", "S", "D", etc.
  const jsDay = EstacionTerrestre.DAY_TO_JS[token];
  return jsDay === undefined ? [] : [jsDay];
}

private getTimetableSegments(): { days: number[]; open: number; close: number }[] {
  const timetable = this._timetable;
  if (!timetable) {
    return [];
  }

  const segments: { days: number[]; open: number; close: number }[] = [];

  // Ejemplos que captura:
  // "L-D: 06:00-00:00"
  // "L-V: 10:00-13:00 y S-D: 13:00-14:00"
  const regex = /([LMXJVSD](?:-[LMXJVSD])?)\s*:\s*(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/gi;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(timetable)) !== null) {
    const dayToken = match[1];   // "L-D", "L-V", "S-D", etc.
    const openStr  = match[2];   // "06:00"
    const closeStr = match[3];   // "00:00"

    const days = EstacionTerrestre.expandDayRange(dayToken);
    const openMinutes  = EstacionTerrestre.timeToMinutes(openStr);
    let   closeMinutes = EstacionTerrestre.timeToMinutes(closeStr);

    // CASO ESPECIAL: "06:00-00:00" => interpretamos 00:00 como 24:00
    // siempre que la hora de cierre sea 00:00 y la apertura sea > 0
    if (closeMinutes === 0 && /^0{1,2}:0{2}$/.test(closeStr) && openMinutes > 0) {
      closeMinutes = 24 * 60; // 1440
    }

    if (days.length > 0) {
      segments.push({
        days,
        open: openMinutes,
        close: closeMinutes,
      });
    }
  }

  return segments;
}


  constructor(eessData: ListaEESSPrecio) {
    this._coordenates = {
      latitude: parseFloat(eessData['Latitud'].replace(',','.')),
      longitude: parseFloat(eessData['Longitud (WGS84)'].replace(',','.'))
    };
    this._address = eessData['Dirección'];
    this._timetable = eessData['Horario'];
    this._localidad = eessData['Localidad'];
    this._rotulo = eessData['Rótulo'];
    this._council = eessData['Municipio'];
    this._county = eessData['Provincia'];
    this.adblue = eessData['Precio Adblue'];
    this.gnc = eessData['Precio Gas Natural Comprimido'];
    this.gnl = eessData['Precio Gas Natural Licuado'];
    this.glp = eessData['Precio Gases licuados del petróleo'];
    this.gasoleoA = eessData['Precio Gasoleo A'];
    this.gasoleoB = eessData['Precio Gasoleo B'];
    this.gasoleoPremium = eessData['Precio Gasoleo Premium'];
    this.gasolina95e10 = eessData['Precio Gasolina 95 E10'];
    this.gasolina95e25 = eessData['Precio Gasolina 95 E25'];
    this.gasolina95E5 = eessData['Precio Gasolina 95 E5'];
    this.gasolina95E5Premium = eessData['Precio Gasolina 95 E5 Premium'];
    this.gasolina95E5E85 = eessData['Precio Gasolina 95 E85'];
    this.gasolina98E10 = eessData['Precio Gasolina 98 E10'];
    this.gasolina98E5 = eessData['Precio Gasolina 98 E5'];
    this.marker = eessData;
  }

  /** Getters and Setters */
  public get coor() : Coordenates {
    return this._coordenates;
  }

  public get LatLong() : [ number, number ] {
    return [ 
        this._coordenates.latitude,
        this._coordenates.longitude 
    ];
  }

  public get latitude() : number {
    return this._coordenates['latitude'];
  }

  public get longitude() : number {
    return this._coordenates['longitude'];
  }

public get isOpenNow(): boolean {
  const timetable = this._timetable;
  if (!timetable) {
    return false;
  }

  const now = new Date();
  const jsDay = now.getDay(); // 0 = domingo, 1 = lunes, ..., 6 = sábado
  const minutesNow = now.getHours() * 60 + now.getMinutes();

  const normalized = timetable.toLowerCase();

  // 1) Casos claros de 24h
  if (
    normalized.includes('24h') ||
    normalized.includes('24 h') ||
    normalized.includes('24 horas') ||
    normalized.includes('24horas')
  ) {
    return true;
  }

  // 2) Intentamos parsear segmentos explícitos Día(s): HH:MM-HH:MM
  const segments = this.getTimetableSegments();

  if (segments.length > 0) {
    return segments.some(seg => {
      if (!seg.days.includes(jsDay)) {
        return false;
      }

      // Tramo normal dentro del mismo día
      if (seg.close > seg.open) {
        return minutesNow >= seg.open && minutesNow < seg.close;
      }

      // Tramo que cruza medianoche (ej. 22:00-06:00)
      // abierto si es >= apertura O < cierre
      if (seg.close < seg.open) {
        return minutesNow >= seg.open || minutesNow < seg.close;
      }

      // Si apertura y cierre coinciden (raro), lo consideramos cerrado
      return false;
    });
  }

  // 3) FALLBACK: no hemos sabido parsear días, pero sí un tramo horario simple
  const match = timetable.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
  if (!match) {
    return false;
  }

  const openMinutes =
    parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
  let closeMinutes =
    parseInt(match[3], 10) * 60 + parseInt(match[4], 10);

  // Reaplicamos la lógica 06:00-00:00 => 24:00 en el fallback
  if (closeMinutes === 0 && openMinutes > 0) {
    closeMinutes = 24 * 60;
  }

  if (closeMinutes > openMinutes) {
    return minutesNow >= openMinutes && minutesNow < closeMinutes;
  }

  // Cruza medianoche (ej. 22:00-06:00)
  return minutesNow >= openMinutes || minutesNow < closeMinutes;
}




  /** Location Marker */
  public set marker(eessData : ListaEESSPrecio) {
    this._marker = new L.Marker(
      [
        parseFloat(eessData['Latitud'].replace(',','.')),
        parseFloat(eessData['Longitud (WGS84)'].replace(',','.'))
      ],
      {
        icon: this._iconPetrolStation,
        alt: `${this.rotulo}`,
        riseOnHover: true,
        title: `${this.rotulo}
Horario: ${this.horario}
Direccion: ${this.address}
Localidad: ${this.localidad}`
      }
    );
  }

  public get petrolStationPicture() : string {
    return 'src/assets/img/oil_barrel.svg';
  }

  public get marker() : L.Marker {
    return this._marker;
  }

  public get localidad() : string {
    return this._localidad;
  }

  public get address() : string {
    return this._address;
  }

  public get horario() : string {
    return this._timetable;
  }

  public get rotulo() : string {
    return this._rotulo;
  }

  public get municipio() : string {
    return this._council;
  }

  public get ccaa() : string {
    return this._county;
  }

  public get adblue() : [ number, boolean ] {
    return [ this['Precio Adblue'], Number.isNaN(this['Precio Adblue'])];
  }

  public set adblue(precio: string){
    var p : string = precio.replace(',','.');
    this["Precio Adblue"] = (p === '') ? NaN : parseFloat(p)
  } 

  public get gnc() : [ number, boolean ] {
    return [ 
      this['Precio Gas Natural Comprimido'], 
      Number.isNaN(this['Precio Gas Natural Comprimido'])
    ];
  }

  public set gnc(precio: string){
    var p : string = precio.replace(',','.');
    this['Precio Gas Natural Comprimido'] = (p === '') ? NaN : parseFloat(p)
  } 

  public get gnl() : [ number, boolean ] {
    return [ 
      this['Precio Gas Natural Licuado'], 
      Number.isNaN(this['Precio Gas Natural Licuado'])
    ];
  }

  public set gnl(precio: string){
    var p : string = precio.replace(',','.');
    this['Precio Gas Natural Licuado'] = (p === '') ? NaN : parseFloat(p)
  } 

  public get glp() : [ number, boolean ] {
    return [ 
      this['Precio Gases licuados del petróleo'], 
      Number.isNaN(this['Precio Gases licuados del petróleo'])
    ];
  }

  public set glp(precio: string){
    var p : string = precio.replace(',','.');
    this['Precio Gases licuados del petróleo'] = (p === '') ? NaN : parseFloat(p)
  }

  public get gasoleoA() : [ number, boolean ] {
    return [ 
      this['Precio Gasoleo A'], 
      Number.isNaN(this['Precio Gasoleo A'])
    ];
  }

  public set gasoleoA(precio: string){
    var p : string = precio.replace(',','.');
    this['Precio Gasoleo A'] = (p === '') ? NaN : parseFloat(p)
  }

  public get gasoleoB() : [ number, boolean ] {
    return [ 
      this['Precio Gasoleo B'], 
      Number.isNaN(this['Precio Gasoleo B'])
    ];
  }

  public set gasoleoB(precio: string){
    var p : string = precio.replace(',','.');
    this['Precio Gasoleo B'] = (p === '') ? NaN : parseFloat(p)
  }

  public get gasoleoPremium() : [ number, boolean ] {
    return [ this['Precio Gasoleo Premium'], Number.isNaN(this['Precio Gasoleo Premium'])];
  }

  public set gasoleoPremium(precio: string){
    var p : string = precio.replace(',','.');
    this['Precio Gasoleo Premium'] = (p === '') ? NaN : parseFloat(p)
  }

  public get gasolina95e10() : [ number, boolean ] {
    return [ this['Precio Gasolina 95 E10'], Number.isNaN(this['Precio Gasolina 95 E10'])];
  }

  public set gasolina95e10(precio: string){
    var p : string = precio.replace(',','.');
    this['Precio Gasolina 95 E10'] = (p === '') ? NaN : parseFloat(p)
  }

  public get gasolina95e25() : [ number, boolean ] {
    return [ 
      this['Precio Gasolina 95 E25'], 
      Number.isNaN(this['Precio Gasolina 95 E25'])
    ];
  }

  public set gasolina95e25(precio: string){
    var p : string = precio.replace(',','.');
    this['Precio Gasolina 95 E25'] = (p === '') ? NaN : parseFloat(p)
  }

  public get gasolina95E5() : [ number, boolean ] {
    return [ this['Precio Gasolina 95 E5'], Number.isNaN(this['Precio Gasolina 95 E5'])];
  }

  public set gasolina95E5(precio: string) {
    var p : string = precio.replace(',','.');
    this['Precio Gasolina 95 E5'] = (p === '') ? NaN : parseFloat(p)
  }

  public get gasolina95E5Premium() : [ number, boolean ] {
    return [ 
      this['Precio Gasolina 95 E5 Premium'], 
      Number.isNaN(this['Precio Gasolina 95 E5 Premium'])
    ];
  }

  public set gasolina95E5Premium(precio: string){
    var p : string = precio.replace(',','.');
    this['Precio Gasolina 95 E5 Premium'] = (p === '') ? NaN : parseFloat(p)
  }

  public get gasolina95E5E85() : [ number, boolean ] {
    return [ 
      this['Precio Gasolina 95 E85'], 
      Number.isNaN(this['Precio Gasolina 95 E85'])
    ];
  }

  public set gasolina95E5E85(precio: string){
    var p : string = precio.replace(',','.');
    this['Precio Gasolina 95 E85'] = (p === '') ? NaN : parseFloat(p)
  }

  public get gasolina98E10() : [ number, boolean ] {
    return [ 
      this['Precio Gasolina 98 E10'], 
      Number.isNaN(this['Precio Gasolina 98 E10'])
    ];
  }

  public set gasolina98E10(precio: string){
    var p : string = precio.replace(',','.');
    this['Precio Gasolina 98 E10'] = (p === '') ? NaN : parseFloat(p)
  }

  public get gasolina98E5() : [ number, boolean ] {
    return [ 
      this['Precio Gasolina 98 E5'], 
      Number.isNaN(this['Precio Gasolina 98 E5'])
    ];
  }

  public set gasolina98E5(precio: string){
    var p : string = precio.replace(',','.');
    this['Precio Gasolina 98 E5'] = (p === '') ? NaN : parseFloat(p)
  }
}
