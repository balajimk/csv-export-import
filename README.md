# CSV Export Import | csv-export-import | Basic to Advanced

## Purpose
csv-export-import can export Typescript/JavaScript data objects into CSV format and import CSV string back to data objects.

## Installation
```javascript
npm install --save 'csv-export-import'
```

## exportToCSV(): Returns CSVContent as a string
Exporting objects into CSV involves leveraging the extensive configuration possibilities to manipulate data and generate various outputs according to specific requirements. 
```
const exportedCSV = exportToCSV(usersData, propertiesConfiguration)
console.log(exportedCSV);
```
| Parameter Name           | Description |
| ------------------------ | ----------------------------------------------------------------------------------------------------------- |
| items                    | The Array data to be exporeted into a CSV content. |
| configProeprties         | IConfigProperty[]. Properties configuration. This configuration defines what needs to be exported to csv. |
| exportConfig             | IExportConfiguration. To configure the Export. |
| dependentData            | Any supporting data needed for export. Ideally used by the developer to use them in the generateExportDataFn. |

## importFromCSV(): Returns an object with { title: string, data: any }
Importing data from CSV string into data objects doesn't need any configuration at all.
The method by default assumes that Header line exists and Title line doesn't exist. They can be changed as the second and third parameter to the method.
```
const importedData = importFromCSV(exportedCSV, true, false);
console.log(importedData);
```
| Parameter Name   | Description |
| ---------------- | ------------------------------------------------------------------------------------------------ |
| csv              | CSV content to import. |
| hasHeader        | Default: true. Flag to set if CSV contains a Header line. |
| hasTitle         | Default: false. Flag to set if CSV contains a Title line. |


## IConfigProperty Properties (For Export Only)
| Property Name           | Description |
| ----                    | ------- |
| `header`                | Column header to be displayed on the header.  |
| `property`              | Property to be used to read the value from the data object. If a value is provided, the same is used to get the data. If generateExportDataFn function is also given, the value will be passed as the first parameter to the function call. if generateExportDataFn is used, this property can be ignored. |
| `isArray`               | Default: False. To identify if the data read is an array. If this is not specified and the data is an array, this will be automatically cxonsidered an array and the values are joined using a pipe symbol by default. |
| `spread`                | Default: False. If this set the array properties will be spread to multiple columns. Look at the examples above. |
| `order`                 | Column order. Anything repeated will be ordered within that order. |
| `generateExportDataFn`  | A developer defined Function to read the data.  |

## IExportConfiguration Properties (For Export Only)
```
const exportConfiguration: IExportConfiguration = {
  "title": 'Is this the coolest CSV export package?]',
  "includeHeader": true,
  "columnSeparator": ',',
  "arraySeparator": '|',
  "sorroundValuesByString": '',
  "removePipedArrayHeaderBrackets": false
};
```
| Property Name                    | Description |
| ----                             | ------- |
| `title`                          | Default is null. This is a single row above the header. Set it to null, if not needed. Anything other than null will include a new top row with the provided text. |
| `includeHeader`                  | Default: True. To include th eheader row or not.  |
| `columnSeparator`                | Default: ',' (comma character). Character/string to use as columns separator. |
| `arraySeparator`                 | Default: '|' (Pipe character). Character/string to use as array separator. |
| `sorroundValuesByString`         | Default: ''. Any Character or String to prefix and suffix with columns values. |
| `removePipedArrayHeaderBrackets` | Default: false. When isArray = true and spread = false, the header will by default be suffixed '[]' to identify the column as array for import purpose. Set it to false to remove it. |

