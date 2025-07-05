# Deployment Guide for Vercel

## Environment Variables Setup

1. **MongoDB URI**: Make sure to set the `MONGO_URI` environment variable in your Vercel project settings:
   ```
   MONGO_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/your-database?retryWrites=true&w=majority
   ```

2. **Access your Vercel dashboard**:
   - Go to your project in Vercel
   - Navigate to Settings → Environment Variables
   - Add the `MONGO_URI` variable with your MongoDB connection string

## Troubleshooting Steps

### 1. Check Environment Variables
- Verify `MONGO_URI` is set in Vercel project settings
- Ensure the MongoDB connection string is correct
- Check that your MongoDB cluster allows connections from Vercel's IP ranges

### 2. Test Database Connection
- Visit `/api/health` on your deployed site to test the database connection
- This will show if the MongoDB connection is working

### 3. Check API Routes
- Test individual API routes:
  - `/api/transactions` (GET)
  - `/api/budgets` (GET)
  - `/api/health` (GET)

### 4. Common Issues

#### "Unexpected end of JSON input" Error
This usually means:
- API route is returning an empty response
- Database connection failed
- Environment variables are not set correctly

#### Solutions:
1. Check Vercel function logs for errors
2. Verify MongoDB connection string
3. Ensure MongoDB cluster is accessible
4. Check if your MongoDB cluster has proper network access

### 5. MongoDB Atlas Setup
If using MongoDB Atlas:
1. Create a cluster
2. Add your IP to the IP Access List (or use 0.0.0.0/0 for all IPs)
3. Create a database user with read/write permissions
4. Get the connection string and add it to Vercel environment variables

### 6. Vercel Function Logs
- Check Vercel function logs in the dashboard
- Look for any error messages related to database connection
- Verify that the `MONGO_URI` environment variable is being read correctly

## Health Check Endpoint
The app includes a health check endpoint at `/api/health` that will help diagnose deployment issues. It checks:
- Database connection status
- Environment variable configuration
- API response format

Visit this endpoint on your deployed site to verify everything is working correctly. 