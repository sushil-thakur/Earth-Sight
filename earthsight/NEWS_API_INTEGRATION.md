# 📰 News API Integration Guide

## Overview
Integrated NewsData.io API to display real-time environment-related news in the Deforestation dashboard.

## API Details

**Provider:** NewsData.io  
**API Key:** `pub_fdede469209846c3baed5ee2b2e31d52`  
**Endpoint:** `https://newsdata.io/api/1/news`  
**Documentation:** https://newsdata.io/documentation

## Features Implemented

### 1. Real-Time Environment News
- ✅ Fetches latest environment news from NewsData.io
- ✅ Displays only environment-related content
- ✅ Shows article images, titles, descriptions, and sources
- ✅ Links to original articles (opens in new tab)
- ✅ Automatic date formatting (e.g., "2 hours ago", "1 day ago")

### 2. Loading States
- ✅ Loading spinner while fetching news
- ✅ Error handling with retry button
- ✅ Empty state when no news available

### 3. News Display
- ✅ Card-based layout with hover effects
- ✅ Category badges (Environment, Science, etc.)
- ✅ Source attribution
- ✅ Clickable cards that open articles in new tab
- ✅ Image fallback if image fails to load
- ✅ Load more button with remaining count

## Environment Variables

### Added to `.env`:
```env
VITE_NEWS_API_KEY=pub_fdede469209846c3baed5ee2b2e31d52
VITE_NEWS_API_URL=https://newsdata.io/api/1
```

### Added to `.env.example`:
```env
VITE_NEWS_API_KEY=your_newsdata_api_key_here
VITE_NEWS_API_URL=https://newsdata.io/api/1
```

## Files Created

### `src/services/newsService.js`
Complete news service with:
- `getEnvironmentNews()` - Fetch environment news
- `searchEnvironmentNews()` - Search news by keywords
- `getNewsByTopic()` - Get news by specific topics (deforestation, climate, ocean, etc.)
- Date formatting utilities
- Category label mapping
- Default image fallbacks

## Files Modified

### `src/pages/Deforestation.jsx`
Changes:
1. Added `useEffect` to fetch news on component mount
2. Added loading/error states: `newsLoading`, `newsError`
3. Changed `allNews` from constant array to state variable
4. Updated news rendering with:
   - Loading spinner
   - Error message with retry
   - Empty state
   - Clickable news cards
   - Image error handling
   - Source attribution
   - Enhanced load more button

## API Parameters

### Fetch Environment News:
```javascript
getEnvironmentNews({
  category: 'environment',  // News category
  language: 'en',          // Language code
  size: 20,                // Number of articles (max 50)
  country: 'us'            // Optional: country filter
})
```

### Search by Keywords:
```javascript
searchEnvironmentNews('climate change', 10)
```

### Get by Topic:
```javascript
getNewsByTopic('deforestation', 10)
// Topics: deforestation, climate, ocean, wildlife, energy, pollution
```

## News Data Structure

Each news article contains:
```javascript
{
  id: "unique-article-id",
  title: "Article Title",
  description: "Article description or summary",
  date: "2 hours ago",
  category: "Environment",
  image: "https://image-url.com/image.jpg",
  source: "BBC News",
  link: "https://article-url.com",
  keywords: ["climate", "environment"],
  country: "us"
}
```

## API Limits

**Free Tier:**
- 200 requests per day
- Max 10 results per request
- Historical data: Last 7 days
- Updates: Every 15 minutes

**Paid Tier:**
- Increased rate limits
- Up to 50 results per request
- Historical data: Up to 30 days
- Real-time updates

## Error Handling

1. **Network Error:**
   - Shows error message
   - Displays retry button
   - Logs error to console

2. **API Error:**
   - Shows error from API response
   - Graceful fallback to empty state

3. **Image Load Error:**
   - Falls back to default placeholder image
   - Prevents broken image icons

## Testing

### Test in Browser:
1. Start dev server: `npm run dev`
2. Navigate to Deforestation dashboard
3. Check news section on right sidebar
4. Verify:
   - ✅ News loads automatically
   - ✅ All articles are environment-related
   - ✅ Images display correctly
   - ✅ Clicking article opens in new tab
   - ✅ Load more button works
   - ✅ Loading spinner shows initially

### Test Error Handling:
1. Temporarily remove API key from `.env`
2. Reload page
3. Verify error message and retry button appear

### Test Empty State:
1. Modify API query to return no results
2. Verify empty state message appears

## Benefits

✅ **Real-Time Content** - Latest environment news automatically fetched  
✅ **Relevant Content** - Only environment-related news displayed  
✅ **Reliable Source** - Aggregates from 80,000+ news sources  
✅ **Global Coverage** - News from around the world  
✅ **Automatic Updates** - No manual content management needed  
✅ **Professional UI** - Beautiful card-based layout with animations  
✅ **User Experience** - Loading states, error handling, clickable links  

## Future Enhancements

### Possible Improvements:
1. **Topic Filtering** - Filter by deforestation, climate, ocean, etc.
2. **Refresh Button** - Manual refresh without page reload
3. **Bookmarking** - Save favorite articles
4. **Search Feature** - Search news by keywords
5. **Pagination** - Load more with nextPage token from API
6. **Regional Filter** - Filter by country/region
7. **Date Range** - Filter by date range
8. **Sentiment Analysis** - Show positive/negative news sentiment

## Troubleshooting

### News Not Loading?
1. Check API key in `.env` file
2. Verify internet connection
3. Check console for error messages
4. Ensure dev server restarted after `.env` changes

### Images Not Displaying?
- Some articles may not have images
- Fallback placeholder images are provided
- Check browser console for CORS errors

### Rate Limit Exceeded?
- Free tier: 200 requests/day
- Consider caching responses
- Upgrade to paid tier if needed

---

**Integration Date:** October 19, 2025  
**Status:** ✅ Complete and Working  
**API Provider:** NewsData.io  
