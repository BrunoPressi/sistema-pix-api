import { AppDataSource } from '../src/database/AppDataSource';
import { app } from '../src/app';
import request from 'supertest';
import { Usuario } from "../src/entities/Usuario";

let token: string;

beforeAll(async () => {
    await AppDataSource.initialize();

    await request(app)
        .post('/v1/usuarios')
        .send({
            id: 999,
            cpf_cnpj: "047.930.260-01",
            senha: 'teste123',
            nome_completo: "nome_teste",
            numero_conta: 1234,
            telefone: "996322831",
            rua: "rua_teste",
            bairro: "bairro_teste",
            cidade: "cidade_teste"
        })

    const res = await request(app)
        .post('/v1/auth')
        .send({
            cpf_cnpj: '047.930.260-01',
            senha: 'teste123'
        })
    token = res.body.token;
});

afterAll(async () => {
    await AppDataSource.getRepository(Usuario).deleteAll();
    await AppDataSource.destroy();
});

describe('GET v1/usuarios', function () {
   it('Buscar todos usuários', async function() {
     const res = await request(app)
         .get('/v1/usuarios')
         .set('Authorization', 'Bearer ' + token)
         .expect('Content-Type', /json/)
         .expect(200);
   });
});

describe('GET /v1/usuarios/id', function() {
    it('Buscar usuário com id existente', async function() {
        const res = await request(app)
            .get('/v1/usuarios/999')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.body.Usuario.nome_completo).toBe('nome_teste');
        expect(res.body.Usuario.cpf_cnpj).toBe('047.930.260-01');
        expect(res.body.Usuario.telefone).toBe('996322831');
        expect(res.body.Usuario.numero_conta).toBe(1234);
    });
});

describe('GET /v1/usuarios/id', function() {
    it('Buscar usuário com id inexistente', async function() {
        const res = await request(app)
            .get('/v1/usuarios/0')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(404);

        expect(res.body.errorMessage).toBe('Usuário |0| não encontrado.');
        expect(res.body.path).toBe('/v1/usuarios/0');
        expect(res.body.statusCode).toBe(404);
        expect(res.body.statusMessage).toBe('Not Found');
    });
});

describe('POST /v1/usuarios', function () {
   it('Adicionar novo usuário com dados válidos', async function() {
      const res = await request(app)
          .post('/v1/usuarios')
          .send({
              id: 99,
              cpf_cnpj: "603.866.600-18",
              senha: "John123",
              nome_completo: "John Doe",
              numero_conta: 4525,
              telefone: "999726854",
              rua: "Quadra 58",
              bairro: "Santo Antônio",
              cidade: "Teresina"
          })
          .expect('Content-Type', /json/)
          .expect(201);

      expect(res.body.Usuario.nome_completo).toBe('John Doe');
      expect(res.body.Usuario.cpf_cnpj).toBe('603.866.600-18');
      expect(res.body.Usuario.telefone).toBe('999726854');
       expect(res.body.Usuario.numero_conta).toBe(4525);
      expect(res.body.Usuario.rua).toBe('Quadra 58');
      expect(res.body.Usuario.bairro).toBe('Santo Antônio');
      expect(res.body.Usuario.cidade).toBe('Teresina');
   });
});

describe('POST /v1/usuarios', function () {
    it('Adicionar novo usuário com dados inválidos', async function() {
        const res = await request(app)
            .post('/v1/usuarios')
            .send({
                id: 99,
                cpf_cnpj: "123456",
                senha: "",
                nome_completo: "",
                numero_conta: 4525,
                telefone: "1234",
                rua: "",
                bairro: "",
                cidade: ""
            })
            .expect('Content-Type', /json/)
            .expect(400);

        expect(res.body.errors[0].msg).toBe('Insira um CPF ou CNPJ válido');
        expect(res.body.errors[1].msg).toBe('Sua senha deve ter mais de 5 caracteres.');
        expect(res.body.errors[2].msg).toBe('Seu nome deve ter mais de 3 caracteres.');
        expect(res.body.errors[3].msg).toBe('Insira um telefone válido (somente números - 9 caracteres).');
        expect(res.body.errors[4].msg).toBe('Campo rua não pode ser vázio.');
        expect(res.body.errors[5].msg).toBe('Campo bairro não pode ser vázio.');
        expect(res.body.errors[6].msg).toBe('Campo cidade não pode ser vázio.');

    });
});

describe('DELETE /v1/usuarios/id', function () {
   it('Deletar usuário existente', async function() {
       await request(app)
          .delete('/v1/usuarios/99')
           // Deletar o usuário 99 que está sendo criado no teste POST /v1/Usuario - Adicionar novo usuário com dados válidos,
           // se tentar deletar o usuário criado no beforeAll o teste GET /v1/usuarios/id - Buscar usuário com id existente,
           // não passará!
          .set('Authorization', 'Bearer ' + token)
          .expect(204)
   });
});

describe('DELETE /v1/usuarios/id', function() {
    it('Deletar usuário inexistente', async function() {
        const res = await request(app)
            .delete('/v1/usuarios/0')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(404);

        expect(res.body.errorMessage).toBe('Usuário |0| não encontrado.');
        expect(res.body.path).toBe('/v1/usuarios/0');
        expect(res.body.statusCode).toBe(404);
        expect(res.body.statusMessage).toBe('Not Found');
    });
});

describe('PATCH /v1/usuarios/id', function () {
    it('Atualizar usuário existente', async function() {
        const res = await request(app)
            .patch('/v1/usuarios/999')
            .set('Authorization', 'Bearer ' + token)
            .send({
                telefone: "996322831",
                senha: "JOHN4321",
                rua: "Avenida X",
                bairro: "Centro",
                cidade: "Passo Fundo"
            })
            .expect('Content-Type', /json/)
            .expect(200);
        expect(res.body.Usuario.nome_completo).toBe('nome_teste');
        expect(res.body.Usuario.cpf_cnpj).toBe('047.930.260-01');
        expect(res.body.Usuario.telefone).toBe('996322831');
        expect(res.body.Usuario.numero_conta).toBe(1234);
        expect(res.body.Usuario.senha).toBe('JOHN4321');
        expect(res.body.Usuario.rua).toBe('Avenida X');
        expect(res.body.Usuario.bairro).toBe('Centro');
        expect(res.body.Usuario.cidade).toBe('Passo Fundo');
    });
});

describe('PATCH /v1/usuarios/id', function() {
    it('Atualizar usuário inexistente', async function() {
        const res = await request(app)
            .patch('/v1/usuarios/0')
            .set('Authorization', 'Bearer ' + token)
            .send({
                telefone: "996322831",
                senha: "JOHN4321",
                rua: "Avenida X",
                bairro: "Centro",
                cidade: "Passo Fundo"
            })
            .expect('Content-Type', /json/)
            .expect(404);

        expect(res.body.errorMessage).toBe('Usuário |0| não encontrado.');
        expect(res.body.path).toBe('/v1/usuarios/0');
        expect(res.body.statusCode).toBe(404);
        expect(res.body.statusMessage).toBe('Not Found');
    });
});