pipeline {
    agent any

    options { disableConcurrentBuilds() }

    parameters {
        choice(name: 'DEPLOY', choices: 'NO\nYES', description: 'Deploy to the server')
    }

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
                    echo "Branch ${env.BRANCH_NAME}, DEPLOY=${params.DEPLOY}"
                    if (env.BRANCH_NAME == 'master' || params.DEPLOY == 'YES') {
                        echo 'Deploy'
                        sh 'cp -rp build/* /var/www/laps.roborace.org'
                    }
                }
            }
        }
    }
}
