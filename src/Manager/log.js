const knex = require('knex')
const fs = require('fs')

const pathToLog = __dirname+'/../files/log.json'

class LogManager{
    constructor(options,tableName){
        this.database = knex(options)
        this.tableName = tableName
    }

    add = async (obj) => {
        // let tableExist = await this.database.schema.hasTable(this.tableName)
        // if(!tableExist){
        //     await this.database.schema.createTable(this.tableName,table =>{
        //         table.increments('id')
        //         table.string('email').nullable(false)
        //         table.string('date').nullable(false)
        //         table.string('message').nullable(false)
        //     })
        // }
        // await this.database.from(this.tableName).insert(obj)

        if(fs.existsSync(pathToLog)){
            let data = await fs.promises.readFile(pathToLog,'utf-8')
            let logs = JSON.parse(data)
            logs.push(obj)
            await fs.promises.writeFile(pathToLog,JSON.stringify(logs,null,2))
            return{status:'success',message:'log added'}
        }
        await fs.promises.writeFile(pathToLog,JSON.stringify([obj],null,2))

        return{status:'success',message:'log added'}
    }

    get = async () => {
        // let tableExist = await this.database.schema.hasTable(this.tableName)
        // if(tableExist){
        //     let results = await this.database.from(this.tableName).select('*')
        //     let log = JSON.parse(JSON.stringify(results))
        //     return{status:'success',payload:log}
        // }

        if(fs.existsSync(pathToLog)){
            let data = await fs.promises.readFile(pathToLog,'utf-8')
            let logs = JSON.parse(data)
            return {status:'success',payload:logs}
        }
        return{status:'success',message:'no messages to show'}
    }
}

module.exports = LogManager
