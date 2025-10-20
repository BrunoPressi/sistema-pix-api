import { AppDataSource } from '../src/database/AppDataSource';
import { app } from '../src/app';
import request from 'supertest';
import { Usuario } from "../src/entities/Usuario";
import {Transacao} from "../src/entities/Transacao";
import { Chave } from "../src/entities/Chave";
import {TipoChave} from "../src/entities/enums/TipoChave";

let token: string;
let tokenExpirado: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMiwibm9tZUNvbXBsZXRvIjoiSm9obiBEb2UiLCJudW1lcm9Db250YSI6NDUyNSwiaWF0IjoxNzU5NDI5MDI4LCJleHAiOjE3NTk0MjkzMjh9.2PTJ7LmA5GDqynuRvbMyL_-Ef1U-MwdR0Xwgo02N02E';

beforeAll(async () => {
    await AppDataSource.initialize();

    await request(app)
        .post('/v1/usuarios')
        .send({
            id: 1000,
            cpf_cnpj: "127.027.040-00",
            senha: 'Bob123',
            nome_completo: "Bob Green",
            telefone: "997268541",
            rua: "rua_teste b",
            bairro: "bairro_teste c",
            cidade: "cidade_teste d"
        })

    await request(app)
        .post('/v1/usuarios')
        .send({
            id: 999,
            cpf_cnpj: "047.930.260-01",
            senha: 'teste123',
            nome_completo: "nome_teste",
            telefone: "996322831",
            rua: "rua_teste",
            bairro: "bairro_teste",
            cidade: "cidade_teste"
        })

    await AppDataSource
        .createQueryBuilder()
        .insert()
        .into(Chave)
        .values({
            id: 6000,
            tipo: 'telefone' as TipoChave.TELEFONE,
            chave: '999726854',
            usuario: { id: 1000 }
        })
        .execute();

    await AppDataSource
        .createQueryBuilder()
        .insert()
        .into(Chave)
        .values({
            id: 5000,
            tipo: 'email' as TipoChave.EMAIL,
            chave: 'email@email.com',
            usuario: { id: 999 }
        })
        .execute();

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
    await AppDataSource.getRepository(Chave).deleteAll();
    await AppDataSource.getRepository(Transacao).deleteAll();
    await AppDataSource.destroy();
});

describe('GET v1/usuarios', function () {
   it('Buscar todos usuários', async function() {
     await request(app)
         .get('/v1/usuarios')
         .set('Authorization', 'Bearer ' + token)
         .expect('Content-Type', /json/)
         .expect(200);
   });

    it('Requisição com token expirado', async function() {
        const res = await request(app)
            .get('/v1/usuarios')
            .set('Authorization', 'Bearer ' + tokenExpirado)
            .expect('Content-Type', /json/)
            .expect(401);

        expect(res.body.errorMessage).toBe('Token expirado');
        expect(res.body.statusCode).toBe(401);
        expect(res.body.statusMessage).toBe('Unauthorized');
    });

    it('Requisição sem token', async function() {
        const res = await request(app)
            .get('/v1/usuarios')
            .expect('Content-Type', /json/)
            .expect(401);

        expect(res.body.errorMessage).toBe('Insira um Token JWT.');
        expect(res.body.statusCode).toBe(401);
        expect(res.body.statusMessage).toBe('Unauthorized');
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
    });

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

    it('Tentativa de buscar informações de outro usuário', async function() {
        const res = await request(app)
            .get('/v1/usuarios/1000')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(401);

        expect(res.body.errorMessage).toBe('Voce não tem permissão para acessar esse recurso.');
        expect(res.body.statusCode).toBe(401);
        expect(res.body.statusMessage).toBe('Unauthorized');
    });
});

