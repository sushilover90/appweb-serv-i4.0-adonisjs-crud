'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

/* User routes */
Route.post('user/register','UserController.register');
Route.post('user/login','UserController.login');
Route.patch('user/update','UserController.update').middleware(['auth']);

/* Empresa routes */
Route.post('empresa/register','EmpresaController.register').middleware(['auth']);
Route.get('empresa/get','EmpresaController.get').middleware(['auth']);
Route.patch('empresa/update','EmpresaController.update').middleware(['auth']);
Route.delete('empresa/delete','EmpresaController.delete').middleware(['auth']);


Route.get('empresa/getmongo','EmpresaController.getMongo').middleware(['auth']);
Route.post('empresa/registermongo','EmpresaController.registerMongo').middleware(['auth']);

/* Product Routes */
Route.post('producto/get','EmpresaController.getProducts').middleware(['auth']);
Route.post('producto/register','EmpresaController.registerProduct').middleware(['auth']);
Route.patch('producto/update','EmpresaController.updateProduct').middleware(['auth']);
Route.delete('producto/delete','EmpresaController.deleteProduct').middleware(['auth']);

/* return data received for testing */
Route.post('test/return',({request})=>{
  return request.body;
});

