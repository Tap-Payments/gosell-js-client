#!/usr/bin/env groovy
node {

    currentBuild.result = "SUCCESS"

    try {

      stage('Clone repository'){

        checkout scm        
      }

      stage('Init environment'){        
        loadDeployConfig()        
        env.IMAGE_NAME  = "tap/${env.APP_NAME}:${env.APP_VERSION}"
        env.REGISTRY_ADDRESS = 'hub.docker.tap.company'
      }

      stage('Print environment') {  
                          
        sh 'git --version'
        echo "Branch: ${env.BRANCH_NAME}"              
        sh 'docker -v'                
      } 

      stage('Build image') {
        if(env.BRANCH_NAME == 'master' || env.BRANCH_NAME == 'feature_devops'){
            sh "bash ./_docker/build.sh ${APP_VERSION}" 
        }
      }

      stage('Deploy image') {
        
        if(env.BRANCH_NAME == 'master' || env.BRANCH_NAME == 'feature_devops'){
            dockerRegistryAction("login")
            sh "bash ./_docker/pushToRepo.sh ${APP_VERSION}"                 
            dockerRegistryAction("logout")
        }            
      }      

      stage('Clean image') {        
        sh "bash ./_docker/clean.sh ${APP_VERSION}" 
      }

      stage('Notify to remote server'){
      
        echo 'ssh to web server and tell it to pull new image....'            
        notifyRemoteServer(env.APP_ENV,env.JENKINS_ENV)      

        // send build success mail
        sendBuildSuccessMail()
      } // Notify to stage server
    } // try
    catch (err) {
        currentBuild.result = "FAILURE"

        // send build faile mail
        sendBuildFailMail()
        throw err
    }
}

def loadDeployConfig(){    
  println("Loading deploy config.json")
  try {
    def configJSON = readJSON file: './_deploy/config.json'

    env.APP_NAME = configJSON.app.name
    // if(env.BRANCH_NAME == 'master')
    //   env.APP_ENV = 'prod'
    // else 
    //   env.APP_ENV = 'stage'
    env.APP_ENV = 'stage'
    env.APP_VERSION = configJSON.app.version
    env.JENKINS_ENV = configJSON.app.jenkins_env
    env.WEBSITE_URL = configJSON.app.website_url

    env.MAIL_FROM = configJSON.mail.from
    env.MAIL_TO = configJSON.mail.to
    env.MAIL_REPLY_TO = configJSON.mail.replyTo
  }catch (Exception e) {
    throw new Exception("Properties are missing! Pls double check the deploy config.json")
  }  
}

def dockerRegistryAction(String action = "logout") {
  withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'Vetri-docker-hub-credentials',
                      usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {
    if(action.equals("logout"))
      sh 'docker logout ${REGISTRY_ADDRESS}'      
    else
      sh 'echo $PASSWORD | docker login -u $USERNAME --password-stdin ${REGISTRY_ADDRESS}'
  }
}

def notifyRemoteServer(String appEnv = "stage",String jenkinsEnv = "stage") {
  // prodcution server update
  if(appEnv.equals("prod")){
    withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'Vetri-docker-hub-credentials',
                      usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {

        if(jenkinsEnv.equals("prod"))
          sh 'ssh devops-prod@35.237.168.102 "sudo /home/s.kumar/deploy_${APP_NAME}/dockerRun.sh ${APP_VERSION} ${APP_NAME} ${USERNAME} ${PASSWORD} ${APP_ENV}"'
        else
          sh 'ssh devops-jenkins@35.237.168.102 "sudo /home/s.kumar/deploy_${APP_NAME}/dockerRun.sh ${APP_VERSION} ${APP_NAME} ${USERNAME} ${PASSWORD} ${APP_ENV}"'
    }
  }
  // statging server update
  else if(appEnv.equals("stage")){
    withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'Vetri-docker-hub-credentials',
                      usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {
        if(jenkinsEnv.equals("prod"))
          sh 'ssh devops-prod@35.237.168.102 "sudo /home/s.kumar/deploy_${APP_NAME}/dockerRun.sh ${APP_VERSION} ${APP_NAME} ${USERNAME} ${PASSWORD} ${APP_ENV}"'
        else
          sh 'ssh devops-jenkins@35.237.168.102 "sudo /home/s.kumar/deploy_${APP_NAME}/dockerRun.sh ${APP_VERSION} ${APP_NAME} ${USERNAME} ${PASSWORD} ${APP_ENV}"'
    }
  }  
}

def sendBuildSuccessMail(){
    emailext (                      
      subject: "${env.IMAGE_NAME} app build successful",
      body: """

        <div>Dears,

          <h3>Greetings!</h3>

          <h4>Job : ${env.JOB_NAME}</h6>

            <p>
              This is to view the job result:
              <a href="${env.BUILD_URL}" target="_top">Build Result</a>
            </p>

            <p>
              This is to view the updated website:
              <a href="${env.WEBSITE_URL}" target="_top">website</a>
            </p>

            <p>
              This is to trigger production job:
              <a href="#" target="_top">Production Update : NYI</a>
            </p>

            <p>
              <b>Note:</b> All you need to have account to view/run job.
            </p>

        </div>       
      """,
      replyTo: "${env.MAIL_REPLY_TO}",
      to: "${env.MAIL_TO}",
      from: "${env.MAIL_FROM}"
  )        
}

def sendBuildFailMail(){
  emailext (                      
      subject: "${env.JOB_NAME} app build failed",
      body: """
      <div>Dears,

      <h3>Oops!</h3>

      <p>Kindly click here for project build error : 
        <a href="${env.BUILD_URL}">${env.JOB_NAME}</a> 
      </p>

      </div>
      """,
      replyTo: "${env.MAIL_REPLY_TO}",
      to: "${env.MAIL_TO}",
      from: "${env.MAIL_FROM}"
  )
}