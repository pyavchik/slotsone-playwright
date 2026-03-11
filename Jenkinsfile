pipeline {
    agent any

    environment {
        ADMIN_EMAIL    = credentials('admin-email')
        ADMIN_PASSWORD = credentials('admin-password')
        CI             = 'true'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '2'))
    }

    stages {
        stage('Clean') {
            steps {
                sh 'rm -rf allure-results allure-report playwright-report test-results'
            }
        }

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
                sh 'allure generate allure-results -o allure-report --clean || true'
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
        }
    }
}
