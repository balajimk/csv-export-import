export const importFromCSV = (csv: string): any => {
    const lines = csv.split('\n');
    const headers = lines[0].split(',');
    const dataLines = lines.slice(1);

    const allData = [];
    dataLines.forEach(line => {
        const lineColumns = line.split(',');
        const newData = {};
        headers.forEach((header, index) => {
            header = header.trim();
            if (header.trim().endsWith('[]')) {
                // Piped Array Item.
                const headerName = header.trim().slice(0, -2);
                var values = [];
                if (lineColumns[index] != "") values = lineColumns[index].split('|');
                values = values.filter(v => v.length > 0);
                newData[headerName] = values;
            } else if (header.includes('[') && header.includes(']')) {
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
    return (allData);
}
