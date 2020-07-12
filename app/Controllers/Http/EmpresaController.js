'use strict'
const Empresa = use('App/Models/Empresa')

const mongoose = require('mongoose');

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

    //const _product_id = `ObjectId("${data.product_id}")`;

    await this.mongoDBConnect();

    // {empresa_id:1,"products._id":ObjectId("5f081ac18c25cfdd7eb8661e")},
    // {$set:{"products.$.price":200,"products.$.name":"perro"}}

    // product_id: "ObjectId("5f081ac18c25cfdd7eb8661e")"
    // const empresita = await EmpresaMongo.find({'products._id':data.product_id});
    // const empresita = await EmpresaMongo.find({'products._id':"5f081ac18c25cfdd7eb8661e"});
    // const empresita = await EmpresaMongo.find({'products._id':'ObjectId("5f081ac18c25cfdd7eb8661e")'});
    // const empresita = await EmpresaMongo.find({'products._id':data.product_id});
    // const empresita = await EmpresaMongo.find({empresa_id:data.empresa_id});

/*
    return response.json({
      'product_id':data.product_id,
      'empresa':empresita
    });
*/

    return await EmpresaMongo.updateOne(
      {empresa_id:data.empresa_id, "products._id":data.product_id},
      {$set:
          {
            "products.$.price":data.product_price,
            "products.$.name":data.product_name.toUpperCase()
          }
      }
    )

/*
    return await EmpresaMongo.update(
      {empresa_id:data.empresa_id,'products.productId':_product_id},
      {'$set':
          {
            'products.$.price':data.price,
            'products.$.name':data.product_name.toUpperCase()
          }
      },
      {arrayFilters:
          [
            { 'productId' : _product_id }
          ]
      }
    );
*/


/*
    return await EmpresaMongo.update(
      {empresa_id:data.empresa_id,'products.productId':_product_id},
      {'$set':
          {
            'products.$.price':data.price,
            'products.$.name':data.product_name.toUpperCase()
          }
      },
      { arrayFilters: [ {'products.productId':_product_id} ]}
    );
*/

    const products = await EmpresaMongo.find({empresa_id:data.empresa_id},{products: 1});

    return response.status(200).json(products);

  }

  async deleteProduct({request,response}){

    const data = await request.all();

    await this.mongoDBConnect();

  }

}

module.exports = EmpresaController
