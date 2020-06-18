'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Cliente extends Model {
  empresa()
  {
    return this.belongsTo(
      'App/Models/Empresa','id','id');
  }

}

module.exports = Cliente
