pipeline {
    agent any

    environment {
        PROJECT = 'gotham-433513'
        REGION = 'us-central1'
        INSTANCE_GROUP_NAME = 'gotham-433513-dev-instance-group-4cf1629'
    }

    stages {
        stage('Update Instances') {
            steps {
                script {
                    // Trigger rolling restart by updating instance group template
                    sh '''
                    gcloud compute instance-groups managed rolling-action replace ${INSTANCE_GROUP_NAME} \
                    --region ${REGION} \
                    --max-surge 3 \
                    --max-unavailable 0 \s
                    '''
                }
            }
        }
    }
}
