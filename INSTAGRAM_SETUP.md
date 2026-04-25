# Instagram Integration Setup Instructions

## Your Instagram Details
- **Handle**: @himalayanmarvels.travel
- **User ID**: 17841421454792167

## Step-by-Step Setup

### 1. Create a Facebook App
1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Click **Create App** → select **Use Cases** → **Access Instagram Basic Display**
3. Fill in app details and create

### 2. Configure Instagram Basic Display
1. In your app dashboard, go to **Products** → **Instagram Basic Display**
2. Click **Set Up** → **Create New App** (or select existing)
3. Under **User Token Generator**, click **Add or Remove Instagram Testers**
4. Add your Instagram account as a tester

### 3. Generate Access Token
1. Still in **Instagram Basic Display**, go to **User Token Generator**
2. Select your Instagram account from the dropdown
3. Click **Generate Token** and authorize the app
4. **Copy the access token** (it looks like: `IGQWR...`)

### 4. Add Access Token to Environment Variables
Add this line to your `.env.local` file:

```env
INSTAGRAM_ACCESS_TOKEN=your_access_token_here
```

Replace `your_access_token_here` with the token you copied.

### 5. Restart Development Server
```bash
npm run dev
```

## Important Notes

- **Token Expiration**: The long-lived token expires in 60 days
- **Refresh Token**: You may need to refresh the token periodically
- **Rate Limits**: Instagram API has rate limits (200 calls/hour)
- **Requirements**: Your Instagram account must be a **Business** or **Creator** account

## Token Refresh (Optional)
For automatic token refresh, you can extend the token to 60 days:
```bash
curl -X GET "https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=YOUR_TOKEN"
```

## Testing
After setup, visit `/api/instagram` to see if your posts are loading correctly.

---

**Need help?** The site will show fallback placeholder posts if the token is not configured yet.
