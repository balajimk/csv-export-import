export const simpleExportToCSV = (items: any[], spreadArrays: boolean = true,
    columnSeparator: string = ',', arraySeparator: string = '|'): string => {
    if (!items || items.length === 0) return '';


    if (!columnSeparator || columnSeparator.trim() == '') columnSeparator = ',';
    if (!arraySeparator || arraySeparator.trim() == '') arraySeparator = '|';
    columnSeparator = columnSeparator.trim();
    arraySeparator = arraySeparator.trim();
    if(columnSeparator == arraySeparator) {
        columnSeparator = ',';
        arraySeparator = '|';
    }

    const flattenItem = (item: any, spreadArrays: boolean): any => {
        const flatItem: any = {};
        for (const key in item) {
            if (item[key] != null && item[key] != undefined) {
                if (Array.isArray(item[key])) {
                    if (spreadArrays) {
                        item[key].forEach((value: any, index: number) => {
                            flatItem[`${key}[${index}]`] = value;
                        });
                    } else {
                        flatItem[key] = item[key].join('|');
                    }
                } else {
                    flatItem[key] = item[key];
                }
            }
        }
        return flatItem;
    }
    
    const flattenedItems = items.map(item => flattenItem(item, spreadArrays));
    const headers = Array.from(new Set(flattenedItems.flatMap(obj => Object.keys(obj))));
    const csvItems = [];

    csvItems.push(headers.join(columnSeparator));

    flattenedItems.forEach((item: any) => {
        const rowData = [];
        for (const header of headers) {
            rowData.push(item[header] || '');
        }
        csvItems.push(rowData.join(columnSeparator));
    });

    const csvContent = csvItems.join('\n');

    return csvContent;
}
