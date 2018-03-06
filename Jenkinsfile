pipeline {
  agent any
  environment {
    SSH_USERNAME = credentials('ssh-username-test')
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
