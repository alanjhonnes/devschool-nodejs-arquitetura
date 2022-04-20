# Aplicação de 12 fatores em NodeJS

Essa aplicação de exemplo serve de exemplo para a implementação de aplicação seguindo os [doze fatores](https://12factor.net)

## Os 12 fatores

- 1. Base de Código
- 2. Dependências
- 3. Configurações
- 4. Serviços de Apoio
- 5. Construa, publique, execute
- 6. Processos
- 7. Vínculo de porta
- 8. Concorrência
- 9. Descartabilidade
- 10. Dev/prod semelhantes
- 11. Logs
- 12. Processos Administrativos

https://12factor.net/pt_br/

### [1. Base de Código](https://12factor.net/codebase)

Utilização de um sistema de versionamento de código
Aplicações devem ser deployadas a partir de uma versão do código.

#### Implementação

Código versionado no Github, podemos fazer deploy apontando para uma branch/tag do repositório.

### [2. Dependências](https://12factor.net/dependencies)

Dependências são declaradas de forma explicita

A aplicação também deve listar dependências de sistema e não somente bibliotecas (ex: Versão do node.js instalada)

#### Implementação

Declaramos as dependências no [package.json][package-json] e o [npm][npmjs] instala em uma pasta `node_modules` para que as dependências da aplicação sejam isoladas do sistema

### [3. Configurações](https://12factor.net/config)

Armazenar as configurações da aplicação no ambiente

#### Implementação

Configuração é consumida das variáveis de ambiente, e usamos a biblioteca "dotenv" junto com um arquivo .env local para rodarmos a aplicação localmente sem precisarmos configurar as variáveis de ambiente do nosso próprio sistema.

### [4. Serviços de Apoio](https://12factor.net/backing-services)

Trate serviços de apoio como recursos anexados

Ex: Banco de dados, serviço de cache

Serviços de apoio devem ser configurados via variáveis de ambiente como indicado no item 3 - Configuração

Não deve haver distinção entre um serviço local ou de terceira, sendo possível trocar um serviço local por um serviço terceiro

#### Implementação

We connect to the database via a connection url provided by the
`VCAP_SERVICES` environment variable. If we needed to setup a new database, we
would simply create a new database with `cf create-service` and bind the
database to our application. After restaging with `cf restage`, the
`VCAP_SERVICES` environment will be updated with the new connection url and our
app would be talking to the new database.

We use a library which handles the database connection. This library abstracts
away the differences between different SQL-based databases. This makes it easier
to migrate from one database provider to another.

We expect to be using a database hosted on Cloud Foundry, but using this
strategy we could store the connection url in a separate environment variable
which could point to a database outside of the Cloud Foundry environment and
this strategy would work fine.

Of course, how you handle migrating your data from one database to another can
be complicated and is out of scope with regard to the twelve factor app.

### [5. Construa, publique, execute (build, release, run)](https://12factor.net/build-release-run)

Separar os passos de build, deploy e execução

Passo de build é o processo de transformação do código do repositório em um pacote executável, baixando as dependências e fazendo as compilações necessárias.

Passo de release pega o pacote gerado pelo passo de build e combina ele com as configurações do ambiente, gerando um artefato pronto para execução

O passo de run executa um ou mais processos da aplicação no ambiente de execução com o release

#### Implementação

O `package.json`permite que configuremos scripts para codificar diferentes tasks.

O `npm run build` é usado para realizar o build da aplicação.

O `npm start` é usado para startar a aplicação.

### [6. Processos](https://12factor.net/processes)

Executar a aplicação como um ou mais processos que não tem estado

Qualquer dado que deve ser persistido deve se utilizar um serviço stateful para armazenar os dados
Banco de dados

Serviço de arquivos

Processos não devem compartilhar nada entre si (ex: memória / sistema de arquivos)

Memória e sistema de arquivos pode ser usado por um processo como um tipo de cache temporário, e nunca deve assumir que os dados armazenados nesses lugares estarão disponíveis em um novo processo.

#### Implementação

Escutamos pelos sinais de SIGTERM e SIGINT para sermos notificados de quando devemos encerrar a aplicação, podemos desconectar do banco de dados e parar de receber requisições, cancelar tarefas agendadas, etc.

### [7. Vínculo de porta](https://12factor.net/port-binding)

Serviços devem ser expostos em uma porta
No ambiente de execução, uma camada de roteamento é responsável por direcionar as chamadas para a porta respectiva do serviço
Ex: Http utiliza porta 80, https utiliza porta 443, mas o serviço pode rodar em outra porta e a camada de roteamento fará o direcionamento adequado

#### Implementação

Recebemos a porta dinâmicamente pela variável de ambiente PORT e a utilizamos ao inicializarmos o servidor web.

### [8. Concorrência](https://12factor.net/concurrency)

Uma aplicação é representada por um ou mais processos independentes

Podemos escalonar uma aplicação simplesmente instanciando mais processos de um mesmo deploy.

Camada de roteamento é responsável por distribuir tráfego entre as instâncias do serviço.

#### Implementação

O ideal é que uma aplicação não mantenha estado de forma independente.

Configurações devem ser armazenadas no ambiente.

Tokens de usuário devem ser armazenados no lado do cliente como Cookies ou Json Web Tokens

### [9. Descartabilidade](https://12factor.net/disposability)

Aplicações devem ter rápido tempo de startup e devem lidar com notificações de termino de processo de forma elegante

Permite o escalonamento rápido da aplicação

Ao lidarmos com o sinal de sistema SIGTERM (sinal de término de processo), podemos encerrar as atividades da aplicação de forma elegante

Fechar conexões com banco de dados

Devolver uma mensagem que estava em processamento de volta para a fila

Interromper um processo batch sem perda de informação

Também devem ser robustos para suportar o encerramento repentino
Serviços de jobs podem retornar um job para a fila de execução caso pe
rcam a conexão com a aplicação

No Node.js podemos implementar isso com “process.on('SIGTERM', handle);”

#### Implementação

Escutamos pelos sinais de SIGTERM e SIGINT para sermos notificados de quando devemos encerrar a aplicação, podemos desconectar do banco de dados e parar de receber requisições, cancelar tarefas agendadas, etc.

### [10. Dev/prod semelhantes](https://12factor.net/dev-prod-parity)

Devemos manter os ambientes o mais similar possível

Aplicações devem ser preparadas para suportarem deploy contínuo

Autores do código devem ser as mesmas pessoas responsáveis pelo deploy

Tempo entre os intervalos de implantação em desenvolvimento/produção deve ser pequeno

Evitar usar serviços de apoio diferentes entre desenvolvimento/produção mesmo tendo camadas de abstração, para evitar problemas só encontrados em produção.

Ex: Banco de dados SQLite em desenvolvimento, MySQL em produção

### [11. Logs](https://12factor.net/logs)

Tratar logs como streams de eventos ordenados por tempo

Aplicação não é responsável por rotear ou gerenciar os logs

Não usar arquivos de log

Localmente, podem ser publicados no stdout

No ambiente de execução, podem ser capturados, agregados e direcionados para um serviço de gerenciamento de logs

#### Implementação

Utilizamos a biblioteca `pino` para fazer os logs das requisições do express

### [12. Processos Administrativos](https://12factor.net/admin-processes)

Processos administrativos devem ser considerados processos de execução única

#### Implementação

No Node.js, podemos implementar esses processos administrativos com os “scripts” do package.json
