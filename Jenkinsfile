pipeline {
    agent any

    environment {
        DOCKER_ORG = 'vinheria-agnello'
    }

    stages {
        stage('Checkout Source') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    sh "echo Construindo imagens Docker para microsserviços..."
                    dir('microsservico-produtos') {
                        sh "echo Construindo imagem Docker para microsservico-produtos..."
                        sh "docker build -t ${DOCKER_ORG}/produtos:latest -t ${DOCKER_ORG}/produtos:${BUILD_NUMBER} ."
                    }
                    dir('microsservico-pedidos') {
                        sh "echo Construindo imagem Docker para microsservico-pedidos..."
                        sh "docker build -t ${DOCKER_ORG}/pedidos:latest -t ${DOCKER_ORG}/pedidos:${BUILD_NUMBER} ."
                    }
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    sh "echo Executando testes (placeholder)..."
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                script {
                    sh "echo Fazendo deploy dos serviços com Docker Compose..."
                    sh 'docker-compose down || true'
                    sh 'docker-compose up -d'
                    sh "echo Deploy concluído!"
                }
            }
        }
    }

    post {
        always {
            sh "echo Pipeline finalizado."
        }
        success {
            sh "echo Pipeline concluído com sucesso! 🎉"
        }
        failure {
            sh "echo Pipeline falhou! ❌ Verifique os logs para detalhes."
        }
    }
}