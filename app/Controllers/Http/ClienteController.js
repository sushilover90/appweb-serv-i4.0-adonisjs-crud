'use strict'
const Cliente = use('App/Models/Cliente');

class ClienteController {

  async register({request,response}){

    const data = await request.all();

    let cliente = new Cliente();

    cliente.name = data.name;
    cliente.last_name = data.last_name;
    cliente.address = data.address;
    cliente.empresa = data.empresa;

    if(cliente.save())
    {
      return response.status(200).json({
        status:'OK',
        message:'El cliente ha sido registrado(a) correctamente.'
      });
    }

    return response.status(500).json({
      status:'FAILED',
      message: 'Hubo un error al tratar de registrar al cliente. Intente más tarde.'
    });

  } // async register() end


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

      const cliente = await Cliente.find(data.id);

      if(cliente === null)
      {
        return response.status(404).json({
          status:'FAILED',
          message: 'El cliente buscado no existe.'
        });
      }

      return cliente;

    }

    // return all clients if request has no body
    return Cliente.all();

  }

}

module.exports = ClienteController
