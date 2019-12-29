pipeline {
    agent {
        docker {
            image 'node:13.5.0-stretch'
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
            def featureDir = "mds-mapwork/${BRANCH_NAME}".replace("/", "-").replace("%20", "-") + "/${BUILD_NUMBER}"
            if (env.BRANCH_NAME.equals("master")){
                featureDir = "mds-mapwork";
            }
            steps {
                sh 'echo "I dont know how to implement this yet lol"'
                s3Upload(profileName: 'mikes-s3', entries: 
                    [[bucket: featureDir, sourceFile: "dist/*.*", selectedRegion: "eu-west-1"]],
                     userMetadata: [],
                     dontWaitForConcurrentBuildCompletion: true, 
                     consoleLogLevel: "INFO",
                     pluginFailureResultConstraint: ""
                )
            }
        }
    }
}