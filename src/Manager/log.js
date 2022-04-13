const knex = require('knex')

class LogManager{
    constructor(options,tableName){
        this.database = knex(options)
        this.tableName = tableName
    }

    add = async (obj) => {
        let tableExist = await this.database.schema.hasTable(this.tableName)
        if(!tableExist){
            await this.database.schema.createTable(this.tableName,table =>{
                table.increments('id')
                table.string('email').nullable(false)
                table.string('date').nullable(false)
                table.string('message').nullable(false)
            })
        }
        await this.database.from(this.tableName).insert(obj)
        return{status:'success',message:'log added'}
    }

    get = async () => {
        let tableExist = await this.database.schema.hasTable(this.tableName)
        if(tableExist){
            let results = await this.database.from(this.tableName).select('*')
            let log = JSON.parse(JSON.stringify(results))
            return{status:'success',payload:log}
        }
        return{status:'success',message:'no messages to show'}
    }
}

module.exports = LogManager
