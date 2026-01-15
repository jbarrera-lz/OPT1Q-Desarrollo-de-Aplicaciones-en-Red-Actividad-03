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
  private  "Precio Adblue":                      string = "";
  private  "Precio Gas Natural Comprimido":      string = "";
  private  "Precio Gas Natural Licuado":         string = "";
  private  "Precio Gases licuados del petróleo": string = "";
  private  "Precio Gasoleo A":                   string = "";
  private  "Precio Gasoleo B":                   string = "";
  private  "Precio Gasoleo Premium":             string = "";
  private  "Precio Gasolina 95 E10":             string = "";
  private  "Precio Gasolina 95 E25":             string = "";
  private  "Precio Gasolina 95 E5":              string = "";
  private  "Precio Gasolina 95 E5 Premium":      string = "";
  private  "Precio Gasolina 95 E85":             string = "";
  private  "Precio Gasolina 98 E10":             string = "";
  private  "Precio Gasolina 98 E5":              string = "";

  
  private readonly _iconPetrolStation = new L.Icon(
    {
      iconUrl: 'src/assets/img/local_gas.svg',
      iconSize: [24, 24],
      iconAnchor: [24, 24],
      popupAnchor: [0, 0],
      className: 'gas-station-icon'
    }
  )
  
  constructor(eessData: ListaEESSPrecio) {
    this._coordenates = {
      latitude: parseFloat(eessData['Latitud']),
      longitude: parseFloat(eessData['Longitud (WGS84)'])
    };
    this._address = eessData['Dirección'];
    this._timetable = eessData['Horario'];
    this._localidad = eessData['Localidad'];
    this._rotulo = eessData['Rótulo'];
    this._council = eessData['Municipio'];
    this._county = eessData['Provincia'];
    this["Precio Adblue"] = eessData['Precio Adblue'];
    this["Precio Gas Natural Comprimido"] = eessData['Precio Gas Natural Comprimido'];
    this["Precio Gas Natural Licuado"] = eessData['Precio Gas Natural Licuado'];
    this["Precio Gases licuados del petróleo"] = eessData['Precio Gases licuados del petróleo'];
    this["Precio Gasoleo A"] = eessData['Precio Gasoleo A'];
    this["Precio Gasoleo B"] = eessData['Precio Gasoleo B'];
    this["Precio Gasoleo Premium"] = eessData['Precio Gasoleo Premium'];
    this["Precio Gasolina 95 E10"] = eessData['Precio Gasolina 95 E10'];
    this["Precio Gasolina 95 E25"] = eessData['Precio Gasolina 95 E25'];
    this["Precio Gasolina 95 E5"] = eessData['Precio Gasolina 95 E5'];
    this["Precio Gasolina 95 E5 Premium"] = eessData['Precio Gasolina 95 E5 Premium'];
    this["Precio Gasolina 95 E85"] = eessData['Precio Gasolina 95 E85'];
    this["Precio Gasolina 98 E10"] = eessData['Precio Gasolina 98 E10'];
    this["Precio Gasolina 98 E5"] = eessData['Precio Gasolina 98 E5'];

    this.marker = eessData;
  }

  /** Getters and Setters */
  public get coor() : Coordenates {
    return this._coordenates;
  }

  public get LatLong() : [ number, number ] {
    return [ 
        this._coordenates['latitude'],
        this._coordenates['longitude'] 
    ];
  }

  public get latitude() : number {
    return this._coordenates['latitude'];
  }

  public get longitude() : number {
    return this._coordenates['longitude'];
  }
    public get isOpenNow(): boolean {
    const timetable: string = this._timetable || '';
    if (!timetable) return false;

    const normalized = timetable.trim().toLowerCase();

    // 1) Casos tipo "24H", "24 H", "24 HORAS", etc. → siempre abierta
    if (
      normalized.includes('24h') ||
      normalized.includes('24 h') ||
      normalized.includes('24 horas') ||
      normalized.includes('24horas')
    ) {
      return true;
    }

    // 2) Intentamos encontrar un rango horario HH:MM-HH:MM
    const match = timetable.match(/(\d{2}):(\d{2})\s*-\s*(\d{2}):(\d{2})/);
    if (!match) return false;

    const now = new Date();
    const hour = now.getHours() + now.getMinutes() / 60;

    const openHour = parseInt(match[1], 10) + parseInt(match[2], 10) / 60;
    const closeHour = parseInt(match[3], 10) + parseInt(match[4], 10) / 60;

    // 3) Si el cierre es menor que la apertura, asumimos horario nocturno (ej. 22:00-06:00)
    if (closeHour < openHour) {
      // Abre por la noche: está abierta si es >= apertura o <= cierre
      return hour >= openHour || hour <= closeHour;
    }

    // 4) Horario normal dentro del mismo día
    return hour >= openHour && hour <= closeHour;
  }


  /** Location Marker */
  public set marker(eessData : ListaEESSPrecio) {
    this._marker = new L.Marker(
      [
        parseFloat(eessData['Latitud']),
        parseFloat(eessData['Longitud (WGS84)'])
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

  public get adblue() : string {
    return this['Precio Adblue'];
  }

  public get gnc() : string {
    return this['Precio Gas Natural Comprimido'];
  }

  public get gnl() : string {
    return this['Precio Gas Natural Licuado'];
  }

  public get glp() : string {
    return this['Precio Gases licuados del petróleo'];
  }

  public get gasoleoA() : string {
    return this['Precio Gasoleo A'];
  }

  public get gasoleoB() : string {
    return this['Precio Gasoleo B'];
  }

  public get gasoleoPremium() : string {
    return this['Precio Gasoleo Premium'];
  }

  public get gasolina95e10() : string {
    return this['Precio Gasolina 95 E10'];
  }

  public get gasolina95e25() : string {
    return this['Precio Gasolina 95 E25'];
  }

  public get gasolina95E5() : string {
    return this['Precio Gasolina 95 E5'];
  }

  public get gasolina95E5Premium() : string {
    return this['Precio Gasolina 95 E5 Premium'];
  }

  public get gasolina95E5E85() : string {
    return this['Precio Gasolina 95 E85'];
  }

  public get gasolina98E10() : string {
    return this['Precio Gasolina 98 E10'];
  }

  public get gasolina98E5() : string {
    return this['Precio Gasolina 98 E5'];
  }
}
