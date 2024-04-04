import { IConfigProperty, IExportConfiguration } from "./csvTypes";

export const exportToCSV = (items: any, configProperties: IConfigProperty[],
    exportConfig?: IExportConfiguration, dependentData?: any): string => {
    if (!exportConfig) {
        exportConfig = {
            "title": null,
            "includeHeader": true,
            "columnSeparator": ',',
            "arraySeparator": '|',
            "sorroundValuesByString": '',
            "removePipedArrayHeaderBrackets": false
        }
    }

    interface IConfigPropertyX extends IConfigProperty {
        xOrder: number;
    }
    
    const xConfigProperties = configProperties.map(cp => cp as IConfigPropertyX);
    xConfigProperties.sort((a, b) => a.order - b.order);
    xConfigProperties.map((c, i) => c.xOrder = i);
    xConfigProperties.filter(cp => cp.spread == true && !cp.isArray).forEach(cp => cp.isArray = true);
    if (!exportConfig.sorroundValuesByString) exportConfig.sorroundValuesByString = '';
    if (!exportConfig.columnSeparator) exportConfig.columnSeparator = ',';
    if (!exportConfig.arraySeparator) exportConfig.arraySeparator = '|';

    const resultItems = items.map((item: any, index: number) => {
        const result = {};
        xConfigProperties.forEach(cp => {
        if (!item) return;

        const values = cp.generateExportDataFn ? cp.generateExportDataFn(item[cp.property], item, index, dependentData) : item[cp.property];
        if (values == null || values == undefined) // not using !values to help 0.
            return;
        else if (!Array.isArray(values) && !cp.isArray) // values and not array
            result[cp.header] = `${values}`;
        else if (!cp.isArray && Array.isArray(values)) // MUST be a developer mistake
            result[`${cp.header}[]`] = values.join(exportConfig.arraySeparator);
        else if (cp.isArray && !cp.spread) // values && isArray
            result[`${cp.header}[]`] = values.join(exportConfig.arraySeparator);
        else // values, isArray && spread
            values.forEach((v: any, index: number) => result[`${cp.header}[${index}]`] = v);
        });
        return result;
    });

    const headers = Array.from(new Set(resultItems.flatMap((r: any) => Object.keys(r))));
    headers.sort((x, y) => {
        const a = x.toString();
        const b = y.toString();
        const {
        header: headerA,
        xOrder: orderA
        } = xConfigProperties.find(cp => a === cp.header || a.startsWith(`${cp.header}[`)) || {};
        const {
        header: headerB,
        xOrder: orderB
        } = xConfigProperties.find(cp => b === cp.header || b.startsWith(`${cp.header}[`)) || {};

        // Extract numeric values enclosed in square brackets if they exist
        const numA = a.match(/\[(\d+)\]/) ? parseInt(a.match(/\[(\d+)\]/)[1]) : 0;
        const numB = b.match(/\[(\d+)\]/) ? parseInt(b.match(/\[(\d+)\]/)[1]) : 0;

        // Compare based on order
        if (orderA < orderB) return -1;
        if (orderA > orderB) return 1;

        // If order is the same and both items have numeric parts, compare them
        if (headerA === headerB && numA !== 0 && numB !== 0) {
        return numA - numB;
        }

        // If order is the same or there's no numeric part, compare items alphabetically
        return a.localeCompare(b);
    });

    const resultCSVItems = resultItems.map((item: any, index: number) => {
        const rowItem = [];
        headers.forEach((header) => {
        var value = item.hasOwnProperty(header as string) ? item[header as string] : '';
        value = `${exportConfig.sorroundValuesByString}${value}${exportConfig.sorroundValuesByString}`
        rowItem.push(value);
        });
        return rowItem.join(exportConfig.columnSeparator);
    });

    if (exportConfig.includeHeader) {
        if (exportConfig.removePipedArrayHeaderBrackets) {
        xConfigProperties.forEach(cp => {
            const idx = headers.indexOf(`${cp.header}[]`);
            if (idx >= 0) headers[idx] = `${cp.header}`;
        });
        }
        resultCSVItems.splice(0, 0, headers.join(exportConfig.columnSeparator));
    }
    if (exportConfig.title) resultCSVItems.splice(0, 0, `${exportConfig.title}`);
    return (resultCSVItems.join('\n'));
}    
