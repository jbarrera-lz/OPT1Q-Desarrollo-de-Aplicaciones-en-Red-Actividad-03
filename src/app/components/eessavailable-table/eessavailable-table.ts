import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { EstacionTerrestre } from '../../common/estacion-terrestre';
import { MyGenericTable, GenericTableColumn } from '../my-generic-table/my-generic-table';

export interface EstacionTerrestreRow {
  rotulo: string,
  localidad: string,
  municipio: string,
  direccion: string,
  horario: string,
  adblue: string,
  "Gas Natural Comprimido" : string,
  "Gas Natural Licuado": string,
  "Gases Licuados del petróleo": string,
  "Gasóleo A": string,
  "Gasóleo B": string,
  "Gasóleo Premium": string,
  "Gasolina 95 E10": string,
  "Gasolina 95 E25": string,
  "Gasolina 95 E5": string,
  "Gasolina 95 E5 Premium": string,
  "Gasolina 95 E85": string,
  "Gasolina 98 E10": string,
  "Gasolina 98 E5": string
};

@Component({
  selector: 'app-eessavailable-table',
  imports: [
    MyGenericTable
  ],
  templateUrl: './eessavailable-table.html',
  styleUrl: './eessavailable-table.css',
})
export class EESSAvailableTable {
  @Input() radius!: number;
  @Input() stations!: EstacionTerrestre[];
  

  public get dataSource() : MatTableDataSource<EstacionTerrestreRow> {
    return new MatTableDataSource<EstacionTerrestreRow>(this.rows);
  }

  public get rows() : EstacionTerrestreRow[] { 
    const data : EstacionTerrestreRow[] = [];
    for (var eess of this.stations) {
      if (eess.drawn) {
        const e : EstacionTerrestreRow = {
          rotulo                          : eess.rotulo,
          localidad                       : eess.localidad,
          municipio                       : eess.municipio,
          direccion                       : eess.address,
          horario                         : eess.horario,
          adblue                          : eess["Precio Adblue"],
          "Gas Natural Comprimido"        : eess['Precio Gas Natural Comprimido'],
          "Gas Natural Licuado"           : eess["Precio Gas Natural Licuado"],
          "Gases Licuados del petróleo"   : eess["Precio Gases licuados del petróleo"],
          "Gasóleo A"                     : eess["Precio Gasoleo A"],
          "Gasóleo B"                     : eess["Precio Gasoleo B"],
          "Gasóleo Premium"               : eess["Precio Gasoleo Premium"],
          "Gasolina 95 E10"               : eess["Precio Gasolina 95 E10"],
          "Gasolina 95 E25"               : eess["Precio Gasolina 95 E25"],
          "Gasolina 95 E5"                : eess["Precio Gasolina 95 E5"],
          "Gasolina 95 E5 Premium"        : eess["Precio Gasolina 95 E5 Premium"],
          "Gasolina 95 E85"               : eess["Precio Gasolina 95 E85"],
          "Gasolina 98 E10"               : eess["Precio Gasolina 98 E10"],
          "Gasolina 98 E5"                : eess["Precio Gasolina 98 E5"],
        };
        data.push(e);
      }
    }
    return data;
  }

  public get columns() : GenericTableColumn<EstacionTerrestreRow>[] {
    return [
      { key: 'rotulo', label: "Rótulo" },
      { key: "localidad", label: "Localidad" },
      { key: "municipio", label: "Municipio" },
      { key: "direccion", label: "Dirección" },
      { key: "horario", label: "Horario" },
      { key: "adblue", label: "Adblue" },
      { key: "Gas Natural Licuado", label: "Gas Natural Licuado" },
      { key: "Gases Licuados del petróleo", label: "Gases Licuados del petróleo" },
      { key: "Gasóleo A", label: "Gasóleo A" },
      { key: "Gasóleo B", label: "Gasóleo B" },
      { key: "Gasóleo Premium", label: "Gasóleo Premium" },
      { key: "Gasolina 95 E10", label: "Gasolina 95 E10" },
      { key: "Gasolina 95 E25", label: "Gasolina 95 E25" },
      { key: "Gasolina 95 E5", label: "Gasolina 95 E5" },
      { key: "Gasolina 95 E5 Premium", label: "Gasolina 95 E5 Premium" },
      { key: "Gasolina 95 E85", label: "Gasolina 95 E85" },
      { key: "Gasolina 98 E10", label: "Gasolina 98 E10" },
      { key: "Gasolina 98 E5", label: "Gasolina 98 E5" }
    ];
  }
}
