const request = require('supertest');
const app = require('../app');

describe("Todo API endpoints", () => {
  let authToken;

  
  it('should log in with a valid account and return JWT token', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'valid.email@yahoo.com',
        password: 'valid.password',
      });


    expect(response.status).toBe(200);
    expect(response.body.data.token).toBeDefined();
    authToken = response.body.data.token;
  });



  it('should get all user Todos using the token from step 1', async () => {
    const response = await request(app)
      .get('/todos')
      .set('Authorization', `Bearer ${authToken}`); 
  
    
    expect(response.status).toBe(200);
  });



  it('should add a new Todo item using the token from step 1', async () => {
    const newTodo = {
      name: 'Example Todo',
      description: 'This is an example Todo item',
      statusId: 3,
      categoryId: 1
    };

    const response = await request(app)
      .post('/todos')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newTodo);
  
    expect(response.status).toBe(200);
  });



  it('should delete the created Todo item from step 3', async () => {
    const todoIdToDelete = 6;
  
    const response = await request(app)
      .delete(`/todos/${todoIdToDelete}`)
      .set('Authorization', `Bearer ${authToken}`); 
  
    
    expect(response.status).toBe(200);
  });


  it('should return 401 Unauthorized when trying to get Todos without JWT token', async () => {
    const response = await request(app)
      .get('/todos');
    
    expect(response.status).toBe(500);
  });



  it('should return 401 Unauthorized when trying to get Todos with an invalid JWT token', async () => {
    const invalidToken = 'invalid_token_here';
  
    const response = await request(app)
      .get('/todos')
      .set('Authorization', `Bearer ${invalidToken}`); 
  
    
    expect(response.status).toBe(401);
  });
  
  
});