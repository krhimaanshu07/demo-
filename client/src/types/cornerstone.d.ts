declare module 'cornerstone-core' {
  interface ImageLoadObject {
    promise: Promise<any>;
    cancelFn?: () => void;
  }

  interface Image {
    imageId: string;
    minPixelValue: number;
    maxPixelValue: number;
    slope: number;
    intercept: number;
    windowCenter: number;
    windowWidth: number;
    render: any;
    getPixelData: () => any;
    rows: number;
    columns: number;
    height: number;
    width: number;
    color: boolean;
    columnPixelSpacing: number;
    rowPixelSpacing: number;
    invert: boolean;
    sizeInBytes: number;
  }

  interface EnabledElement {
    element: HTMLElement;
    image?: Image;
    viewport: any;
    canvas: HTMLCanvasElement;
    invalid: boolean;
    needsRedraw: boolean;
    layers: any[];
    syncViewports: boolean;
    lastSyncViewportsState: boolean;
  }

  function enable(element: HTMLElement, options?: any): void;
  function disable(element: HTMLElement): void;
  function displayImage(element: HTMLElement, image: Image, viewport?: any): void;
  function getImage(element: HTMLElement): Image;
  function loadImage(imageId: string): Promise<Image>;
  function resize(element: HTMLElement, forcedResize?: boolean): void;
  function fitToWindow(element: HTMLElement): void;
  function getEnabledElement(element: HTMLElement): EnabledElement;
  function getViewport(element: HTMLElement): any;
  function setViewport(element: HTMLElement, viewport: any): void;

  const external: {
    cornerstone: any;
  };
}

declare module 'cornerstone-wado-image-loader' {
  function configure(options: any): void;
  
  const external: {
    cornerstone: any;
    dicomParser: any;
  };
}

declare module 'dicom-parser' {
  interface DataSet {
    elements: { [key: string]: any };
    string(tag: string): string | undefined;
    uint16(tag: string): number | undefined;
    uint32(tag: string): number | undefined;
    int16(tag: string): number | undefined;
    int32(tag: string): number | undefined;
    float(tag: string): number | undefined;
    double(tag: string): number | undefined;
    text(tag: string): string | undefined;
  }

  function parseDicom(byteArray: Uint8Array, options?: any): DataSet;
}