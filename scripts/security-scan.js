#!/usr/bin/env node

/**
 * Security Scan Script for Meauxbility
 * Comprehensive security scanning and vulnerability detection
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Security scan configuration
const SECURITY_CONFIG = {
  enabled: process.env.SECURITY_SCAN_ENABLED === 'true',
  secretScanning: process.env.SECRET_SCANNING_ENABLED === 'true',
  dependencyScan: true,
  codeScan: true,
  reportPath: './security-reports'
};

/**
 * Main security scan function
 */
async function runSecurityScan() {
  console.log('🔒 Starting comprehensive security scan...');

  if (!SECURITY_CONFIG.enabled) {
    console.log('⚠️  Security scanning is disabled');
    return;
  }

  try {
    // Create reports directory
    if (!fs.existsSync(SECURITY_CONFIG.reportPath)) {
      fs.mkdirSync(SECURITY_CONFIG.reportPath, { recursive: true });
    }

    const scanResults = {
      timestamp: new Date().toISOString(),
      repository: 'meauxbility',
      scans: {}
    };

    // 1. Secret scanning
    if (SECURITY_CONFIG.secretScanning) {
      console.log('🔐 Scanning for secrets...');
      scanResults.scans.secrets = await scanForSecrets();
    }

    // 2. Dependency scanning
    if (SECURITY_CONFIG.dependencyScan) {
      console.log('📦 Scanning dependencies...');
      scanResults.scans.dependencies = await scanDependencies();
    }

    // 3. Code security scanning
    if (SECURITY_CONFIG.codeScan) {
      console.log('🛡️  Scanning code for security issues...');
      scanResults.scans.code = await scanCodeSecurity();
    }

    // 4. Generate report
    await generateSecurityReport(scanResults);

    console.log('✅ Security scan completed successfully!');
    console.log(`📊 Report saved to: ${SECURITY_CONFIG.reportPath}/security-report.json`);

  } catch (error) {
    console.error('❌ Security scan failed:', error.message);
    process.exit(1);
  }
}

/**
 * Scan for secrets and sensitive information
 */
async function scanForSecrets() {
  const secretPatterns = [
    { pattern: /password\s*=\s*["'][^"']+["']/gi, type: 'password' },
    { pattern: /api[_-]?key\s*=\s*["'][^"']+["']/gi, type: 'api_key' },
    { pattern: /secret\s*=\s*["'][^"']+["']/gi, type: 'secret' },
    { pattern: /token\s*=\s*["'][^"']+["']/gi, type: 'token' },
    { pattern: /private[_-]?key\s*=\s*["'][^"']+["']/gi, type: 'private_key' },
    { pattern: /aws[_-]?access[_-]?key/gi, type: 'aws_key' },
    { pattern: /github[_-]?token/gi, type: 'github_token' },
    { pattern: /notion[_-]?api[_-]?key/gi, type: 'notion_key' }
  ];

  const findings = [];
  const files = getAllFiles('.', ['.git', 'node_modules', 'security-reports']);

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      for (const { pattern, type } of secretPatterns) {
        const matches = content.match(pattern);
        if (matches) {
          matches.forEach(match => {
            // Skip if it's a placeholder or example
            if (!match.includes('your_') && !match.includes('example') && !match.includes('placeholder')) {
              findings.push({
                file,
                type,
                match: match.substring(0, 50) + '...',
                severity: 'high'
              });
            }
          });
        }
      }
    } catch (error) {
      // Skip files that can't be read
    }
  }

  return {
    status: findings.length === 0 ? 'clean' : 'issues_found',
    findings,
    count: findings.length
  };
}

/**
 * Scan dependencies for vulnerabilities
 */
async function scanDependencies() {
  try {
    // Check if package.json exists
    if (!fs.existsSync('package.json')) {
      return { status: 'no_dependencies', message: 'No package.json found' };
    }

    // Run npm audit
    const auditResult = execSync('npm audit --json', { encoding: 'utf8' });
    const auditData = JSON.parse(auditResult);

    return {
      status: auditData.vulnerabilities ? 'vulnerabilities_found' : 'clean',
      vulnerabilities: auditData.vulnerabilities || 0,
      dependencies: auditData.dependencies || 0,
      advisories: auditData.advisories || {}
    };
  } catch (error) {
    return {
      status: 'error',
      message: error.message
    };
  }
}

/**
 * Scan code for security issues
 */
