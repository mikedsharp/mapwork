pipeline {
    agent {
        docker {
            image 'node:8.17-alpine'
            args '-p 3000:3000'
        }
    }
    environment { 
        CI = 'true'
    }
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }
        stage('Test') {
            steps {
                sh 'npm run test'
            }
        }
        stage('Deliver') {
            steps {
                sh 'echo "I dont know how to implement this yet lol"'
            }
        }
    }
}