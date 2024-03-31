export interface IConfigProperty {
    header: string;
    property?: string;
    isArray?: boolean;
    spread?: boolean;
    order: number;
    generateExportDataFn?: (propertyData: any, item: any, index: number, dependentData: any) => any;
}

export interface IExportConfiguration {
    title: string;
    includeHeader: boolean,
    columnSeparator: string,
    arraySeparator: string;
    sorroundValuesByString: string;
    removePipedArrayHeaderBrackets: boolean;
}
