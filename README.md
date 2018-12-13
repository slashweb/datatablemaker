# datatablemaker
DataTableMaker
La clase DataTableMaker te permite obtener la información de un modelo en específico, haciendo peticiones del lado del servidor, lo cuál te ofrece mayor velocidad, ya que obtiene simplemente los datos que se necesitan, permitiendo ordenar, y buscar.

IMPORTANDO LA CLASE
Esta línea obtiene la clase para la realización de las tablas del lado del servidor.
import {DataTableMaker} from "../helpers/DataTableQueryMaker";
NOTA: El llamado de la clase depende de la altura donde se encuentre el proyecto.

CAMPOS DE BÚSQUEDA EN RELACIÓN
La variable searchable, recibe los campos que se tienen en la relación a la cuál se le hará el populate.
const searchable = ['fname', 'lname', 'email'];

LLAMANDO EL OBJETO DATATABLE
Se llama el objeto DataTableMaker con el constructor que recibe los parámetros searchable, sortable, y un esquema.
const dataTableObj = new DataTableMaker(searchable, req.query.sortable, UserSchema);
Definición del constructor:
•	Searchable. Ca

dataTableObj.getResultsWithParamsDefined(req.query)
  .then(obj => {
    return res.send(obj).status(200);
  })


constructor(searchable = '', sortable = '-id', instance, populateInstances = '', populateFields = '') {
  this.searchable = searchable;
  this.sortable = sortable;
  this.instance = instance;
  this.populateInstances = populateInstances;
  this.populateFields = populateFields;
  this.commonParams = ['pageNo', 'hitsPerPage', 'search', 'sort', 'totalResults', 'selectFields', 'sortable'];
  this.deletedAtProperty = false;
}


setDeletedAtProperty () {
  this.deletedAtProperty = true;
}


getResultsWithParamsDefined(params)
