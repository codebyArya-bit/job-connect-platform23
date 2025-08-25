# 🚀 JobConnect - Automated Vercel Deployment Setup

This guide provides **automated scripts** to set up your JobConnect application on Vercel with all required environment variables.

## 📋 Quick Setup Options

### Option 1: PowerShell Script (Recommended for Windows)

```powershell
# Run this command in PowerShell (as Administrator)
.\setup-vercel-env.ps1
```

### Option 2: Node.js Script (Cross-platform)

```bash
# Run this command in your terminal
node setup-vercel-env.js
```

## 🔧 What These Scripts Do

1. **Install Vercel CLI** (if not already installed)
2. **Authenticate with Vercel** (opens browser for login)
3. **Set Environment Variables**:
   - `MONGODB_URI` - MongoDB Atlas connection
   - `JWT_SECRET` - Secure authentication token
   - `JWT_EXPIRE` - Token expiration time
   - `NODE_ENV` - Production environment
   - `CLIENT_URL` - Frontend URL
   - `API_BASE_URL` - Backend API URL
   - `PORT` - Server port
4. **Trigger Production Deployment**
5. **Provide Status Updates**

## 🎯 Expected Results

After running the script:
- ✅ All environment variables configured in Vercel
- ✅ Production deployment triggered automatically
- ✅ Application live at: https://jobcon-six.vercel.app
- ✅ Full functionality: authentication, job management, database connection

## 🔍 Manual Verification

If you prefer to verify manually:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `jobcon-six` project
3. Navigate to **Settings** → **Environment Variables**
4. Verify all variables are present
5. Go to **Deployments** and trigger a redeploy if needed

## 🆘 Troubleshooting

### Script Fails to Run
- Ensure you have Node.js installed
- Run PowerShell as Administrator
- Check internet connection

### Authentication Issues
- Make sure you're logged into the correct Vercel account
- Try `vercel logout` then run the script again

### Environment Variables Not Set
- Manually add them in Vercel Dashboard
- Use the values from the `.env` file in this directory

### Deployment Still Shows 404
- Wait 2-3 minutes for deployment to complete
- Check Vercel deployment logs for errors
- Verify MongoDB Atlas connection string is correct

## 📞 Support

If you encounter issues:
1. Check the Vercel deployment logs
2. Verify all environment variables are set correctly
3. Ensure MongoDB Atlas cluster is accessible
4. Contact support with specific error messages

---

**🎉 Your JobConnect application should be fully functional after running these scripts!**