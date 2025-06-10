# Security Guidelines

This document outlines the security measures implemented in the 3rd Grade Prep App and provides guidelines for secure deployment and usage.

## 🔒 Security Features Implemented

### 1. Input Validation & Sanitization
- **SecureInput Component**: All user inputs are validated and sanitized
- **Character Filtering**: Only educational content characters allowed
- **Length Limits**: Maximum input length enforced (500 characters)
- **XSS Prevention**: HTML tags and JavaScript removed from inputs

### 2. API Security
- **API Key Validation**: Format validation before API calls
- **Rate Limiting**: 10 requests per minute per user
- **Request Timeout**: 10-second timeout on API calls
- **Input Sanitization**: All prompts sanitized before sending to API
- **Response Validation**: API responses validated and sanitized
- **Safety Settings**: Gemini API configured with safety filters

### 3. Content Security Policy (CSP)
- **Strict CSP Headers**: Implemented in index.html
- **Script Sources**: Only self and inline scripts allowed
- **External Resources**: Limited to trusted domains (Google Fonts, Gemini API)
- **Frame Protection**: Prevents embedding in iframes

### 4. Error Handling
- **Error Boundaries**: React error boundaries catch and handle errors
- **Safe Error Messages**: No sensitive information exposed in error messages
- **Secure Logging**: Errors logged without exposing sensitive data

### 5. Security Headers
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **X-Frame-Options**: Prevents clickjacking attacks
- **X-XSS-Protection**: Browser XSS protection enabled
- **Referrer Policy**: Strict referrer policy implemented

## 🛡️ Deployment Security

### Environment Variables
```bash
# Use strong, unique API keys
VITE_GEMINI_API_KEY=your_secure_api_key_here

# Set production environment
NODE_ENV=production
```

### HTTPS Configuration
- **Always use HTTPS** in production
- **HTTP Strict Transport Security (HSTS)** recommended
- **Secure cookie settings** if using authentication

### API Key Management
1. **Restrict API Key Permissions**: Only enable necessary APIs
2. **Use Environment-Specific Keys**: Different keys for dev/staging/prod
3. **Regular Rotation**: Rotate API keys periodically
4. **Monitor Usage**: Watch for unusual API usage patterns
5. **Never Commit Keys**: Use .env files and .gitignore

## 🔍 Security Monitoring

### What to Monitor
- Unusual API usage patterns
- High error rates
- Failed validation attempts
- Rate limit violations

### Logging
- All API errors are logged (without sensitive data)
- Input validation failures are tracked
- Rate limit violations are recorded

## 🚨 Security Incident Response

### If You Suspect a Security Issue
1. **Immediately rotate API keys**
2. **Check API usage logs** for unusual activity
3. **Review error logs** for attack patterns
4. **Update dependencies** if vulnerabilities found

### Reporting Security Issues
- Create a private issue in the repository
- Include steps to reproduce (if safe)
- Do not publicly disclose until fixed

## 📋 Security Checklist for Deployment

### Pre-Deployment
- [ ] API keys are environment-specific and restricted
- [ ] All dependencies are up to date
- [ ] Security headers are configured
- [ ] CSP is properly set up
- [ ] Error messages don't expose sensitive information

### Post-Deployment
- [ ] HTTPS is enforced
- [ ] API usage monitoring is active
- [ ] Error logging is working
- [ ] Rate limiting is functional
- [ ] Security headers are being sent

### Regular Maintenance
- [ ] Update dependencies monthly
- [ ] Rotate API keys quarterly
- [ ] Review security logs weekly
- [ ] Test security measures regularly

## 🔧 Security Configuration

### Vite Configuration
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block'
    }
  }
})
```

### ESLint Security Rules
```javascript
// .eslintrc.cjs
rules: {
  'no-eval': 'error',
  'no-implied-eval': 'error',
  'no-new-func': 'error',
  'no-script-url': 'error'
}
```

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [React Security Best Practices](https://snyk.io/blog/10-react-security-best-practices/)
- [Content Security Policy Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Google API Security Best Practices](https://cloud.google.com/docs/security/best-practices)

## 🆘 Emergency Contacts

For security emergencies:
1. Disable API keys immediately
2. Contact your system administrator
3. Document the incident
4. Follow your organization's incident response plan

---

**Remember**: Security is an ongoing process, not a one-time setup. Regularly review and update these measures as the application evolves.