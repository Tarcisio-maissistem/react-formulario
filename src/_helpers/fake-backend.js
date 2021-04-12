import { Role } from './'

export function configureFakeBackend() {
    // array no armazenamento local para registros do usuário
    let users = JSON.parse(localStorage.getItem('users')) || [{ 
        id: 1,
        title: 'Mr',
        firstName: 'João',
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

            function getUserById() {
                let user = users.find(x => x.id === idFromUrl());
                return ok(user);
            }
    
            function createUser() {
                const user = body();

                if (users.find(x => x.email === user.email)) {
                    return error(`Usuário com o e-mail ${user.email} já existente`);
                }

                // atribua o ID do usuário e algumas outras propriedades e salve
                user.id = newUserId();
                user.dateCreated = new Date().toISOString();
                delete user.confirmPassword;
                users.push(user);
                localStorage.setItem('users', JSON.stringify(users));

                return ok();
            }
    
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