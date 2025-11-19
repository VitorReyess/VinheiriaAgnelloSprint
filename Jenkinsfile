pipeline {
    agent any

    options {
        skipDefaultCheckout()
    }

    stages {
        stage('Checkout Code') {
            steps {
                script {
                    echo "Checking out code from SCM..."
                    checkout scm
                    echo "Code checked out."
                }
            }
        }

        stage('Simple Build / Verification') {
            steps {
                script {
                    echo "==================================="
                    echo "   Iniciando Deploy da Vinheria!   "
                    echo "   Verificação inicial concluída.  "
                    echo "==================================="
                }
            }
        }

        stage('Install Docker Compose') {
            steps {
                script {
                    echo "Installing Docker Compose inside Jenkins container..."
                    sh '''
                        curl -L "https://github.com/docker/compose/releases/download/v2.23.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
                        chmod +x /usr/local/bin/docker-compose
                        docker-compose --version
                    '''
                    echo "Docker Compose installed successfully."
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    echo "Building Docker images for microsservico-produtos and microsservico-pedidos..."
                    dir('.') {
                        sh 'docker-compose build --no-cache'
                    }
                    echo "Docker images built successfully."
                }
            }
        }

        stage('Deploy Services') {
            steps {
                script {
                    echo "Deploying services using Docker Compose..."
                    dir('.') {
                        sh 'docker-compose down --remove-orphans || true' // O '|| true' garante que não falhe se não houver nada para derrubar
                        sh 'docker-compose up -d --force-recreate'
                    }
                    echo "Services deployed successfully!"
                }
            }
        }

        stage('Post-Deploy Verification') {
            steps {
                script {
                    echo "Performing post-deploy verification..."
                    dir('.') { // É importante estar no diretório do docker-compose.yml
                        sh 'docker-compose ps -a' // <-- CORREÇÃO AQUI! Usando docker-compose ps -a
                    }
                    echo "Verification complete. Check your application at http://localhost:3000 (produtos) and http://localhost:3001 (pedidos)."
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline executado com sucesso!'
        }
        failure {
            echo 'Pipeline falhou!'
        }
    }
}