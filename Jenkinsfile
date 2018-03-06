pipeline {
  agent any
  environment {
    SSH_USERNAME = credentials($SSH_USERNAME)
    SSH_HOST = credentials('ssh-host')
    SSH_PORT = credentials('ssh-port')
  }

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
