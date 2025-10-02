"""
Main CrewAI setup and orchestration for the Customer Sentiment Alert System.
Provides unified interface for both Fast and Deep analysis workflows.
"""
import logging
import time
from typing import Dict, Any, Optional
from datetime import datetime

from langchain_openai import ChatOpenAI

from workflows.fast_workflow import FastWorkflow
from workflows.deep_workflow import DeepWorkflow
from config import settings


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class SentimentAlertCrew:
    """
    Main orchestration class for the Customer Sentiment Alert System.
    
    Manages both Fast (3 agents) and Deep (5 agents) analysis workflows.
    Searches REAL internet data using Tavily API and generates email previews.
    """
    
    def __init__(self):
        """Initialize the crew with workflow instances."""
        logger.info("Initializing Customer Sentiment Alert System...")
        
        # Validate configuration
        self._validate_config()
        
        # Initialize workflows
        self.fast_workflow = FastWorkflow()
        self.deep_workflow = DeepWorkflow()
        
        logger.info("✅ Crew initialization complete")
    
    def _validate_config(self) -> None:
        """Validate required configuration settings."""
        if not settings.OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY is required but not set")
        
        if not settings.TAVILY_API_KEY:
            logger.warning("⚠️  TAVILY_API_KEY not set - will use fallback data")
        else:
            logger.info("✅ Tavily API configured for real internet search")
    
    def run_fast(self, company_name: str) -> Dict[str, Any]:
        """
        Execute fast 3-agent analysis workflow.
        
        Workflow: Monitor Agent → Sentiment Analyzer → Response Coordinator
        Expected Time: 10-15 seconds
        
        Args:
            company_name: Name of company to analyze (e.g., "Apple", "Tesla")
            
        Returns:
            Dictionary containing analysis results and email previews
        """
        if not company_name or not company_name.strip():
            return {
                "status": "error",
                "error": "Company name is required",
                "workflow": "fast"
            }
        
        company_name = company_name.strip()
        logger.info(f"🚀 Starting FAST analysis for: {company_name}")
        
        try:
            # Execute fast workflow
            results = self.fast_workflow.run(company_name)
            
            # Add additional metadata
            results.update({
                "data_sources": ["Twitter/X", "Reddit", "News Sites", "Review Platforms"],
                "search_method": "Tavily Real Internet Search",
                "email_status": "Previews Only - No Emails Sent",
                "workflow_description": "Quick 3-agent analysis for immediate insights"
            })
            
            logger.info(f"✅ Fast analysis complete for {company_name} in {results.get('processing_time', 'unknown')}")
            return results
            
        except Exception as e:
            logger.error(f"❌ Fast workflow failed for {company_name}: {e}")
            return {
                "status": "error",
                "workflow": "fast",
                "company": company_name,
                "error": str(e),
                "execution_timestamp": datetime.utcnow().isoformat()
            }
    
    def run_deep(self, company_name: str) -> Dict[str, Any]:
        """
        Execute comprehensive 5-agent analysis workflow.
        
        Workflow: Monitor → Sentiment Analyzer → Priority Ranker → Context Investigator → Response Coordinator
        Expected Time: 25-35 seconds
        
        Args:
            company_name: Name of company to analyze (e.g., "Apple", "Tesla")
            
        Returns:
            Dictionary containing comprehensive analysis results and detailed email previews
        """
        if not company_name or not company_name.strip():
            return {
                "status": "error", 
                "error": "Company name is required",
                "workflow": "deep"
            }
        
        company_name = company_name.strip()
        logger.info(f"🔍 Starting DEEP analysis for: {company_name}")
        
        try:
            # Execute deep workflow
            results = self.deep_workflow.run(company_name)
            
            # Add additional metadata
            results.update({
                "data_sources": ["Twitter/X", "Reddit", "News Sites", "Review Platforms", "Forums"],
                "search_method": "Tavily Real Internet Search",
                "email_status": "Detailed Previews Only - No Emails Sent",
                "workflow_description": "Comprehensive 5-agent analysis with pattern investigation",
                "analysis_features": [
                    "Real-time internet monitoring",
                    "Advanced sentiment analysis",
                    "Business impact prioritization", 
                    "Pattern and root cause investigation",
                    "Strategic response coordination"
                ]
            })
            
            logger.info(f"✅ Deep analysis complete for {company_name} in {results.get('processing_time', 'unknown')}")
            return results
            
        except Exception as e:
            logger.error(f"❌ Deep workflow failed for {company_name}: {e}")
            return {
                "status": "error",
                "workflow": "deep",
                "company": company_name,
                "error": str(e),
                "execution_timestamp": datetime.utcnow().isoformat()
            }
    
    def get_health_status(self) -> Dict[str, Any]:
        """
        Get system health and configuration status.
        
        Returns:
            Dictionary containing system health information
        """
        return {
            "status": "healthy",
            "system": "Customer Sentiment Alert System",
            "version": "1.0.0",
            "capabilities": {
                "real_internet_search": bool(settings.TAVILY_API_KEY),
                "openai_configured": bool(settings.OPENAI_API_KEY),
                "workflows_available": ["fast", "deep"],
                "agent_count": {
                    "fast_workflow": 3,
                    "deep_workflow": 5
                }
            },
            "configuration": {
                "openai_model": settings.OPENAI_MODEL_NAME,
                "tavily_configured": bool(settings.TAVILY_API_KEY),
                "debug_mode": settings.DEBUG
            },
            "features": [
                "Real-time internet monitoring via Tavily",
                "Multi-agent sentiment analysis",
                "Business impact prioritization",
                "Pattern investigation",
                "Email preview generation (no actual sending)"
            ],
            "timestamp": datetime.utcnow().isoformat()
        }
    
    def get_supported_companies(self) -> Dict[str, Any]:
        """
        Get list of example companies that can be analyzed.
        
        Returns:
            Dictionary containing example companies and usage guidance
        """
        return {
            "supported": "ANY COMPANY - Real internet search works for any brand",
            "examples": [
                "Apple", "Google", "Microsoft", "Amazon", "Tesla",
                "Meta", "Netflix", "Spotify", "Adobe", "Uber", 
                "Samsung", "Intel", "NVIDIA", "Salesforce", "Zoom"
            ],
            "usage_tips": [
                "Use exact company names for best results",
                "Works for any brand with online presence",
                "Searches real Twitter, Reddit, news sites",
                "Analyzes mentions from last 24-48 hours"
            ],
            "note": "This system searches REAL internet data via Tavily API"
        }