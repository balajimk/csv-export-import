export const importFromCSV = (csv: string, hasHeader: boolean = true, hasTitle: boolean = false, includeLineInfo: boolean = false): any => {
    const lines = csv.split('\n');
    const title = hasTitle ? lines[0] : null;
    const headerIndex = hasHeader ? (hasTitle ? 1 : 0) : null;
    const headerLine = headerIndex != null ? lines[headerIndex] : null;
    var headers = headerIndex != null ? lines[headerIndex].split(',') : null;
    const dataIndex = (hasTitle ? 1 : 0) + (hasHeader ? 1 : 0);
    const dataLines = lines.slice(dataIndex);
    const allData = [];
    dataLines.forEach((line, lineIndex) => {
        if (line == '') return;
        const lineColumns = line.split(',');
        headers = headers ? headers : Array.apply(null, { length: lineColumns.length}).map((_, idx : number) => `col${idx + 1}`);
        const newData = {};
        if (includeLineInfo) {
            newData['_datalinenumber'] = lineIndex + 1;
            newData['_csvlinenumber'] = lineIndex + 1 + dataIndex;
            newData['_line'] = line;
        }
        headers.forEach((header, index) => {
            header = header.trim();
            if (hasHeader && header.trim().endsWith('[]')) {
                // Piped Array Item.
                const headerName = header.trim().slice(0, -2);
                var values = [];
                if (lineColumns[index] != "") values = lineColumns[index].split('|');
                values = values.filter(v => v.length > 0);
                newData[headerName] = values;
            } else if (hasHeader && header.includes('[') && header.includes(']')) {
                // Spread Array Item
                const headerName = header.slice(0, header.indexOf('['));
                const value = lineColumns[index];
                if (!newData[headerName]) newData[headerName] = [];
                if (value && value.trim() != "") newData[headerName].push(value);
            } else {
                // Simple item
                newData[header] = lineColumns[index];
            }
        });
        allData.push(newData);
    });
    return { 'title': title, 'header': headerLine, 'data': allData };
}
