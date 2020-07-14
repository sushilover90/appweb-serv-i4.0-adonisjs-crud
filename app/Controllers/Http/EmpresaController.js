'use strict'
const Empresa = use('App/Models/Empresa')

const mongoose = require('mongoose');
const { validate } = use('Validator');

let Schema =  mongoose.Schema;

let EmpresaSchema =  new Schema({
  _id: Schema.Types.ObjectId,
  empresa_id: Schema.Types.Number,
  products: Schema.Types.Array
});

let EmpresaMongo = mongoose.model('empresas',EmpresaSchema);


let ProductSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  price: Number
});

let ProductMongo = mongoose.model('product',ProductSchema);

class EmpresaController {

  async mongoDBConnect(){

    await mongoose.connect('mongodb://127.0.0.1:27017/ejercicio_crud', {useNewUrlParser: true, useMongoClient: true});

  }

  // register empresa
  async register({request,response})
  {

    const data = await request.all();

    const validation = await validate(data,{
      name: 'required|min:3|max:30',
      address: 'required|min:3|max:300'
    });

    if(validation.fails())
    {

      return response.status(400).json(validation.messages());

    }

    let empresa = await Empresa.create({
      name : data.name.toUpperCase(),
      address : data.address.toUpperCase()
    });

    let empresaMongo = await this.registerMongo(empresa.id);

    return response.status(200).json({
      status:'OK',
      message:'La empresa ha sido registrada correctamente.',
      data:{
        empresa: empresa,
        empresa_document: empresaMongo
      }
    });

    /*
    if(empresa.save())
    {

      return response.status(200).json({
          status:'OK',
          message:'La empresa ha sido registrada correctamente.',
          empresa: empresa.id
        });
    }

    return response.status(500).json({
      status:'FAILED',
      message: 'Hubo un error al tratar de registrar la empresa. Intente más tarde.'
    });

     */

  } // async register() end

  async update({request, response}){

    const data = await request.all();

    let empresa = await Empresa.find(data.id);

    //100049118029382

    // unchaged empresa properties previous update
    const _empresa = {
      id: empresa.id,
      name: empresa.name,
      address: empresa.address,
      created_at: empresa.created_at,
      updated_at: empresa.updated_at
    }

    // assigning the new values of the user properties to update
    empresa.name = data.name.toUpperCase();
    empresa.address = data.address.toUpperCase();

    // try to update the enterprise
    if(empresa.save())
    {
      return response.status(200).json(
        {
          before:_empresa,
          after:empresa
        }
      );
    }

  } // async update() end

  // delete the enterprise
  async delete({request,response}){

    let data = await request.all();

    const empresa = await Empresa.find(data.id);

    if(empresa.delete())
    {

      this.deleteMongo(data.id);

      return response.status(200).json({
        status:'STATUS',
        message:'Se borró la empresa correctamente.'
      });
    }

    return response.status(500).json({
      status:'FAILED',
      message:'Hubo un error al tratar de borrar la empresa. Intente más tarde.'
    });

  } // async delete() end

  // get empresas
  async get({request,response})
  {

    if(request.hasBody()){

      const data = await request.all();

      if(data.id === '' || data.id === null || data.id === undefined)
      {
        return response.status(400).json({
          status:'FAILED',
          message: 'Verifique sus parametros de busqueda e intente nuevamente.'
        });

      }

      const empresa = await Empresa.find(data.id);

      if(empresa === null)
      {
        return response.status(404).json({
          status:'FAILED',
          message: 'El empresa buscado no existe.'
        });
      }

      return empresa;

    }

    // return all enterprises if request has no body
    return await Empresa.all();


  }

  async registerMongo(empresa_id){

    await this.mongoDBConnect()

    let empresa = await new EmpresaMongo(
      {
        empresa_id:empresa_id,
        _id: new mongoose.Types.ObjectId()
      }
    );

    await empresa.save();

    return empresa;

  }

  async deleteMongo(empresa_id){

    await this.mongoDBConnect();

    return await EmpresaMongo.findOneAndRemove({empresa_id:empresa_id});

  }

  async getMongo(empresa_id=null){

    await this.mongoDBConnect();

    if(empresa_id===null){

      return await EmpresaMongo.find();

    }

    return await EmpresaMongo.find({empresa_id:empresa_id});

  }

  async getProducts({request,response}){

    const data = await request.all();

    await this.mongoDBConnect();

    const empresa = await this.getMongo(data.empresa_id);

    return response.status(200).json(empresa[0].products);

  }

  async registerProduct({request,response}){

    const data = await request.all();

    await this.mongoDBConnect();

    let product = await new ProductMongo(
      {
        _id: new mongoose.Types.ObjectId(),
        price: data.product_price,
        name: data.product_name.toUpperCase()
      }
    );

    await EmpresaMongo.update(
      {empresa_id:data.empresa_id},
      {$push:{products : product}}
    );

    return response.status(200).json(product);

  }

  async updateProduct({request, response}) {

    const data = await request.all();

    await this.mongoDBConnect();

    return await EmpresaMongo.update(
      {"empresa_id":data.empresa_id, "products._id":mongoose.Types.ObjectId(data.product_id)},
      {$set:
          {
            "products.$.name":data.product_name.toUpperCase(),
            "products.$.price":data.product_price
          }
      }
    )

  }

  async deleteProduct({request,response}){

    const data = await request.all();

    await this.mongoDBConnect();

    return await EmpresaMongo.update(
      {empresa_id:data.empresa_id},
      {
        $pull: { products : {
            _id: mongoose.Types.ObjectId(data.product_id)
          }
        }
      }
    )

  }
  // navigation drawer
  // login (como robosam)

}

module.exports = EmpresaController
