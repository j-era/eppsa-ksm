pipeline {
  agent any
  stages {
    stage('Deploy') {
      steps {
         sshagent(['ssh-eppsa']) {
            sh '''./deploy.sh'''
        }
      }
    }
  }
}
