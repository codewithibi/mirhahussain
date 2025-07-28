# Resolving the GitHub Security Rule Violation

GitHub has blocked your push because it detected a Groq API key in your commit history. Here are two ways to fix this issue:

## Option 1: Allow the Secret (Quick Solution)

1. Go to this URL provided by GitHub:
   https://github.com/codewithibi/mirhahussain/security/secret-scanning/unblock-secret/30UNo2shwzNe3OeVsq0ZDFXjAcO

2. Click "Unblock secret" and provide a reason like "API key has been rotated"

3. Try pushing again

## Option 2: Remove the Secret from Git History (Better Security)

This approach completely removes the API key from your Git history:

```bash
# Clone a fresh copy of the repository
git clone https://github.com/codewithibi/mirhahussain.git
cd mirhahussain

# Install BFG Repo-Cleaner
# Download from: https://rtyley.github.io/bfg-repo-cleaner/

# Replace the API key with "REMOVED-SECRET" in all files in the git history
java -jar bfg.jar --replace-text replacements.txt

# Create a file called replacements.txt with this content:
# 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=REMOVED-SECRET

# Clean up the repository
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push changes
git push --force
```

## Future Prevention

1. Always use environment variables for sensitive information
2. Add `.env` files to `.gitignore`
3. Consider using a pre-commit hook to check for secrets before committing 