import {
    UseSortByColumnProps,
    UsePaginationInstanceProps,
    UsePaginationState,
    UseGlobalFiltersInstanceProps,
    UseGlobalFiltersState,
    UseSortByInstanceProps,
    UseSortByState,
    TableInstance,
    TableOptions,
    TableState,
    Column,
    Row,
  } from 'react-table';
  
  declare module 'react-table' {
    export interface TableOptions<D extends Record<string, unknown>>
      extends UsePaginationInstanceProps<D>,
        UseGlobalFiltersInstanceProps<D>,
        UseSortByInstanceProps<D> {}
  
    export interface TableInstance<D extends Record<string, unknown> = {}>
      extends UsePaginationInstanceProps<D>,
        UseGlobalFiltersInstanceProps<D>,
        UseSortByInstanceProps<D> {}
  
    export interface TableState<D extends Record<string, unknown> = {}>
      extends UsePaginationState<D>,
        UseGlobalFiltersState<D>,
        UseSortByState<D> {}
  
    export interface ColumnInterface<D extends Record<string, unknown> = {}>
      extends UseSortByColumnProps<D> {}
  
    export interface Row<D extends Record<string, unknown> = {}> {}
  }
  