## Usage
we will assume the following data for the examples:
```typescript
// Original Data from Business APIs
// Users' Data
const usersData = [
  {"id":1,"firstname":"Fuentes","lastname":"Tran","gender":"male","email":"fuentestran@enaut.com",
    "tags":["enim","ad"],"scores":[90, 80, 70, 60, 75],"roleId":3,"orgId":1001},
  {"id":2,"firstname":"Ramona","lastname":"Vargas","gender":"female","email":"ramonavargas@enaut.com",
    "tags":["nisi"],"scores":[19,31],"roleId":2,"orgId":1003},
  {"id":3,"firstname":"Barbra","lastname":"Gilmore","gender":"female","email":"barbragilmore@enaut.com",
    "tags":[],"scores":[33,42],"roleId":2,"orgId":1003},
  {"id":4,"firstname":"Cruz","lastname":"Ashley","gender":"male","email":"cruzashley@enaut.com",
    "tags":["aute"],"scores":[33, 45, 50],"roleId":3,"orgId":1002},
  {"id":5,"firstname":"Rosemary","lastname":"Hart","gender":"female","email":"rosemaryhart@enaut.com",
    "tags":[],"scores":null,"roleId":2,"orgId":1003}
];

// Organisation List Data
const organisations = [
  {id: 1001, name: 'Microsoft'},
  {id: 1002, name: 'Google'},
  {id: 1003, name: 'Pacom'},
];

// Roles List Data
const roles = [
  {id: 1, name: 'Administrator'},
  {id: 4, name: 'Manager'},
  {id: 5, name: 'Staff-Eng'},
];

```

