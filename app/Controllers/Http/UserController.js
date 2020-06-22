'use strict'
const User = use('App/Models/User');

class UserController {

  // register user
  async register({request, response}) {

    const data = await request.all();

    let user = new User();

    user.username = data.email.toLowerCase();
    user.email = user.username;
    user.password = data.password;

    // error/exception handling pending
    if (user.save()) {
      return response.status(200).json({
        status: 'OK',
        message: 'El usuario ha sido registrado exitosamente.'
      });
    }

    // here goes the type of error
    return response.status(500).json(
      {
        status: 'FAILED',
        // hardcoded error message
        message: 'Hubo un error al tratar de registrar al usuario. Intente más tarde.'
      }
    )

  } // async register() end

  async login({request, auth}){

    const { username , password } = await request.all();

    const _auth_info = await auth.withRefreshToken().attempt(username, password);

    if(_auth_info !== null)
    {
      return {user: username, auth: _auth_info}
    }

    return _auth_info;

  } // async login() end

  async update({request, response}){

    const data = await request.all();

    let user = await User.findBy('email',data.username);

    // unchaged user properties previous update
    const _user = {
      id: user.id,
      username: user.email,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at
    }

    // assigning the new values of the user properties to update
    user.username = data.new_email.toLowerCase();
    user.email = user.username;

    if(data.field2 !== '' || data.field2 !== null || true)
    {
      user.password = data.field2;
    }

    // try to update the user
    if(user.save())
    {

      return response.status(200).json(
        {
          before:_user,
          after:user
        }
      );
    }

  } // async update() end

  /*----------just for testing----------*/
  async get()
  {
    return User.all();
  }
  /*----------just for testing----------*/

  // delete the user
  async delete()
  {

  }

}

module.exports = UserController
