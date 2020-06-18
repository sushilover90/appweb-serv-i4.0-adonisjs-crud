'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Empresa extends Model {
  clientes()
  {
    return this.hasMany(
      'App/Models/Cliente','id','empresa');
  }
}

module.exports = Empresa
