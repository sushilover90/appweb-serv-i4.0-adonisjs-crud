'use strict'
const Empresa = use('App/Models/Empresa')

class EmpresaController {

  // register empresa
  async register({request,response})
  {

    const data = await request.all();

    let empresa = new Empresa();

    empresa.name = data.name.toUpperCase();
    empresa.address = data.address.toUpperCase();

    if(empresa.save())
    {
      return response.status(200).json({
          status:'OK',
          message:'La empresa ha sido registrada correctamente.'
        });
    }

    return response.status(500).json({
      status:'FAILED',
      message: 'Hubo un error al tratar de registrar la empresa. Intente más tarde.'
    });

  } // async register() end

  async update({request, response}){

    const data = await request.all();

    let empresa = await Empresa.find(data.id);

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
    return Empresa.all();

  }

}

module.exports = EmpresaController
