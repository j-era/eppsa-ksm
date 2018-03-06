pipeline {
  agent any
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
