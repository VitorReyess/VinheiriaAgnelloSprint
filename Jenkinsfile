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

                    dir('microsservico-produtos') {
                        echo "Construindo imagem Docker para microsservico-produtos..."
                        sh "DOCKER_HOST=${env.DOCKER_HOST_OVERRIDE} docker build -t vinheria-agnello/produtos:latest -t vinheria-agnello/produtos:${BUILD_NUMBER} ."
                    }

                    dir('microsservico-pedidos') {
                        echo "Construindo imagem Docker para microsservico-pedidos..."
                        sh "DOCKER_HOST=${env.DOCKER_HOST_OVERRIDE} docker build -t vinheria-agnello/pedidos:latest -t vinheria-agnello/pedidos:${BUILD_NUMBER} ."
                    }

                    echo "Imagens Docker construídas com sucesso!"
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    echo "Iniciando execução de testes para os microsserviços..."

                    // --- Testes para microsservico-produtos ---
                    echo "Executando testes para microsservico-produtos..."
                    dir('microsservico-produtos') {
                        sh """#!/bin/bash
                            set -e
                            DOCKER_HOST=${env.DOCKER_HOST_OVERRIDE} docker run --rm \
                                vinheria-agnello/produtos:latest \
                                npm test
                        """
                    }

                    // --- Testes para microsservico-pedidos ---
                    echo "Executando testes para microsservico-pedidos..."
                    dir('microsservico-pedidos') {
                        sh """#!/bin/bash
                            set -e
                            DOCKER_HOST=${env.DOCKER_HOST_OVERRIDE} docker run --rm \
                                vinheria-agnello/pedidos:latest \
                                npm test
                        """
                    }

                    echo "Todos os testes foram concluídos com sucesso!"
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                script {
                    echo "Parando e removendo serviços Docker Compose anteriores (se existirem)..."
                    sh "DOCKER_HOST=${env.DOCKER_HOST_OVERRIDE} docker-compose down --remove-orphans"
                    echo "Subindo os serviços com Docker Compose..."
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