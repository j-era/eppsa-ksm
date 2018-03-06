pipeline {
  agent any
  environment {
    SSH_PRIVATE_KEY = credentials('ssh-private-key')
    SSH_HOST2 = credentials(ssh-host2)
  }
  stages {
    stage('Deploy') {
      steps {
          node('OSX') {
             sh '''echo $SSH_HOST2 && ./deploy.sh'''
          }
      }
    }
  }
}
