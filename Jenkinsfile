pipeline {
  agent any
  environment {
    SSH_USERNAME = credentials('SSH_USERNAME')
    SSH_HOST = credentials('SSH_HOST')
    SSH_PORT = credentials('ssh-port')
  }

  stages {
    stage('Deploy') {
      steps {
          node('OSX') {
             sh '''echo $SSH_HOST && echo $SSH_PORT && ./deploy.sh'''
          }
      }
    }
  }
}
