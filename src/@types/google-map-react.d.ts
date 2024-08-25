
declare module 'google-map-react' {
    import { ComponentType } from 'react';
  
    interface Props {
      bootstrapURLKeys: { key: string };
      defaultCenter: { lat: number; lng: number };
      defaultZoom: number;
      children?: React.ReactNode;
    }
  
    const GoogleMapReact: ComponentType<Props>;
  
    export default GoogleMapReact;
  }
  
  declare module 'lodash.debounce' {
    import { DebouncedFunc } from 'lodash';
    export default function debounce<T extends (...args: any) => any>(
      func: T,
      wait?: number,
      options?: {
        leading?: boolean;
        maxWait?: number;
        trailing?: boolean;
      }
    ): DebouncedFunc<T>;
  }
  