### Config Type 1: Basic Export
```typescript
import { exportToCSV, IConfigProperty, IExportConfiguration } from "csv-export-import";

//  Configuration for Export three columns from the data.
const propertiesConfiguration: IConfigProperty[] = [
  {
    header: 'Id',
    property: 'id',
    order: 1
  },
  {
    header: 'First Name',
    property: 'firstname',
    order: 2
  },
  {
    header: 'Last Name',
    property: 'lastname',
    order: 3
  },
  {
    header: 'Organisation',
    property: 'orgId',
    order: 5
  },
  {
    header: 'Role',
    property: 'roleId',
    order: 4
  }
];

console.log(exportToCSV(usersData, propertiesConfiguration));
```
#### Config Type 1: Output
Let's import 5 columns
```
Export Data As CSV
Id,First Name,Last Name,Role,Organisation
1,Fuentes,Tran,3,1001
2,Ramona,Vargas,2,1003
3,Barbra,Gilmore,2,1003
4,Cruz,Ashley,3,1002
5,Rosemary,Hart,2,1003
```
### Config Type 2: Export with function generated using the property value itself
```typescript
import { exportToCSV, IConfigProperty, IExportConfiguration } from "csv-export-import";

//  Configuration for Export three columns from the data.
const propertiesConfiguration: IConfigProperty[] = [
  {
    header: 'Id',
    property: 'id',
    order: 1
  },
  {
    header: 'First Name',
    property: 'firstname',
    order: 2
  },
  {
    header: 'Last Name',
    property: 'lastname',
    order: 3
  },
  {
    header: 'Organisation',
    property: 'orgId',
    order: 5
  },
  {
    header: 'Role',
    property: 'roleId',
    order: 4
  },
  {
    header: 'ScoreCount',
    property: 'scores',
    order: 6,
    generateExportDataFn: (property) => property ? property.length : 0,
  }
];

console.log(exportToCSV(usersData, propertiesConfiguration));
```
Notice the ScoreCount property. The GenerateExportDataFn receives the property's value (in this case scores values which is an array) itself as an input.
The function returns the length if the property is not null.
> [!IMPORTANT]
> Developer must always consider using appropriate null checks in the generateExportDataFn implementation to avoid any unexpected runtime errors.
#### Config Type 2: Output
```
Export Data As CSV
Id,First Name,Last Name,Role,Organisation,ScoreCount
1,Fuentes,Tran,3,1001,5
2,Ramona,Vargas,2,1003,2
3,Barbra,Gilmore,2,1003,2
4,Cruz,Ashley,3,1002,3
5,Rosemary,Hart,2,1003,0
```
### Config Type 3: Export with function generated using ANY properties in the individual object itself.
```typescript
import { exportToCSV, IConfigProperty, IExportConfiguration } from "csv-export-import";

//  Configuration for Export three columns from the data.
const propertiesConfiguration: IConfigProperty[] = [
  {
    header: 'Id',
    property: 'id',
    order: 1
  },
  {
    header: 'First Name',
    property: 'firstname',
    order: 2
  },
  {
    header: 'Last Name',
    property: 'lastname',
    order: 3
  },
  {
    header: 'Organisation',
    property: 'orgId',
    order: 5
  },
  {
    header: 'Role',
    property: 'roleId',
    order: 4
  },
  {
    header: 'ScoreCount',
    property: 'scores',
    order: 6,
    generateExportDataFn: (property) => property ? property.length : 0,
  },
  {
    header: 'Full Name',
    generateExportDataFn: (_, item) => item ? `${item.firstname} ${item.lastname}` : '',
    order: 7
  },
];
console.log(exportToCSV(usersData, propertiesConfiguration));
```
Notice the FullName config without the 'property'. The GenerateExportDataFn receives both the property and item (in this case the user object) as an input.
We have used _ to ignore the property parameter but one can always use them too, if needed.
The function returns the Fullname by concatenating item's firstname and lastname properties.
#### Config Type 3: Output
```
Export Data As CSV
Id,First Name,Last Name,Role,Organisation,ScoreCount,Full Name
1,Fuentes,Tran,3,1001,5,Fuentes Tran
2,Ramona,Vargas,2,1003,2,Ramona Vargas
3,Barbra,Gilmore,2,1003,2,Barbra Gilmore
4,Cruz,Ashley,3,1002,3,Cruz Ashley
5,Rosemary,Hart,2,1003,0,Rosemary Hart
```
### Config Type 4: Export with index property.
```typescript
import { exportToCSV, IConfigProperty, IExportConfiguration } from "csv-export-import";

//  Configuration for Export three columns from the data.
const propertiesConfiguration: IConfigProperty[] = [
  {
    header: 'Id',
    property: 'id',
    order: 1
  },
  {
    header: 'First Name',
    property: 'firstname',
    order: 2
  },
  {
    header: 'Last Name',
    property: 'lastname',
    order: 3
  },
  {
    header: 'Organisation',
    property: 'orgId',
    order: 5
  },
  {
    header: 'Role',
    property: 'roleId',
    order: 4
  },
  {
    header: 'ScoreCount',
    property: 'scores',
    order: 6,
    generateExportDataFn: (property) => property ? property.length : 0,
  },
  {
    header: 'Full Name',
    generateExportDataFn: (_, item) => item ? `${item.firstname} ${item.lastname}` : '',
    order: 7
  },
  {
    header: 'S.No',
    generateExportDataFn: (x, y, index) => index + 1 + 5000,
    order: 0
  },
];
console.log(exportToCSV(usersData, propertiesConfiguration));
```
Notice how index property is used in GenerateExportDataFn to display the S.No column.
Also, note the order set to 0 to bring the column first.
Remember that index always starts from 0.
#### Config Type 4: Output
```
Export Data As CSV
S.No,Id,First Name,Last Name,Role,Organisation,ScoreCount,Full Name
5001,1,Fuentes,Tran,3,1001,5,Fuentes Tran
5002,2,Ramona,Vargas,2,1003,2,Ramona Vargas
5003,3,Barbra,Gilmore,2,1003,2,Barbra Gilmore
5004,4,Cruz,Ashley,3,1002,3,Cruz Ashley
5005,5,Rosemary,Hart,2,1003,0,Rosemary Hart
```
### Config Type 5: Export with Dependent data and complex generateExportDataFn.
When the data is too complex to display on its own and only makes sense with more dependent data, we use the DependencyData parameter.
```typescript
import { exportToCSV, IConfigProperty, IExportConfiguration } from "csv-export-import";

//  Configuration for Export three columns from the data.
const propertiesConfiguration: IConfigProperty[] = [
  {
    header: 'Id',
    property: 'id',
    order: 1
  },
  {
    header: 'First Name',
    property: 'firstname',
    order: 2
  },
  {
    header: 'Last Name',
    property: 'lastname',
    order: 3
  },
  {
    header: 'Organisation',
    property: 'orgId',
    order: 5
  },
  {
    header: 'Role',
    property: 'roleId',
    order: 4
  },
  {
    header: 'ScoreCount',
    property: 'scores',
    order: 6,
    generateExportDataFn: (property) => property ? property.length : 0,
  },
  {
    header: 'Full Name',
    generateExportDataFn: (_, item) => item ? `${item.firstname} ${item.lastname}` : '',
    order: 7
  },
  {
    header: 'S.No',
    generateExportDataFn: (x, y, index) => index + 1 + 5000,
    order: 0
  },
  {
    header: 'Organisation Name',
    property: 'orgId',
    generateExportDataFn: (property, item, index, deps) => {
    	if (!property || !deps) return '';
      if (!deps.organisations) return '';
    	const org = deps.organisations.find(o => o.id == property)
    	return org ? org.name : '';
    },
    order: 8
  },
  {
    header: 'Role Name',
    property: 'roleId',
    generateExportDataFn: (property, item, index, deps) => {
    	if (!property || !deps) return '';
    	if (!deps.organisations) return '';
    	const role = deps.roles.find(r => r.id == property);
      return role ? role.name : '';
    },
    order: 9
  }
];

const supportingData = {
  organisations: organisations,
  roles: roles
};
console.log(exportToCSV(usersData, propertiesConfiguration, null, supportingData));
```
Notice the multiple parameters of GenerateExportDataFn which now include the deps for dependencyData.
Also, note the the DepedencyData has been set in an object and passed to the exportToCSV method.
#### Config Type 5: Output
```
Export Data As CSV
S.No,Id,First Name,Last Name,Role,Organisation,ScoreCount,Full Name,Organisation Name,Role Name
5001,1,Fuentes,Tran,3,1001,5,Fuentes Tran,Microsoft,Staff-Eng
5002,2,Ramona,Vargas,2,1003,2,Ramona Vargas,Pacom,Manager
5003,3,Barbra,Gilmore,2,1003,2,Barbra Gilmore,Pacom,Manager
5004,4,Cruz,Ashley,3,1002,3,Cruz Ashley,Google,Staff-Eng
5005,5,Rosemary,Hart,2,1003,0,Rosemary Hart,Pacom,Manager
```
### Config Type 6: Export with isArray = true.
```typescript
import { exportToCSV, IConfigProperty, IExportConfiguration } from "csv-export-import";

//  Configuration for Export three columns from the data.
const propertiesConfiguration: IConfigProperty[] = [
  {
    header: 'Id',
    property: 'id',
    order: 1
  },
  {
    header: 'First Name',
    property: 'firstname',
    order: 2
  },
  {
    header: 'Last Name',
    property: 'lastname',
    order: 3
  },
  {
    header: 'Organisation',
    property: 'orgId',
    order: 5
  },
  {
    header: 'Role',
    property: 'roleId',
    order: 4
  },
  {
    header: 'ScoreCount',
    property: 'scores',
    order: 6,
    generateExportDataFn: (property) => property ? property.length : 0,
  },
  {
    header: 'Full Name',
    generateExportDataFn: (_, item) => item ? `${item.firstname} ${item.lastname}` : '',
    order: 7
  },
  {
    header: 'S.No',
    generateExportDataFn: (x, y, index) => index + 1 + 5000,
    order: 0
  },
  {
    header: 'Organisation Name',
    property: 'orgId',
    generateExportDataFn: (property, item, index, deps) => {
    	if (!property || !deps) return '';
      if (!deps.organisations) return '';
    	const org = deps.organisations.find(o => o.id == property)
    	return org ? org.name : '';
    },
    order: 8
  },
  {
    header: 'Role Name',
    property: 'roleId',
    generateExportDataFn: (property, item, index, deps) => {
    	if (!property || !deps) return '';
    	if (!deps.organisations) return '';
    	const role = deps.roles.find(r => r.id == property);
      return role ? role.name : '';
    },
    order: 9
  },
  {
    header: 'All Scores',
    property: 'scores',
    isArray: true,
    order: 10
  },
];

const supportingData = {
  organisations: organisations,
  roles: roles
};
console.log(exportToCSV(usersData, propertiesConfiguration, null, supportingData));
```
Notice the isArray properties set to the array property column and the values are piped in the result.
#### Config Type 6: Output
```
Export Data As CSV
S.No,Id,First Name,Last Name,Role,Organisation,ScoreCount,Full Name,Organisation Name,Role Name,All Scores[]
5001,1,Fuentes,Tran,3,1001,5,Fuentes Tran,Microsoft,Staff-Eng,90|80|70|60|75
5002,2,Ramona,Vargas,2,1003,2,Ramona Vargas,Pacom,Manager,19|31
5003,3,Barbra,Gilmore,2,1003,2,Barbra Gilmore,Pacom,Manager,33|42
5004,4,Cruz,Ashley,3,1002,3,Cruz Ashley,Google,Staff-Eng,33|45|50
5005,5,Rosemary,Hart,2,1003,0,Rosemary Hart,Pacom,Manager,
```
### Config Type 7: Export with isArray = true & spread: true.
```typescript
import { exportToCSV, IConfigProperty, IExportConfiguration } from "csv-export-import";

//  Configuration for Export three columns from the data.
const propertiesConfiguration: IConfigProperty[] = [
  {
    header: 'Id',
    property: 'id',
    order: 1
  },
  {
    header: 'First Name',
    property: 'firstname',
    order: 2
  },
  {
    header: 'Last Name',
    property: 'lastname',
    order: 3
  },
  {
    header: 'Organisation',
    property: 'orgId',
    order: 5
  },
  {
    header: 'Role',
    property: 'roleId',
    order: 4
  },
  {
    header: 'ScoreCount',
    property: 'scores',
    order: 6,
    generateExportDataFn: (property) => property ? property.length : 0,
  },
  {
    header: 'Full Name',
    generateExportDataFn: (_, item) => item ? `${item.firstname} ${item.lastname}` : '',
    order: 7
  },
  {
    header: 'S.No',
    generateExportDataFn: (x, y, index) => index + 1 + 5000,
    order: 0
  },
  {
    header: 'Organisation Name',
    property: 'orgId',
    generateExportDataFn: (property, item, index, deps) => {
    	if (!property || !deps) return '';
      if (!deps.organisations) return '';
    	const org = deps.organisations.find(o => o.id == property)
    	return org ? org.name : '';
    },
    order: 8
  },
  {
    header: 'Role Name',
    property: 'roleId',
    generateExportDataFn: (property, item, index, deps) => {
    	if (!property || !deps) return '';
    	if (!deps.organisations) return '';
    	const role = deps.roles.find(r => r.id == property);
      return role ? role.name : '';
    },
    order: 9
  },
  {
    header: 'All Scores',
    property: 'scores',
    isArray: true,
    spread: true,
    order: 10
  },
];

const supportingData = {
  organisations: organisations,
  roles: roles
};
console.log(exportToCSV(usersData, propertiesConfiguration, null, supportingData));
```
Notice the Array properties spread to multiple columns.
#### Config Type 7: Output
```
Export Data As CSV
S.No,Id,First Name,Last Name,Role,Organisation,ScoreCount,Full Name,Organisation Name,Role Name,All Scores[0],All Scores[1],All Scores[2],All Scores[3],All Scores[4]
5001,1,Fuentes,Tran,3,1001,5,Fuentes Tran,Microsoft,Staff-Eng,90,80,70,60,75
5002,2,Ramona,Vargas,2,1003,2,Ramona Vargas,Pacom,Manager,19,31,,,
5003,3,Barbra,Gilmore,2,1003,2,Barbra Gilmore,Pacom,Manager,33,42,,,
5004,4,Cruz,Ashley,3,1002,3,Cruz Ashley,Google,Staff-Eng,33,45,50,,
5005,5,Rosemary,Hart,2,1003,0,Rosemary Hart,Pacom,Manager,,,,,
```
