pipeline {
    agent {
        kubernetes {
            label 'docker-enabled'  // Label for your agent template
            defaultContainer 'jnlp'  // Default container for the job
            containers {
                containerTemplate(name: 'docker', image: 'docker:19.03.12', command: 'cat', ttyEnabled: true)
            }
        }
    }

    environment {
        REGISTRY = "atrium5365"
        BRANCH = "main"
        IMAGE_TAG = "v1.0"
        dockerhub_credentials = credentials('atrium5365-dockerhub')
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: "${BRANCH}", url: 'https://github.com/MrPerfect-Hacker/todo-app.git'
            }
        }

        stage('Build Userservice') {
            steps {
                script {
                    echo 'Building users-service...'
                    dir('Users-service') {
                        sh 'docker build -t ${REGISTRY}/users-service:${IMAGE_TAG} .'
                    }
                }
            }
        }

        stage('Build Taskservice') {
            steps {
                script {
                    echo 'Building tasks-service...'
                    dir('tasks-service') {
                        sh 'docker build -t ${REGISTRY}/tasks-service:${IMAGE_TAG} .'
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                script {
                    echo 'Building frontend...'
                    dir('front-end') {
                        sh 'docker build -t ${REGISTRY}/frontend:${IMAGE_TAG} .'
                    }
                }
            }
        }

        stage('Push Microservices') {
            steps {
                script {
                    echo 'Logging in to Docker Hub...'
                    sh "docker login -u ${dockerhub_credentials_USR} -p ${dockerhub_credentials_PSW}"
                    echo 'Pushing users-service image...'
                    sh 'docker push ${REGISTRY}/users-service:${IMAGE_TAG}'
                    echo 'Pushing tasks-service image...'
                    sh 'docker push ${REGISTRY}/tasks-service:${IMAGE_TAG}'
                    echo 'Pushing frontend image...'
                    sh 'docker push ${REGISTRY}/frontend:${IMAGE_TAG}'
                }
            }
        }

        stage('Cleanup') {
            steps {
                echo 'Cleaning up Docker images...'
                sh 'docker system prune -f'
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
