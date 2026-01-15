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
      this['Precio Gasolina 95 E10'], 
      Number.isNaN(this['Precio Gasolina 95 E10'])
    ];
  }

  public set gasolina98E10(precio: string){
    var p : string = precio.replace(',','.');
    this['Precio Gasolina 95 E10'] = (p === '') ? NaN : parseFloat(p)
  }

  public get gasolina98E5() : [ number, boolean ] {
    return [ 
      this['Precio Gasolina 95 E5'], 
      Number.isNaN(this['Precio Gasolina 95 E5'])
    ];
  }

  public set gasolina98E5(precio: string){
    var p : string = precio.replace(',','.');
    this['Precio Gasolina 98 E5'] = (p === '') ? NaN : parseFloat(p)
  }
}
