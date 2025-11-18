pipeline {
    agent any

    environment {

        DOCKER_HOST_OVERRIDE = "tcp://host.docker.internal:2375"
    }

    stages {
        stage('Declarative: Checkout SCM') {
            steps {
                echo "Iniciando checkout do SCM..."
                checkout scm
            }
        }

        stage('Checkout Source') {
            steps {
                echo "Realizando checkout da fonte..."
                checkout scm
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    echo "Construindo imagens Docker para microsserviços..."

                    // Navega para o diretório do microsservico-produtos e constrói a imagem
                    dir('microsservico-produtos') {
                        echo "Construindo imagem Docker para microsservico-produtos..."
                        // Adicionando DOCKER_HOST para que os comandos docker dentro do script se conectem ao host
                        sh "DOCKER_HOST=${env.DOCKER_HOST_OVERRIDE} docker build -t vinheria-agnello/produtos:latest -t vinheria-agnello/produtos:${BUILD_NUMBER} ."
                    }

                    // Navega para o diretório do microsservico-pedidos e constrói a imagem
                    dir('microsservico-pedidos') {
                        echo "Construindo imagem Docker para microsservico-pedidos..."
                        // Adicionando DOCKER_HOST para que os comandos docker dentro do script se conectem ao host
                        sh "DOCKER_HOST=${env.DOCKER_HOST_OVERRIDE} docker build -t vinheria-agnello/pedidos:latest -t vinheria-agnello/pedidos:${BUILD_NUMBER} ."
                    }

                    echo "Imagens Docker construídas com sucesso!"
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    // Usamos #!/bin/bash para garantir a compatibilidade com sintaxe bash-specifica
                    // e evitar o erro "Syntax error: '(' unexpected".
                    sh '''#!/bin/bash
                        echo "Iniciando execução de testes para os microsserviços..."
                        
                        # --- Testes para microsservico-produtos ---
                        echo "Executando testes para microsservico-produtos..."
                        cd microsservico-produtos
                        # Substitua 'npm test' pelo comando de teste real do seu projeto de produtos.
                        # Certifique-se que este comando retorna um código de saída diferente de zero em caso de falha.
                        npm test
                        cd .. # Retorna para o diretório raiz do workspace
                        
                        # --- Testes para microsservico-pedidos ---
                        echo "Executando testes para microsservico-pedidos..."
                        cd microsservico-pedidos
                        # Substitua 'npm test' pelo comando de teste real do seu projeto de pedidos.
                        # Certifique-se que este comando retorna um código de saída diferente de zero em caso de falha.
                        npm test
                        cd .. # Retorna para o diretório raiz do workspace
                        
                        echo "Todos os testes foram concluídos com sucesso!"
                    '''
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                script {
                    echo "Subindo os serviços com Docker Compose..."
                    // Adicionando DOCKER_HOST para que os comandos docker-compose se conectem ao host
                    sh "DOCKER_HOST=${env.DOCKER_HOST_OVERRIDE} docker-compose up -d"
                    echo "Serviços iniciados com Docker Compose."
                }
            }
        }

        stage('Declarative: Post Actions') {
            steps {
                sh 'echo Pipeline finalizado.'
                script {
                    if (currentBuild.currentResult == 'SUCCESS') {
                        echo 'Pipeline bem-sucedido! ✅'
                    } else {
                        echo 'Pipeline falhou! ❌ Verifique os logs para detalhes.'
                    }
                }
            }
        }
    }
}