// Jenkinsfile
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                script {
                    checkout scm
                    echo "Checked out code."
                }
            }
        }
        stage('Build and Deploy Docker Compose') {
            steps {
                script {
                    echo "Building and deploying services with Docker Compose..."
                    dir('.') {
                        // Este comando derruba e remove containers antigos, liberando as portas
                        sh 'docker-compose down --remove-orphans'
                        // Construir as imagens e iniciar os serviços em modo detached
                        sh 'docker-compose up --build -d'
                    }
                    echo "Docker Compose services are up and running."
                }
            }
        }
        stage('Test Services (Optional)') {
            steps {
                script {
                    echo "Running post-deployment tests (if any)..."
                    // Exemplo de como testar o microsserviço de produtos na nova porta
                    // sh 'curl http://localhost:8091/produtos'
                    // sh 'curl http://localhost:8081/pedidos'
                    echo "Tests completed."
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline finished."
        }
        success {
            echo "Pipeline succeeded!"
        }
        failure {
            echo "Pipeline failed!"
            // Você pode adicionar ações aqui para falha, como notificação.
        }
    }
}