describe('POST /v1/usuarios', function () {
   it('Adicionar novo usuário com dados válidos', async function() {
      const res = await request(app)
          .post('/v1/usuarios')
          .send({
              cpf_cnpj: "603.866.600-18",
              senha: "John123",
              nome_completo: "John Doe",
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
      expect(res.body.Usuario.rua).toBe('Quadra 58');
      expect(res.body.Usuario.bairro).toBe('Santo Antônio');
      expect(res.body.Usuario.cidade).toBe('Teresina');
   });

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

    it('Adicionar novo usuário já cadastrado', async function() {
        const res = await request(app)
            .post('/v1/usuarios')
            .send({
                cpf_cnpj: "127.027.040-00",
                senha: "bob123",
                nome_completo: "Bob Green",
                numero_conta: 1000,
                telefone: "996322831",
                rua: "Quadra A",
                bairro: "Bairro A",
                cidade: "Cidade A"
            })
            .expect('Content-Type', /json/)
            .expect(409);

        expect(res.body.statusCode).toBe(409);
        expect(res.body.statusMessage).toBe('Conflict');
        expect(res.body.errorMessage).toBe('Usuário com cpf_cnpj |127.027.040-00| já cadastrado.')

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
        expect(res.body.Usuario.rua).toBe('Avenida X');
        expect(res.body.Usuario.bairro).toBe('Centro');
        expect(res.body.Usuario.cidade).toBe('Passo Fundo');
    });

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

    it('Tentativa de atualizar outro usuário', async function() {
        const res = await request(app)
            .patch('/v1/usuarios/1000')
            .set('Authorization', 'Bearer ' + token)
            .send({
                telefone: "996322831",
                senha: "JOHN4321",
                rua: "Avenida X",
                bairro: "Centro",
                cidade: "Passo Fundo"
            })
            .expect('Content-Type', /json/)
            .expect(401);

        expect(res.body.errorMessage).toBe('Voce não tem permissão para atualizar esse recurso.');
        expect(res.body.statusCode).toBe(401);
        expect(res.body.statusMessage).toBe('Unauthorized');
    });
});

describe('GET /v1/usuarios/id/chaves', function () {
   it('Buscar chaves do usuário', async function () {
      await request(app)
          .get('/v1/usuarios/999/chaves')
          .set('Authorization', 'Bearer ' + token)
          .expect('Content-Type', /json/)
          .expect(200);
   });

    it('Buscar chaves do usuário com id inexistente', async function () {
        const res = await request(app)
            .get('/v1/usuarios/0/chaves')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(404);

        expect(res.body.statusCode).toBe(404);
        expect(res.body.statusMessage).toBe('Not Found');
        expect(res.body.errorMessage).toBe('Usuário |0| não encontrado.');
    });

    it('Tentativa de buscar chaves de outro usuário', async function () {
        const res = await request(app)
            .get('/v1/usuarios/1000/chaves')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(401);

        expect(res.body.statusCode).toBe(401);
        expect(res.body.statusMessage).toBe('Unauthorized');
        expect(res.body.errorMessage).toBe('Voce não tem permissão para acessar esse recurso.');
    });
});

describe('GET /v1/usuarios/id/transacoes', function () {
   it('Buscar transações do usuário', async function() {

       await AppDataSource
           .createQueryBuilder()
           .insert()
           .into(Transacao)
           .values({
               id: 9000,
               chaveOrigem: {id: 5000},
               chaveDestino: {id: 6000},
               valor: 70.00,
               data: new Date(),
               mensagem: 'Nova transação'
           })
           .execute();

      const res = await request(app)
          .get('/v1/usuarios/999/transacoes')
          .set('Authorization', 'Bearer ' + token)
          .expect(200)
          .expect('Content-Type', /json/);

      expect(res.body).not.toBeNull();
   });

    it('Tentativa de buscar transações de outro usuário', async function() {

        const res = await request(app)
            .get('/v1/usuarios/1000/transacoes')
            .set('Authorization', 'Bearer ' + token)
            .expect(401)
            .expect('Content-Type', /json/);

        expect(res.body.statusCode).toBe(401);
        expect(res.body.statusMessage).toBe('Unauthorized');
        expect(res.body.errorMessage).toBe('Voce não tem permissão para visualizar esse recurso.')
    });

    it('Buscar transações de usuário inexistente', async function() {

        const res = await request(app)
            .get('/v1/usuarios/0/transacoes')
            .set('Authorization', 'Bearer ' + token)
            .expect(404)
            .expect('Content-Type', /json/);

        expect(res.body.statusCode).toBe(404);
        expect(res.body.statusMessage).toBe('Not Found');
        expect(res.body.errorMessage).toBe('Usuário |0| não encontrado.')
    });
});

describe('DELETE /v1/usuarios/id', function () {
    it('Deletar usuário existente', async function() {
        await request(app)
            .delete('/v1/usuarios/999')
            .set('Authorization', 'Bearer ' + token)
            .expect(204)
    });

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

    it('Tentativa de deletar outro usuário', async function() {
        const res = await request(app)
            .delete('/v1/usuarios/1000')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(401);

        expect(res.body.errorMessage).toBe('Voce não tem permissão para deletar esse recurso.');
        expect(res.body.statusCode).toBe(401);
        expect(res.body.statusMessage).toBe('Unauthorized');
    });
});
