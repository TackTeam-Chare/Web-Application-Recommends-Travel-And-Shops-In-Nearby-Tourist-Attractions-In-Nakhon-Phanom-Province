import {
    UseSortByColumnProps,
    UsePaginationInstanceProps,
    UseGlobalFiltersInstanceProps,
    UseSortByInstanceProps,
    UseGroupByInstanceProps,
    UseExpandedInstanceProps,
    UseRowSelectInstanceProps,
    UseRowSelectRowProps,
    UseRowStateInstanceProps,
    UseRowStateRowProps,
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
      extends UsePaginationInstanceProps<D>,
        UseGlobalFiltersInstanceProps<D>,
        UseSortByInstanceProps<D> {}

    export interface ColumnInterface<D extends Record<string, unknown> = {}>
      extends UseSortByColumnProps<D> {}

    export interface Row<D extends Record<string, unknown> = {}>
      extends UseRowSelectRowProps<D>,
        UseRowStateRowProps<D> {}
  }
