pipeline {
  agent any
  environment {
      SSH_USERNAME = credentials('ssh-username')
      SSH_HOST = credentials('ssh-host')
  }
  stages {
    stage('Deploy') {
      steps {
        sh '''

./deploy.sh'''
      }
    }
  }
}
