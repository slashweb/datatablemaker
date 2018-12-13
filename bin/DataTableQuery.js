'use strict'

export class DataTableMaker {
  constructor(searchable = '', sortable = '-id', instance, populateInstances = '', populateFields = '') {
    this.searchable = searchable;
    this.sortable = sortable;
    this.instance = instance;
    this.populateInstances = populateInstances;
    this.populateFields = populateFields;
    this.commonParams = ['pageNo', 'hitsPerPage', 'search', 'sort', 'totalResults', 'selectFields', 'sortable'];
    this.deletedAtProperty = false;
  }

  // Función para que cuando se ejecute una consulta obtenga o no los datos eliminados
  // si se manda a llamar si obtendrá los registros eliminados
  setDeletedAtProperty () {
    this.deletedAtProperty = true;
  }

  getResultsWithParamsDefined(params) {
    let queryObject = { '$or': [], '$and': []};

    let {hitsPerPage = 10, pageNo = 0, search, selectFields = ''} = params;
    // Las peticiones mandan con una página superior
    // por lo que es necesario descontar una página para
    // poder mostrar los resultados
    if (pageNo > 0) {
      pageNo --;
    }

    if (search) {

      let searchable = this.searchable.map(searchItem => {
        return { [searchItem]: { "$regex": search, "$options": "i"}}
      })

      searchable.forEach(searchableCriteria => {
        console.log('criteria', searchableCriteria)
        queryObject['$or'].push(searchableCriteria);
      })

    } else {
      queryObject = {}
    }

    // Este bloque es para cuando se quiere filtrar por un parámetro
    // determinado que viene en la url, poder cacharlo y aplicar la
    // considición a la consulta
    Object.keys(params).map(param => {
      if (!this.commonParams.includes(param)) {

        // Verificar que el objeto query contenga las condiciones tipo and
        if (!queryObject['$and']) {
          queryObject['$and'] = []
        }

        queryObject['$and'].push({
          [param]: params[param]
        })
      }
    })

    // Bloque para obtener registros no eliminados
    if (!this.deletedAtProperty) {
      if (!queryObject['$and']) {
        queryObject['$and'] = []
      }

      queryObject['$and'].push({
        deletedAt: null
      })
    }

    console.log('Query object', queryObject)
    return new Promise((resolve, reject) => {
      this.instance.count(queryObject)
        .exec((err, count) => {

          this.instance.find(queryObject)
            .limit(parseInt(hitsPerPage))
            .skip(parseInt(hitsPerPage) * pageNo)
            .select( selectFields )
            .populate(this.populateInstances, this.populateFields)
            .sort(this.sortable)
            .exec((err, results) => {

              const meta = {
                hitsPerPage,
                // La página se debe regresar con el incremento correspondiente
                // para no generar problemas en el front
                pageNo: pageNo + 1,
                totalResults: count
              }

              resolve({
                results,
                meta
              })
            })

        })
    })

  }
}
