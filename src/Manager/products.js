const knex = require('knex')

class ProductManager{
    constructor(options,tableName){
        this.database = knex(options)
        this.tableName = tableName
    }

    get = async () => {
        let tableExist = await this.database.schema.hasTable('products')
        if(tableExist){
            let results = await this.database.from(this.tableName).select('*')
            let products = JSON.parse(JSON.stringify(results))
            return {status:'success',payload:products}
        }
        return{status:'success',message:'table doesnt exist'}
    }

    add = async (product) => {
        let tableExist = await this.database.schema.hasTable('products')
        if(!tableExist){
            await this.database.schema.createTable('products',table => {
                table.increments('id')
                table.string('title').nullable(false)
                table.string('thumbnail').nullable(false)
                table.float('price')
            })
        }
        await this.database.from(this.tableName).insert(product)
        return{status:'success',message:'product added'}
    }
}

module.exports = ProductManager


