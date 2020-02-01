pipeline {
    agent {
        docker {
            image 'node:13.5.0-stretch'
            args '-u root:root -p 3000:3000'
        }
    }
    stages {
        stage('Build') {
            steps {
                sh 'rm -rf dist'
                sh 'npm install --unsafe-perm'
                sh 'npm run build --unsafe-perm'
            }
        }
        stage('Test') {
            steps {
                sh 'npm run test'
                withEnv(["JEST_JUNIT_OUTPUT=./junit.xml"]) {
                    sh 'npm run test-ci'
                }
                junit: 'junit.xml'
                [$class: 'CoberturaPublisher', coberturaReportFile: 'coverage/cobertura-coverage.xml']

            }
        }
        stage('Deliver') {
            steps {
                script {
                        def featureDir = "mds-mapwork-builds/" + "${BRANCH_NAME}".replace("%20", "-") + "/${BUILD_NUMBER}"
                        s3Upload(profileName: 'mikes-s3', entries: 
                            [[bucket: featureDir, sourceFile: "dist/*.*", selectedRegion: "eu-west-1"]],
                            userMetadata: [],
                            dontWaitForConcurrentBuildCompletion: false, 
                            consoleLogLevel: "INFO",
                            pluginFailureResultConstraint: ""
                        )
                        if (env.BRANCH_NAME.equals("master")){
                            def featureDirMaster = "mds-mapwork";
                            s3Upload(profileName: 'mikes-s3', entries: 
                                [[bucket: featureDirMaster, sourceFile: "dist/*.*", selectedRegion: "eu-west-1"]],
                                userMetadata: [],
                                dontWaitForConcurrentBuildCompletion: false, 
                                consoleLogLevel: "INFO",
                                pluginFailureResultConstraint: ""
                            )
                        }
                }
            }
        }
    }
}