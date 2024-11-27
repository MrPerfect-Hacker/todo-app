pipeline {
    agent {
        docker {
            image 'docker:27.4.0-dind'  // Gebruik een Docker-in-Docker image
            args '--privileged'  // Vereist om Docker binnen de container uit te voeren
        }
    }

    environment {
        // Docker registry en algemene variabelen
        REGISTRY = "atrium5365" // Dit is de naam van je Docker Hub-account
        BRANCH = "main" // De Git branch die je wilt gebruiken
        IMAGE_TAG = "v1.0" // Tag voor de Docker-images
        dockerhub_credentials = credentials('atrium5365-dockerhub') // Jenkins credentials ID voor Docker Hub
    }

    stages {
        stage('Checkout') {
            steps {
                // Haal de code op uit de repository
                git branch: "${BRANCH}", url: 'https://github.com/MrPerfect-Hacker/todo-app.git'
            }
        }

        stage('Build Userservice') {
            steps {
                script {
                    echo 'Building users-service...'
                    // Ga naar de map van users-service en bouw het Docker-image
                    dir('Users-service') {
                        sh 'docker build -t ${REGISTRY}/users-service:latest .'
                    }
                }
            }
        }

        stage('Build Taskservice') {
            steps {
                script {
                    echo 'Building tasks-service...'
                    // Ga naar de map van task-service en bouw het Docker-image
                    dir('tasks-service') {
                        sh 'docker build -t ${REGISTRY}/tasks-service:latest .'
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                script {
                    echo 'Building frontend...'
                    // Ga naar de map van frontend en bouw het Docker-image
                    dir('front-end') {
                        sh 'docker build -t ${REGISTRY}/frontend:latest .'
                    }
                }
            }
        }

        stage('Push Microservices') {
            steps {
                script {
                    // Log in naar Docker Hub met behulp van de environment-variabele voor credentials
                    echo 'Logging in to Docker Hub...'
                    sh "docker login -u ${dockerhub_credentials_USR} -p ${dockerhub_credentials_PSW}"

                    // Push de Docker-images naar de registry
                    echo 'Pushing users-service image...'
                    sh 'docker push ${REGISTRY}/users-service:latest'

                    echo 'Pushing tasks-service image...'
                    sh 'docker push ${REGISTRY}/tasks-service:latest'

                    echo 'Pushing frontend image...'
                    sh 'docker push ${REGISTRY}/frontend:latest'
                }
            }
        }

        stage('Cleanup') {
            steps {
                // Opruimen van lokale Docker-afbeeldingen
                echo 'Cleaning up Docker images...'
                sh 'docker system prune -f'
            }
        }
    }

    post {
        always {
            // Acties die altijd moeten worden uitgevoerd, ongeacht of de pipeline succesvol is of niet
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