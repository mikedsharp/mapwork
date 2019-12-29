pipeline {
    agent {
        docker {
            image 'node:12.14-alpine'
            args '-p 3000:3000'
        }
    }
    environment { 
        CI = 'true'
    }
    stages {
        stage('Build') {
            steps {
                sh 'npm cache clean --force'
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