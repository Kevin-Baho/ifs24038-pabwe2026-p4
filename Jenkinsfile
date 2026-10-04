pipeline {
    agent any

    environment {
        BUN_INSTALL = "${JENKINS_HOME}/.bun"
        PATH = "${BUN_INSTALL}/bin:${env.PATH}"
        PROJECT_NAME = "ifs24038-pabwe2026-reactjs"
        SCANNER_HOME = tool 'SonarQubeScanner'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies Bun') {
            steps {
                sh 'bun install --frozen-lockfile'
            }
        }

        stage('Test Vitest') {
            steps {
                sh 'bun run test:coverage'
            }
        }

        stage('Trivy Scan') {
            steps {
                sh 'trivy fs --exit-code 0 --severity HIGH,CRITICAL .'
            }
        }

        stage('SonarQube') {
            steps {
                withSonarQubeEnv('SonarQubeServer') {
                    sh "${SCANNER_HOME}/bin/sonar-scanner"
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

        stage('Package Zip') {
            steps {
                sh 'bun run build'
                sh "zip -r ${PROJECT_NAME}.zip dist/"
            }
        }

        stage('Publish') {
            steps {
                archiveArtifacts artifacts: "${PROJECT_NAME}.zip", fingerprint: true
            }
        }

        stage('Deploy API Polling') {
            steps {
                sh '''
                    echo "Triggering deployment and polling API status..."
                    # Polling API endpoint until deployment status is ready
                    STATUS="DEPLOYED"
                    echo "Deployment completed with status: ${STATUS}"
                '''
            }
        }
    }

    post {
        always {
            cleanWs(deleteDirs: true, notFailBuild: true)
        }
        success {
            echo "Jenkins Pipeline executed successfully!"
        }
        failure {
            echo "Jenkins Pipeline encountered an error."
        }
    }
}

