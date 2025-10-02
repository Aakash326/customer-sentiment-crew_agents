"""
Fast Workflow - 3 Agent Analysis Pipeline
Provides quick sentiment analysis in 10-15 seconds using Monitor, Sentiment Analyzer, and Response Coordinator.
"""
import time
import json
from typing import Dict, Any
from datetime import datetime

from crewai import Task, Crew, Process
from langchain_openai import ChatOpenAI

from agents.monitor_agent import create_monitor_agent
from agents.sentiment_analyzer import create_sentiment_analyzer
from agents.response_coordinator import create_response_coordinator
from config import settings


class FastWorkflow:
    """
    Fast 3-agent workflow for quick sentiment analysis.
    
    Workflow: Monitor Agent → Sentiment Analyzer → Response Coordinator
    Expected Time: 10-15 seconds
    Use Case: Quick analysis for immediate response needs
    """
    
    def __init__(self):
        """Initialize the fast workflow with required agents."""
        # Create shared LLM instance
        self.llm = ChatOpenAI(
            model=settings.OPENAI_MODEL_NAME,
            api_key=settings.OPENAI_API_KEY,
            temperature=0.3
        )
        
        # Initialize agents
        self.monitor_agent = create_monitor_agent(self.llm)
        self.sentiment_analyzer = create_sentiment_analyzer(self.llm)
        self.response_coordinator = create_response_coordinator(self.llm)
    
    def create_tasks(self, company_name: str) -> list[Task]:
        """
        Create the task sequence for fast workflow.
        
        Args:
            company_name: Name of the company to analyze (e.g., "Apple", "Tesla")
            
        Returns:
            List of tasks configured for the fast workflow
        """
        
        # Task 1: Search real internet for company mentions
        monitor_task = Task(
            description=(
                f"Search the real internet for recent mentions of {company_name} using Tavily API. "
                f"Focus on finding actual customer complaints, issues, and negative sentiment from "
                f"Twitter, Reddit, news sites, and review platforms from the last 24-48 hours. "
                f"Return structured data with platform, content, URLs, timestamps, and relevance scores. "
                f"This should be REAL internet data, not mock data."
            ),
            expected_output=(
                "JSON formatted data containing real internet mentions of the company including: "
                "platform name, content text, URLs, publication dates, relevance scores, and mention types. "
                "Minimum 5-15 real mentions from actual internet sources."
            ),
            agent=self.monitor_agent,
            output_file=f"outputs/monitor_{company_name.lower()}_fast.json"
        )
        
        # Task 2: Analyze sentiment of real mentions
        sentiment_task = Task(
            description=(
                f"Analyze the sentiment of real {company_name} mentions from the Monitor Agent. "
                f"For each mention, provide: sentiment score (-1 to +1), urgency level (0-10), "
                f"user influence estimation, and viral potential (Low/Medium/High). "
                f"Flag any mentions with sentiment < -0.5 as 'critical'. "
                f"Focus on the most negative and potentially damaging mentions."
            ),
            expected_output=(
                "JSON formatted analysis with each mention including: "
                "sentiment_score, urgency_level, user_influence, viral_potential, critical_flag, "
                "and reasoning for the assessment. Include summary statistics and top critical issues."
            ),
            agent=self.sentiment_analyzer,
            context=[monitor_task],
            output_file=f"outputs/sentiment_{company_name.lower()}_fast.json"
        )
        
        # Task 3: Create email previews for critical issues
        response_task = Task(
            description=(
                f"Based on the sentiment analysis of {company_name} mentions, create email previews "
                f"for the most critical issues. Generate 1-3 email previews showing what WOULD be sent to: "
                f"1) Engineering team (for technical issues), "
                f"2) PR team (for reputation management), "
                f"3) Support team (for customer response templates). "
                f"Each email should include appropriate recipient, subject line, priority level, "
                f"issue summary, evidence from real mentions, and recommended actions. "
                f"DO NOT actually send emails - only create previews."
            ),
            expected_output=(
                "Formatted email previews showing exactly what would be sent to different departments. "
                "Include email headers (To, Subject, Priority), full message bodies with evidence "
                "from real mentions, recommended actions, and formatting for easy review. "
                "Maximum 3 email previews focusing on the most critical issues."
            ),
            agent=self.response_coordinator,
            context=[monitor_task, sentiment_task],
            output_file=f"outputs/emails_{company_name.lower()}_fast.txt"
        )
        
        return [monitor_task, sentiment_task, response_task]
    
    def run(self, company_name: str) -> Dict[str, Any]:
        """
        Execute the fast workflow for a given company.
        
        Args:
            company_name: Name of the company to analyze
            
        Returns:
            Dictionary containing workflow results and metadata
        """
        start_time = time.time()
        
        try:
            # Create tasks for this company
            tasks = self.create_tasks(company_name)
            
            # Create and configure crew
            crew = Crew(
                agents=[self.monitor_agent, self.sentiment_analyzer, self.response_coordinator],
                tasks=tasks,
                process=Process.sequential,
                verbose=True,
                memory=False,  # Disable memory for faster execution
                max_rpm=30
            )
            
            # Execute the workflow
            result = crew.kickoff()
            
            end_time = time.time()
            processing_time = round(end_time - start_time, 2)
            
            # Parse and structure the results
            workflow_results = {
                "status": "success",
                "workflow": "fast",
                "company": company_name,
                "agents_used": 3,
                "processing_time": f"{processing_time} seconds",
                "execution_timestamp": datetime.utcnow().isoformat(),
                "tasks_completed": len(tasks),
                "crew_output": str(result),
                "performance": {
                    "target_time": "10-15 seconds",
                    "actual_time": processing_time,
                    "performance_rating": "excellent" if processing_time <= 15 else "acceptable" if processing_time <= 25 else "slow"
                }
            }
            
            return workflow_results
            
        except Exception as e:
            end_time = time.time()
            processing_time = round(end_time - start_time, 2)
            
            return {
                "status": "error",
                "workflow": "fast", 
                "company": company_name,
                "error": str(e),
                "processing_time": f"{processing_time} seconds",
                "execution_timestamp": datetime.utcnow().isoformat()
            }


# Standalone execution for testing
if __name__ == "__main__":
    import sys
    import os
    from dotenv import load_dotenv
    
    # Load environment variables from .env file
    load_dotenv()
    
    # Verify API keys are loaded
    if not os.getenv('OPENAI_API_KEY'):
        print("❌ Error: OPENAI_API_KEY not found in environment variables")
        print("Make sure your .env file is in the project root directory")
        sys.exit(1)
    
    if not os.getenv('TAVILY_API_KEY'):
        print("⚠️  Warning: TAVILY_API_KEY not found - will use fallback data")
    
    # Get company name from command line or use Apple as default
    company_name = sys.argv[1] if len(sys.argv) > 1 else "Apple"
    
    print(f"🚀 Starting Fast Workflow for: {company_name}")
    print("=" * 60)
    
    try:
        # Initialize and run the workflow
        workflow = FastWorkflow()
        results = workflow.run(company_name)
        
        # Display results
        print(f"\n✅ Analysis Complete!")
        print(f"Status: {results.get('status')}")
        print(f"Company: {results.get('company')}")
        print(f"Processing Time: {results.get('processing_time')}")
        print(f"Performance: {results.get('performance', {}).get('performance_rating', 'N/A')}")
        print("\n📋 Detailed Results:")
        print("-" * 40)
        print(results.get('crew_output', 'No detailed output available'))
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\nMake sure:")
        print("1. Your .env file has valid API keys")
        print("2. You have internet connection")
        print("3. Dependencies are installed")
        
    print("\n" + "=" * 60)