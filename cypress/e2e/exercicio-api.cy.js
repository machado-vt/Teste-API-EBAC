/// <reference types="cypress" />
import { faker } from '@faker-js/faker';
import contrato from "../contracts/usuarios.contract"
var email = ""

describe('Testes da Funcionalidade Usuários', () => {
  let token
  beforeEach(() => {
    cy.token("mavi@qa.com.br", "teste").then(tkn => { token = tkn})
});

  it('Deve validar contrato de usuários', () => {
    //TODO:
    cy.request('usuarios').then(response =>{
      return contrato.validateAsync(response.body)
    })


  });

  it('Deve listar usuários cadastrados', () => {    
    cy.request({
      method: "GET",
      url: "usuarios",
    }).should((response) => {
      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('usuarios')
    })
  });

  it('Deve cadastrar um usuário com sucesso', () => {

    let usuario = "usuario feliz " + Math.floor(Math.random() * 10000000)
    email = faker.internet.email()
    cy.cadastrarUsuario(token, usuario, email, "teste", "true")
    .should((response) => {
      expect(response.status).equal(201)
      expect(response.body.message).equal('Cadastro realizado com sucesso')
    })

  });

  it('Deve validar um usuário com email inválido', () => {

    let usuario = "usuario feliz " + Math.floor(Math.random() * 10000000)
    cy.cadastrarUsuario(token, usuario, "mavi@qa.com.br", "teste", "true")
    .then((response) => {
      expect(response.status).equal(400)
      expect(response.body.message).equal("Este email já está sendo usado")
    })
  });

  it('Deve editar um usuário previamente cadastrado', () => {
    //TODO:
    let usuario = "usuario feliz " + Math.floor(Math.random() * 10000000)
    email = faker.internet.email()
    cy.cadastrarUsuario(token, usuario, email, "teste", "true")
    .then(response =>{
      let id = response.body._id      
      cy.request({
        method: "PUT",
        url: `usuarios/${id}`,
        headers: {authorization: token},
        body: {
          "nome": "Usuario feliz editado apos criacao",
          "email": email,
          "password": "teste",
          "administrador": "true"
        }
      }).should(response => {
        expect(response.body.message).to.equal('Registro alterado com sucesso')
        expect(response.status).to.equal(200)
      })
    })
  });

  it('Deve deletar um usuário previamente cadastrado', () => {
    let usuario = "usuario a ser apagado " + Math.floor(Math.random() * 10000000)
    email = faker.internet.email()
    cy.cadastrarUsuario(token, usuario, email, "teste", "true")
    .then(response => {
      let id = response.body._id
      cy.log("Id coletado: " + id)
      cy.request({
        method: "DELETE",
        url: `usuarios/${id}`,
        headers: {authorization: token},
      }).should(resp =>{
        expect(resp.body.message).to.equal('Registro excluído com sucesso')
        expect(resp.status).to.equal(200)
    })
    })

  });


});
