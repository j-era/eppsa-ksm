pipeline {
  agent any
  stages {
    stage('Deploy') {
      steps {
          node('OSX') {
             sh '''echo $SSH_HOST && echo SSH_HOST && echo $SSH_PORT && ./deploy.sh'''
          }
      }
    }
  }
}
