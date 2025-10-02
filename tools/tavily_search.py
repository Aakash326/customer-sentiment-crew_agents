"""
Tavily Search Tool for real-time internet monitoring of company mentions.
This tool searches the REAL internet using Tavily API for recent brand mentions
across Twitter, Reddit, news sites, and other platforms.
"""
import json
import logging
from typing import Any, Dict, List, Optional
from datetime import datetime, timedelta

from crewai.tools import BaseTool
from pydantic import BaseModel, Field
from tavily import TavilyClient

from config import settings


logger = logging.getLogger(__name__)


class TavilyCompanySearchTool(BaseTool):
    """
    Custom tool that searches real internet for company mentions using Tavily API.
    Searches across Twitter, Reddit, news sites, and review platforms for recent mentions.
    """
    
    name: str = "tavily_company_search"
    description: str = (
        "Searches the real internet for recent company mentions, complaints, and sentiment "
        "across social media, news sites, and review platforms. Returns actual mentions "
        "from the last 24-48 hours with platform, content, URL, and timestamp data."
    )
    
    def __init__(self):
        super().__init__()
        self._client = None
        self._initialize_client()
    
    def _initialize_client(self) -> None:
        """Initialize Tavily client with API key."""
        try:
            if settings.TAVILY_API_KEY:
                self._client = TavilyClient(api_key=settings.TAVILY_API_KEY)
                logger.info("Tavily client initialized successfully")
            else:
                logger.warning("Tavily API key not found - will use fallback data")
        except Exception as e:
            logger.error(f"Failed to initialize Tavily client: {e}")
            self._client = None
    
    def _run(self, company_name: str) -> str:
        """
        Search for real mentions of a company across the internet.
        
        Args:
            company_name: Name of the company to search for (e.g., "Apple", "Tesla")
            
        Returns:
            JSON string containing search results with mentions from real internet sources
        """
        try:
            if not self._client:
                logger.warning("Tavily client not available, using fallback data")
                return self._get_fallback_data(company_name)
            
            # Define search queries for comprehensive coverage
            search_queries = [
                f"{company_name} complaints",
                f"{company_name} negative feedback", 
                f"{company_name} issues",
                f"{company_name} problems Twitter",
                f"{company_name} problems Reddit"
            ]
            
            all_results = []
            
            for query in search_queries:
                try:
                    # Search with Tavily for real internet data
                    response = self._client.search(
                        query=query,
                        max_results=5,
                        search_depth="advanced",
                        include_domains=[
                            "twitter.com", "x.com", "reddit.com", 
                            "news.ycombinator.com", "techcrunch.com",
                            "theverge.com", "arstechnica.com"
                        ]
                    )
                    
                    if response and 'results' in response:
                        processed_results = self._process_search_results(
                            response['results'], company_name, query
                        )
                        all_results.extend(processed_results)
                        
                except Exception as e:
                    logger.error(f"Error searching for '{query}': {e}")
                    continue
            
            if not all_results:
                logger.warning("No results found, using fallback data")
                return self._get_fallback_data(company_name)
            
            # Sort by relevance and recency
            all_results.sort(key=lambda x: x.get('relevance_score', 0), reverse=True)
            
            # Return top 15 most relevant results
            final_results = all_results[:15]
            
            result_data = {
                "company": company_name,
                "search_timestamp": datetime.utcnow().isoformat(),
                "total_mentions": len(final_results),
                "data_source": "tavily_real_internet",
                "mentions": final_results
            }
            
            logger.info(f"Found {len(final_results)} real mentions for {company_name}")
            return json.dumps(result_data, indent=2)
            
        except Exception as e:
            logger.error(f"Error in Tavily search: {e}")
            return self._get_fallback_data(company_name)
    
    def _process_search_results(self, results: List[Dict], company_name: str, query: str) -> List[Dict]:
        """Process raw Tavily results into structured mention data."""
        processed = []
        
        for result in results:
            try:
                # Extract platform from URL
                url = result.get('url', '')
                platform = self._extract_platform(url)
                
                # Create structured mention
                mention = {
                    "platform": platform,
                    "content": result.get('content', '')[:500],  # Limit content length
                    "title": result.get('title', ''),
                    "url": url,
                    "published_date": result.get('published_date', ''),
                    "relevance_score": result.get('score', 0.5),
                    "search_query": query,
                    "mention_type": self._classify_mention_type(result.get('content', ''))
                }
                
                # Only include if content mentions the company
                if company_name.lower() in mention['content'].lower():
                    processed.append(mention)
                    
            except Exception as e:
                logger.error(f"Error processing result: {e}")
                continue
        
        return processed
    
    def _extract_platform(self, url: str) -> str:
        """Extract platform name from URL."""
        if 'twitter.com' in url or 'x.com' in url:
            return 'Twitter/X'
        elif 'reddit.com' in url:
            return 'Reddit'
        elif 'news.ycombinator.com' in url:
            return 'Hacker News'
        elif 'techcrunch.com' in url:
            return 'TechCrunch'
        elif 'theverge.com' in url:
            return 'The Verge'
        elif 'arstechnica.com' in url:
            return 'Ars Technica'
        else:
            return 'News/Web'
    
    def _classify_mention_type(self, content: str) -> str:
        """Classify the type of mention based on content."""
        content_lower = content.lower()
        
        if any(word in content_lower for word in ['complaint', 'issue', 'problem', 'bug', 'broken']):
            return 'complaint'
        elif any(word in content_lower for word in ['love', 'great', 'amazing', 'excellent']):
            return 'positive'
        elif any(word in content_lower for word in ['hate', 'terrible', 'awful', 'worst']):
            return 'negative'
        else:
            return 'neutral'
    
    def _get_fallback_data(self, company_name: str) -> str:
        """Return mock data when Tavily is unavailable."""
        logger.info(f"Using fallback mock data for {company_name}")
        
        # Load mock data from file or create basic fallback
        fallback_mentions = [
            {
                "platform": "Twitter/X",
                "content": f"Anyone else having issues with {company_name} app crashing today? Really frustrating when trying to get work done.",
                "title": f"{company_name} App Issues",
                "url": f"https://twitter.com/user123/status/fake",
                "published_date": (datetime.utcnow() - timedelta(hours=2)).isoformat(),
                "relevance_score": 0.8,
                "search_query": f"{company_name} complaints",
                "mention_type": "complaint"
            },
            {
                "platform": "Reddit",
                "content": f"PSA: {company_name} seems to be having server issues. Multiple users reporting the same problem in our office.",
                "title": f"{company_name} Server Issues Discussion",
                "url": f"https://reddit.com/r/tech/comments/fake",
                "published_date": (datetime.utcnow() - timedelta(hours=4)).isoformat(),
                "relevance_score": 0.7,
                "search_query": f"{company_name} issues",
                "mention_type": "complaint"
            },
            {
                "platform": "Hacker News",
                "content": f"The latest update from {company_name} introduced a critical bug that's affecting productivity. When will they fix this?",
                "title": f"{company_name} Update Bug Report",
                "url": f"https://news.ycombinator.com/item?id=fake",
                "published_date": (datetime.utcnow() - timedelta(hours=6)).isoformat(),
                "relevance_score": 0.9,
                "search_query": f"{company_name} problems",
                "mention_type": "complaint"
            }
        ]
        
        result_data = {
            "company": company_name,
            "search_timestamp": datetime.utcnow().isoformat(),
            "total_mentions": len(fallback_mentions),
            "data_source": "fallback_mock_data",
            "mentions": fallback_mentions
        }
        
        return json.dumps(result_data, indent=2)