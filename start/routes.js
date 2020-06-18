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

/* Cliente routes */
Route.post('cliente/register','ClienteController.register').middleware(['auth']);
Route.get('cliente/get','ClienteController.get').middleware(['auth']);
Route.patch('cliente/update','ClienteController.update').middleware(['auth']);
Route.delete('cliente/delete','ClienteController.delete').middleware(['auth']);

/* return data received for testing */
Route.post('test/return',({request})=>{
  return request.body;
});

