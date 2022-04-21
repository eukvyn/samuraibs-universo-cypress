

import signupPage from '../support/pages/signup'

describe('cadastro', function () {
    context('quando o usuário é novato', function () {
        const user = {
            name: 'User Automated',
            email: 'user@automated.com',
            password: 'Test@123'
        }

        before(function () {
            cy.task('removeUser', user.email)
                .then(function (result) {
                    console.log(result)
                })
        })

        it('deve cadastrar com sucesso', function () {
            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.toast.shouldHaveText('Agora você se tornou um(a) Samurai, faça seu login para ver seus agendamentos!')
        })
    })

    context('quando o email já existe', function () {
        const user = {
            name: 'User Automated Test',
            email: 'user@automated.com',
            password: 'Test@123',
            is_provider: true
        }

        before(function () {
            cy.postUser(user)
        })

        it('não deve cadastrar usuário', function () {
            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.toast.shouldHaveText('Email já cadastrado para outro usuário.')
        })
    })

    context('quando o email é incorreto', function () {
        const user = {
            name: 'User Automated',
            email: 'user.automated.com',
            password: 'Test@123'
        }

        it('deve exibir mensagem de alerta', function() {
            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.alertHaveText('Informe um email válido')
        })
    })

    context('quando a senha é muito curta', function() {

        const passwords = ['1', '1a', 'ab3', 'abc4', 'ab#c5']

        beforeEach(function(){
            signupPage.go()
        })

        passwords.forEach(function (p){
            it('não deve cadastrar com a senha: ' + p, function(){
                const user = { name: 'User Automated', email: 'user@automated.com', password: p}

                signupPage.form(user)
                signupPage.submit()
            })
        });

        afterEach(function(){
            signupPage.alertHaveText('Pelo menos 6 caracteres')
        })
    })

    context('quando não preencho nenhum dos campos', function() {

        const alertMessages = [
            'Nome é obrigatório',
            'E-mail é obrigatório',
            'Senha é obrigatória',
        ]

        before(function(){
            signupPage.go()
            signupPage.submit()
        })

        alertMessages.forEach(function(alert){

            it('deve exibir ' + alert.toLocaleLowerCase(), function() {
                signupPage.alertHaveText(alert)
            })
        })
    })
})
