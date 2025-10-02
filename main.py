"""
FastAPI server for the Customer Sentiment Alert System.
Provides REST API endpoints for real-time sentiment analysis of any company.
"""
import logging
import time
from typing import Dict, Any
from datetime import datetime

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

from crew_setup import SentimentAlertCrew
from config import settings


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Customer Sentiment Alert System",
    description="AI-powered real-time crisis prevention tool that analyzes REAL internet data for any company",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the crew
try:
    crew = SentimentAlertCrew()
    logger.info("✅ Customer Sentiment Alert System initialized successfully")
except Exception as e:
    logger.error(f"❌ Failed to initialize crew: {e}")
    crew = None


# Request models
class AnalysisRequest(BaseModel):
    """Request model for sentiment analysis."""
    company_name: str = Field(
        ..., 
        min_length=1, 
        max_length=100,
        description="Name of the company to analyze (e.g., 'Apple', 'Tesla')",
        example="Apple"
    )


# API Endpoints

@app.get("/")
async def root():
    """Root endpoint with system information."""
    return {
        "system": "Customer Sentiment Alert System",
        "description": "AI-powered real-time crisis prevention using REAL internet data",
        "version": "1.0.0",
        "features": [
            "Real internet search via Tavily API",
            "Multi-agent sentiment analysis",
            "Email preview generation (no actual sending)",
            "Fast (3 agents) and Deep (5 agents) workflows"
        ],
        "endpoints": {
            "fast_analysis": "POST /analyze/fast",
            "deep_analysis": "POST /analyze/deep", 
            "health_check": "GET /health",
            "supported_companies": "GET /supported-companies"
        },
        "timestamp": datetime.utcnow().isoformat()
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    if not crew:
        raise HTTPException(status_code=503, detail="Crew not initialized")
    
    return crew.get_health_status()


@app.get("/supported-companies")
async def get_supported_companies():
    """Get list of example companies and usage guidance."""
    if not crew:
        raise HTTPException(status_code=503, detail="Crew not initialized")
    
    return crew.get_supported_companies()


@app.post("/analyze/fast")
async def analyze_fast(request: AnalysisRequest):
    """
    Execute fast 3-agent sentiment analysis.
    
    **Workflow:** Monitor Agent → Sentiment Analyzer → Response Coordinator  
    **Expected Time:** 10-15 seconds  
    **Use Case:** Quick analysis for immediate response needs
    
    **Process:**
    1. Searches REAL internet via Tavily API for company mentions
    2. Analyzes sentiment of actual Twitter, Reddit, news mentions  
    3. Generates email previews for critical issues (doesn't send emails)
    
    **Returns:**
    - Real internet mentions found
    - Sentiment analysis results
    - Email previews for different departments
    - Processing time and performance metrics
    """
    if not crew:
        raise HTTPException(status_code=503, detail="Sentiment analysis system not available")
    
    logger.info(f"🚀 Fast analysis requested for: {request.company_name}")
    
    try:
        # Execute fast workflow
        results = crew.run_fast(request.company_name)
        
        if results.get("status") == "error":
            raise HTTPException(status_code=500, detail=results.get("error", "Analysis failed"))
        
        # Structure the response
        response = {
            "status": "success",
            "workflow": "fast", 
            "company": request.company_name,
            "agents_used": 3,
            "processing_time": results.get("processing_time"),
            "execution_timestamp": results.get("execution_timestamp"),
            "data_source": "tavily_real_internet_search",
            "search_platforms": ["Twitter/X", "Reddit", "News Sites", "Review Platforms"],
            "analysis": {
                "mentions_analyzed": "See detailed output",
                "sentiment_scores": "Calculated for each mention",
                "critical_issues_identified": "Flagged for immediate attention",
                "viral_potential_assessed": "Low/Medium/High for each mention"
            },
            "email_previews": {
                "note": "Email previews generated - no actual emails sent",
                "departments": ["Engineering", "PR/Marketing", "Customer Support"],
                "content": "See detailed crew output for full email previews"
            },
            "performance": results.get("performance", {}),
            "crew_output": results.get("crew_output"),
            "note": "This analysis uses REAL internet data from Tavily API, not mock data"
        }
        
        logger.info(f"✅ Fast analysis completed for {request.company_name}")
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Fast analysis failed for {request.company_name}: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@app.post("/analyze/deep")
async def analyze_deep(request: AnalysisRequest):
    """
    Execute comprehensive 5-agent sentiment analysis.
    
    **Workflow:** Monitor → Sentiment Analyzer → Priority Ranker → Context Investigator → Response Coordinator  
    **Expected Time:** 25-35 seconds  
    **Use Case:** Comprehensive analysis for strategic decision making
    
    **Process:**
    1. Comprehensive REAL internet search via Tavily API
    2. Advanced sentiment analysis with viral potential assessment
    3. Business impact prioritization with 0-100 scoring system
    4. Pattern investigation to identify systemic vs isolated issues
    5. Strategic response coordination with detailed email previews
    
    **Returns:**
    - Comprehensive real internet mention analysis
    - Business impact priority rankings
    - Pattern investigation results  
    - Detailed email previews for multiple departments
    - Strategic recommendations and timelines
    """
    if not crew:
        raise HTTPException(status_code=503, detail="Sentiment analysis system not available")
    
    logger.info(f"🔍 Deep analysis requested for: {request.company_name}")
    
    try:
        # Execute deep workflow
        results = crew.run_deep(request.company_name)
        
        if results.get("status") == "error":
            raise HTTPException(status_code=500, detail=results.get("error", "Analysis failed"))
        
        # Structure the comprehensive response
        response = {
            "status": "success",
            "workflow": "deep",
            "company": request.company_name,
            "agents_used": 5,
            "processing_time": results.get("processing_time"),
            "execution_timestamp": results.get("execution_timestamp"),
            "analysis_depth": "comprehensive",
            "data_source": "tavily_real_internet_search",
            "search_platforms": ["Twitter/X", "Reddit", "News Sites", "Review Platforms", "Forums"],
            "analysis": {
                "real_mentions_found": "Comprehensive internet search results",
                "sentiment_analysis": "Detailed scoring with viral potential",
                "priority_ranking": "Business impact scoring (0-100 points)",
                "pattern_investigation": "Systemic vs isolated issue analysis",
                "root_cause_analysis": "Evidence-based cause identification"
            },
            "email_previews": {
                "note": "Detailed email previews generated - no actual emails sent",
                "departments": ["Engineering", "PR/Marketing", "Customer Support", "Management"],
                "content_detail": "Comprehensive previews with evidence and timelines",
                "count": "3-5 detailed email previews based on analysis"
            },
            "strategic_insights": {
                "crisis_risk_assessment": "Evaluated based on real data patterns",
                "response_timeline": "Urgency-based recommendations",
                "business_impact": "Prioritized by potential revenue/reputation impact"
            },
            "performance": results.get("performance", {}),
            "capabilities": results.get("analysis_features", []),
            "crew_output": results.get("crew_output"),
            "note": "This comprehensive analysis uses REAL internet data from Tavily API"
        }
        
        logger.info(f"✅ Deep analysis completed for {request.company_name}")
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Deep analysis failed for {request.company_name}: {e}")
        raise HTTPException(status_code=500, detail=f"Comprehensive analysis failed: {str(e)}")


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler for unhandled errors."""
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "status": "error",
            "error": "Internal server error",
            "detail": str(exc),
            "timestamp": datetime.utcnow().isoformat()
        }
    )


if __name__ == "__main__":
    import uvicorn
    
    logger.info(f"🚀 Starting Customer Sentiment Alert System on {settings.API_HOST}:{settings.API_PORT}")
    uvicorn.run(
        "main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.DEBUG,
        log_level="info"
    )