pipeline {

    agent none

    environment {

        BUILD_DIR = '/var/www/react-app'

    }

    stages {

        stage('Checkout') {

            agent { label 'ec2-production' }

            steps {

                echo '📥 Checking out React code from GitHub...'

                checkout scm

            }

        }

        stage('Install Dependencies') {

            agent { label 'ec2-production' }

            steps {

                echo '📦 Installing npm dependencies...'

                sh '''

                    # Clean install

                    rm -rf node_modules package-lock.json

                    npm install

                '''

            }

        }

        stage('Build React App') {

            agent { label 'ec2-production' }

            steps {

                echo '🔨 Building React production build...'

                sh '''

                    # Build for production

                    npm run build

                    # Check if build was successful

                    if [ ! -d "build" ]; then

                        echo "❌ Build directory not found!"

                        exit 1

                    fi

                    echo "✅ Build completed successfully"

                    ls -la build/

                '''

            }

        }

        stage('Deploy to Nginx') {

            agent { label 'ec2-production' }

            steps {

                echo '🚀 Deploying to Nginx...'

                sh '''

                    # Backup existing deployment (optional)

                    if [ -d "${BUILD_DIR}" ]; then

                        sudo rm -rf ${BUILD_DIR}.backup

                        sudo cp -r ${BUILD_DIR} ${BUILD_DIR}.backup || true

                    fi

                    # Clear old deployment

                    sudo rm -rf ${BUILD_DIR}/*

                    # Copy new build files

                    sudo cp -r build/* ${BUILD_DIR}/

                    # Set correct permissions

                    sudo chown -R www-data:www-data ${BUILD_DIR}

                    sudo chmod -R 755 ${BUILD_DIR}

                    # Reload Nginx

                    sudo systemctl reload nginx

                    echo "✅ Deployment completed!"

                '''

            }

        }

        stage('Health Check') {

            agent { label 'ec2-production' }

            steps {

                echo '🏥 Checking deployment health...'

                sh '''

                    sleep 2

                    # Check if Nginx is serving the app

                    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost)

                    if [ "$HTTP_CODE" = "200" ]; then

                        echo "✅ React app is accessible (HTTP $HTTP_CODE)"

                    else

                        echo "❌ React app is not accessible (HTTP $HTTP_CODE)"

                        exit 1

                    fi

                '''

            }

        }

    }

    post {

        success {

            echo '✅ Pipeline completed successfully!'

            echo '🌐 React App: http://65.0.124.193'

            echo '🔗 FastAPI Backend: http://3.110.177.17:8000'

            echo '📖 API Docs: http://3.110.177.17:8000/docs'

        }

        failure {

            echo '❌ Pipeline failed!'

            echo '🔍 Check logs: sudo journalctl -u nginx -n 50'

        }

        always {

            echo '📊 Build finished at: ' + new Date().toString()

        }

    }

}
 