async function scanCodeSecurity() {
  const securityIssues = [];
  const files = getAllFiles('.', ['.git', 'node_modules', 'security-reports']);

  for (const file of files) {
    if (file.endsWith('.js') || file.endsWith('.ts')) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        // Check for common security issues
        const issues = [
          { pattern: /eval\s*\(/g, type: 'eval_usage', severity: 'high' },
          { pattern: /innerHTML\s*=/g, type: 'innerHTML_usage', severity: 'medium' },
          { pattern: /document\.write/g, type: 'document_write', severity: 'medium' },
          { pattern: /setTimeout\s*\(\s*["'][^"']*["']/g, type: 'string_setTimeout', severity: 'low' },
          { pattern: /console\.log\s*\([^)]*process\.env/g, type: 'env_logging', severity: 'medium' }
        ];

        for (const { pattern, type, severity } of issues) {
          const matches = content.match(pattern);
          if (matches) {
            matches.forEach(match => {
              securityIssues.push({
                file,
                type,
                severity,
                match: match.substring(0, 100) + '...'
              });
            });
          }
        }
      } catch (error) {
        // Skip files that can't be read
      }
    }
  }

  return {
    status: securityIssues.length === 0 ? 'clean' : 'issues_found',
    issues: securityIssues,
    count: securityIssues.length
  };
}

/**
 * Get all files in directory recursively
 */
function getAllFiles(dir, exclude = []) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (!exclude.includes(item)) {
          traverse(fullPath);
        }
      } else {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

/**
 * Generate comprehensive security report
 */
async function generateSecurityReport(scanResults) {
  const reportPath = path.join(SECURITY_CONFIG.reportPath, 'security-report.json');
  
  // Add summary
  scanResults.summary = {
    totalScans: Object.keys(scanResults.scans).length,
    criticalIssues: 0,
    warnings: 0,
    status: 'clean'
  };

  // Calculate summary
  for (const [scanType, results] of Object.entries(scanResults.scans)) {
    if (results.status === 'issues_found' || results.status === 'vulnerabilities_found') {
      scanResults.summary.status = 'issues_found';
      scanResults.summary.warnings += results.count || results.vulnerabilities || 0;
    }
  }

  // Write report
  fs.writeFileSync(reportPath, JSON.stringify(scanResults, null, 2));
  
  // Generate human-readable report
  const humanReport = generateHumanReadableReport(scanResults);
  fs.writeFileSync(
    path.join(SECURITY_CONFIG.reportPath, 'security-report.md'),
    humanReport
  );
}

/**
 * Generate human-readable security report
 */
function generateHumanReadableReport(scanResults) {
  let report = `# Security Scan Report - Meauxbility\n\n`;
  report += `**Generated:** ${scanResults.timestamp}\n`;
  report += `**Repository:** ${scanResults.repository}\n`;
  report += `**Status:** ${scanResults.summary.status}\n\n`;

  for (const [scanType, results] of Object.entries(scanResults.scans)) {
    report += `## ${scanType.charAt(0).toUpperCase() + scanType.slice(1)} Scan\n\n`;
    
    if (results.status === 'clean') {
      report += `✅ **Status:** Clean - No issues found\n\n`;
    } else {
      report += `⚠️  **Status:** Issues found\n`;
      report += `**Count:** ${results.count || results.vulnerabilities || 0}\n\n`;
      
      if (results.findings) {
        report += `### Findings:\n`;
        results.findings.forEach(finding => {
          report += `- **File:** ${finding.file}\n`;
          report += `  **Type:** ${finding.type}\n`;
          report += `  **Severity:** ${finding.severity}\n\n`;
        });
      }
    }
  }

  report += `## Recommendations\n\n`;
  report += `1. **Regular Scans:** Run security scans before each deployment\n`;
  report += `2. **Secret Management:** Use environment variables for sensitive data\n`;
  report += `3. **Dependency Updates:** Keep dependencies up to date\n`;
  report += `4. **Code Review:** Review all code changes for security issues\n`;
  report += `5. **Access Control:** Regularly review team access permissions\n\n`;
  
  report += `---\n`;
  report += `*This report emphasizes the importance of security in development, reflecting our values of hard work, willpower, and community protection.*\n`;

  return report;
}

/**
 * Main execution
 */
function main() {
  runSecurityScan().catch(console.error);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { runSecurityScan };
