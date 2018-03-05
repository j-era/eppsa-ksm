pipeline {
  agent any
  environment {
      SSH_USERNAME = credentials('ssh-username')
      SSH_HOST = credentials('ssh-host')
      SSH_PORT = credentials('ssh-port')
  }
  stages {
    stage('Deploy') {
      steps {
          node('OSX') {
             sh '''./deploy.sh'''
          }
      }
    }
  }
}
