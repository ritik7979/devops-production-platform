pipeline {
    agent any

    environment {
        DOCKER_BACKEND_IMAGE = "chritik24/devops-backend:latest"
        DOCKER_FRONTEND_IMAGE = "chritik24/devops-frontend:latest"
        KUBE_NAMESPACE = "devops"
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                   sh '''
                   sonar-scanner
                   '''
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Verify Docker') {
            steps {
                sh '''
                docker --version
                docker compose version
                kubectl version --client
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                sh '''
                docker compose build

                docker tag devops-production-platform-backend:latest ${DOCKER_BACKEND_IMAGE}
                docker tag devops-production-platform-frontend:latest ${DOCKER_FRONTEND_IMAGE}
                '''
            }
        }

        stage('Login & Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {

                    sh '''
                    echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

                    docker push ${DOCKER_BACKEND_IMAGE}
                    docker push ${DOCKER_FRONTEND_IMAGE}

                    docker logout
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                kubectl apply -f kubernetes/
                
                kubectl rollout restart deployment/backend -n devops
                kubectl rollout restart deployment/frontend -n devops

                kubectl rollout status deployment/backend -n devops
                kubectl rollout status deployment/frontend -n devops
                '''
            }
        }

        stage('Wait for Rollout') {
            steps {
                sh '''
                kubectl rollout status deployment/mysql -n ${KUBE_NAMESPACE}
                kubectl rollout status deployment/backend -n ${KUBE_NAMESPACE}
                kubectl rollout status deployment/frontend -n ${KUBE_NAMESPACE}
                '''
            }
        }

        stage('Verify Kubernetes Deployment') {
            steps {
                sh '''
                echo "Pods:"
                kubectl get pods -n ${KUBE_NAMESPACE}

                echo ""

                echo "Services:"
                kubectl get svc -n ${KUBE_NAMESPACE}

                echo ""

                echo "Deployments:"
                kubectl get deployments -n ${KUBE_NAMESPACE}
                '''
            }
        }
    }

    post {

        success {
            echo "========================================="
            echo "Pipeline completed successfully!"
            echo "Docker images pushed to Docker Hub."
            echo "Application deployed to Kubernetes."
            echo "========================================="
        }

        failure {
            echo "Pipeline failed."

            sh '''
            echo "===== Pods ====="
            kubectl get pods -n ${KUBE_NAMESPACE} || true

            echo ""
            echo "===== Backend Logs ====="
            kubectl logs deployment/backend -n ${KUBE_NAMESPACE} || true

            echo ""
            echo "===== Frontend Logs ====="
            kubectl logs deployment/frontend -n ${KUBE_NAMESPACE} || true

            echo ""
            echo "===== MySQL Logs ====="
            kubectl logs deployment/mysql -n ${KUBE_NAMESPACE} || true
            '''
        }

        always {
            sh '''
            docker image prune -f
            '''
        }
    }
}
