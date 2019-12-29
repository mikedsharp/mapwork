pipeline {
    agent {
        docker {
            image 'node:12.14-alpine'
            args '-u root:root -p 3000:3000'
        }
    }
    environment { 
        CI = 'true'
    }
    stages {
        stage('Build') {
            steps {
                sh 'npm install --unsafe-perm'
                sh 'npm run build --unsafe-perm'
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