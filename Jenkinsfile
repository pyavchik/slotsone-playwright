pipeline {
    agent any

    environment {
        ADMIN_EMAIL    = credentials('admin-email')
        ADMIN_PASSWORD = credentials('admin-password')
    }

    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
                sh 'npx playwright install chromium'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npx playwright test || true'
            }
        }

        stage('Generate Allure Report') {
            steps {
                sh 'allure generate allure-results --clean -o allure-report'
            }
        }
    }

    post {
        always {
            publishHTML(target: [
                reportDir: 'allure-report',
                reportFiles: 'index.html',
                reportName: 'Allure Report',
                keepAll: true,
                alwaysLinkToLastBuild: true,
                allowMissing: true
            ])
            publishHTML(target: [
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Report',
                keepAll: true,
                alwaysLinkToLastBuild: true,
                allowMissing: true
            ])
            archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
        }
    }
}
