pipeline {
  agent any
  stages {
    stage('Deploy') {
      steps {
          node('OSX') {
             sshagent(['ssh-eppsa-demo']) {
                sh 'ssh -o StrictHostKeyChecking=no -p $SSH_PORT $SSH_USER@$SSH_HOST uname -a'
                sh './deploy.sh'
            }
          }
      }
    }
  }
}
