pipeline {
    agent any

    environment {
        PROJECT = 'gotham-433513'
        ZONE = 'us-central1-a'
        INSTANCE_GROUP_NAME = 'gotham-433513-dev-instance-group-eb0696a'
    }

    stages {
        stage('Update Instances') {
            steps {
                script {
                    // Trigger rolling restart by updating instance group template
                    sh '''
                    gcloud compute instance-groups managed rolling-action replace ${INSTANCE_GROUP_NAME} \
                    --zone ${ZONE}
                    --max-surge 1 \
                    --max-unavailable 0 \
                    --type proactive
                    '''
                }
            }
        }
    }
}
