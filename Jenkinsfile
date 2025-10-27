pipeline {
    agent none
    environment {
        BUILD_DIR = '/var/www/react-app'
        FRONTEND_DIR = 'frontend_latest'  // Added subdirectory path
    }
    stages {
        stage('Checkout') {
            agent { label 'mvp_backend' }
            steps {
                echo '📥 Checking out React code from GitHub...'
                checkout scm
            }
        }
        
        stage('Verify Structure') {
            agent { label 'mvp_backend' }
            steps {
                echo '🔍 Verifying repository structure...'
                sh '''
                    echo "📂 Repository contents:"
                    ls -la
                    echo "\n📂 Frontend directory contents:"
                    ls -la ${FRONTEND_DIR}/
                    if [ ! -f "${FRONTEND_DIR}/package.json" ]; then
                        echo "❌ ERROR: package.json not found in ${FRONTEND_DIR}/"
                        exit 1
                    fi
                    echo "✅ package.json found!"
                '''
            }
        }
        
        stage('Install Dependencies') {
            agent { label 'mvp_backend' }
            steps {
                echo '📦 Installing npm dependencies...'
                sh '''
                    cd ${FRONTEND_DIR}
                    # Clean install
                    rm -rf node_modules package-lock.json
                    npm install
                '''
            }
        }
        
        stage('Build React App') {
            agent { label 'mvp_backend' }
            steps {
                echo '🔨 Building React production build...'
                sh '''
                    cd ${FRONTEND_DIR}
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
            agent { label 'mvp_backend' }
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
                    # Copy new build files from frontend_latest/build
                    sudo cp -r ${FRONTEND_DIR}/build/* ${BUILD_DIR}/
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
            agent { label 'mvp_backend' }
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
            echo '🌐 React App: http://13.203.77.35'
            echo '🔗 FastAPI Backend: http://3.6.126.59:8000'
            echo '📖 API Docs: http://3.6.126.59:8000/docs'
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
