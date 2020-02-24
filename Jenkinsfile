pipeline {
    agent any

    options { disableConcurrentBuilds() }

    stages {
        stage('Install') {
            steps {
                script {
                    sh 'yarn'
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    sh 'yarn build'
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    echo "Branch ${env.BRANCH_NAME}"
                    if (env.BRANCH_NAME == 'master') {
                        echo 'Deploy'
                        sh 'cp -rp build/* /var/www/laps.roborace.org'
                    }
                }
            }
        }
    }
}
