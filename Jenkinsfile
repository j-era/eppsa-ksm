pipeline {
  agent any
  stages {
    stage('Deploy') {
      steps {
          node('OSX') {
             sh '''echo credentials($SSH_HOST) && ./deploy.sh'''
          }
      }
    }
  }
}
