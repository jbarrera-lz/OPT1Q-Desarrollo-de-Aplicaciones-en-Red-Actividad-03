import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';

export interface GenericTableColumn<T> { 
  key: keyof T; 
  label: string; 
}

@Component({
  selector: 'app-my-generic-table',
  imports: [MatTableModule, MatPaginatorModule],
  templateUrl: './my-generic-table.html',
  styleUrl: './my-generic-table.css',
})
export class MyGenericTable<T> implements AfterViewInit {
  @Input() data = new MatTableDataSource<T>();
  @Input() columns: GenericTableColumn<T>[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator = {} as MatPaginator;

  ngAfterViewInit(): void {
    this.data.paginator = this.paginator
  }

  public get displayedColumns(): string[] {
    return this.columns.map(c => c.label)
  }
}
