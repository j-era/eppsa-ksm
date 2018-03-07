pipeline {
  agent any
  stages {
    stage('Deploy') {
      steps {
          node('Linux') {
             sshagent(['ssh-eppsa-demo']) {
                sh 'ssh -o StrictHostKeyChecking=no -p $SSH_PORT $SSH_USER@$SSH_HOST uname -a'
                sh '''ssh -o StrictHostKeyChecking=no -p $SSH_PORT $SSH_USER@$SSH_HOST << EOF
                        rm -rf eppsa-ksm
                        git clone --recursive https://github.com/artcom/eppsa-ksm.git
                        cd eppsa-ksm
                        git checkout -b $GIT_BRANCH
                        docker-compose stop
                        docker-compose rm -f
                        docker-compose -f docker-compose.yml -f docker-compose.production.yml build
                        docker-compose -f docker-compose.yml -f docker-compose.production.yml up -d
                      EOF'''
            }
          }
      }
    }
  }
}
