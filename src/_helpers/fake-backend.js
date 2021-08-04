import firebaseDb from "../_helpers/firebase";
import "firebase/database";
import { useListKeys } from 'react-firebase-hooks/database';
import { Role } from './'

export function configureFakeBackend() {
    // array no armazenamento local para registros do usuário
    let users = JSON.parse(localStorage.getItem('users')) || [{
        id: 1,
        title: 'Mr',
        firstName: 'João teste',
        lastName: 'Bloggs',
        email: 'joe@bloggs.com',
        role: Role.User,
        password: 'joe123'
    }];

    // monkey patch fetch para configurar back-end falso
    let realFetch = window.fetch;
    window.fetch = function (url, opts) {
        return new Promise((resolve, reject) => {
            // quebrar no tempo limite para simular a chamada de API do servidor
            setTimeout(handleRoute, 500);

            function handleRoute() {
                const { method } = opts;
                switch (true) {
                    // Usuários
                    case url.endsWith('/users') && method === 'GET':
                        return getUsers();
                    case url.match(/\/users\/\d+$/) && method === 'GET':
                        return getUserById();
                    case url.endsWith('/users') && method === 'POST':
                        return createUser();
                    case url.match(/\/users\/\d+$/) && method === 'PUT':
                        return updateUser();
                    case url.match(/\/users\/\d+$/) && method === 'DELETE':
                        return deleteUser();
                    // Clientes
                    case url.endsWith('/clients') && method === 'GET':
                        return getClients();
                    case url.match(/\/clients\/\d+$/) && method === 'GET':
                        return getClientById();
                    case url.endsWith('/clients') && method === 'POST':
                        return createClient();
                    case url.match(/\/clients\/\d+$/) && method === 'PUT':
                        return updateClient();
                    case url.match(/\/clients\/\d+$/) && method === 'DELETE':
                        return deleteClient();
                    default:
                        // passar por quaisquer solicitações não tratadas acima
                        return realFetch(url, opts)
                            .then(response => resolve(response))
                            .catch(error => reject(error));
                }
            }
            // funções de rota
            function getUsers() {
                return ok(users);
            }
            function getClients() {
                return ok(clients);
            }

            function getUserById() {
                let user = users.find(x => x.id === idFromUrl());
                return ok(user);
            }

            function getClientById() {
                let client = clients.find(x => x.cpfcnpj === idFromUrl());
                return ok(client);
            }

            function createUser() {
                const user = body();
                if (users.find(x => x.email === user.email)) {
                    console.log('JA EXISTE no firebase ')
                    return error(`Usuário com o e-mail: ${user.email} já existe`);
                }
                // atribua o ID do usuário e algumas outras propriedades e salve
                user.id = newUserId();
                user.dateCreated = new Date().toISOString();
                delete user.confirmPassword;
                users.push(user);
                firebaseDb.child('users').child(user.id).set(
                    user,
                    err => {
                        if (err)
                            console.log(err)
                    }
                )
                return ok();
            }

            // function createClient() {
            //     try {
            //         let newClients = [];

            //         const client = body();
            //         const idClient = client.cpfcnpj;
            //         client.dateCreated = new Date();

            //         firebaseDb.firestore().collection("clients").onSnapshot((snapshot) => {
            //             // newClients.push(snapshot.docs.map((doc) => (doc.id)))
            //             newClients.push(snapshot.forEach(function (doc) { doc.id }))
            //             console.log(newClients)

            //         })

            //         if (newClients.includes(idClient)) {
            //             console.log('Ja existe no Banco')
            //             return error(`Cliente já existente!`);
            //         }

            //         firebaseDb.firestore().collection(`clients`).doc(idClient).set(client);
            //         console.log('Cliente Cadastrado!')
            //         return ok();
            //     }
            //     catch (e) {
            //         return console.log(e);
            //     }

            // }

            function updateUser() {
                let params = body();
                let user = users.find(x => x.id === idFromUrl());

                // apenas atualize a senha se incluída
                if (!params.password) {
                    delete params.password;
                }
                // não salve, confirme a senha
                delete params.confirmPassword;

                // atualizar e salvar usuário
                Object.assign(user, params);
                localStorage.setItem('users', JSON.stringify(users));

                return ok();
            }

            // function updateClient() {
            //     let params = body();
            //     let idClient = params.cpfcnpj;
            //     params.atualizado = new Date().toISOString();

            //     try {
            //         firebaseDb.child(`clients/${idClient}`).set(
            //             params,
            //             err => {
            //                 if (err) {
            //                     console.log(err)
            //                 }
            //             }
            //         )
            //         console.log('Cliente Cadastrado!')
            //         return ok();
            //     }
            //     catch (e) {
            //         logMyErrors(e)
            //     }
            // }

            function deleteUser() {
                users = users.filter(x => x.id !== idFromUrl());
                localStorage.setItem('users', JSON.stringify(users));

                return ok();
            }

            // funções auxiliares
            function ok(body) {
                resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(body)) });
            }

            function error(message) {
                resolve({ status: 400, text: () => Promise.resolve(JSON.stringify({ message })) });
            }

            function idFromUrl() {
                const urlParts = url.split('/');
                return parseInt(urlParts[urlParts.length - 1]);
            }

            function body() {
                return opts.body && JSON.parse(opts.body);
            }

            function newUserId() {
                return users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
            }
        });
    }
};