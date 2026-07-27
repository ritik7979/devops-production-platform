pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Verify Docker') {
            steps {
                sh 'docker --version'
                sh 'docker compose version'
            }
        }

        stage('Build Images') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Create Backend .env') {
            steps {
                writeFile file: 'application/backend/.env', text: '''
PORT=5000

DB_HOST=mysql
DB_USER=devops
DB_PASSWORD=devops123
DB_NAME=shopdb
'''
            }
        }

        stage('Start Containers') {
            steps {
                sh 'docker compose up -d'
            }
        }

        stage('Wait for Services') {
            steps {
                sh 'sleep 20'
            }
        }

        stage('Verify Deployment') {
            steps {
                sh 'docker compose ps'
                sh 'curl -f http://localhost:3000'
            }
        }
    }

    post {

        always {
            sh 'docker image prune -f'
        }

        success {
            echo 'Application deployed successfully!'
        }

        failure {
            echo 'Pipeline failed.'
            sh 'docker compose logs || true'
        }
    }
}
