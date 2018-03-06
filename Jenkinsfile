pipeline {
  agent any
  stages {
    stage('Deploy') {
      steps {
          node('OSX') {
             sh '''echo $SSH_USERNAME && ./deploy.sh'''
          }
      }
    }
  }
}
