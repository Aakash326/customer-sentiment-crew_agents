"""
Deep Workflow - 5 Agent Comprehensive Analysis Pipeline
Provides thorough sentiment analysis in 25-35 seconds using all 5 agents for comprehensive insights.
"""
import time
import json
from typing import Dict, Any
from datetime import datetime

from crewai import Task, Crew, Process
from langchain_openai import ChatOpenAI

from agents.monitor_agent import create_monitor_agent
from agents.sentiment_analyzer import create_sentiment_analyzer
from agents.priority_ranker import create_priority_ranker
from agents.context_investigator import create_context_investigator
from agents.response_coordinator import create_response_coordinator
from config import settings


class DeepWorkflow:
    """
    Deep 5-agent workflow for comprehensive sentiment analysis.
    
    Workflow: Monitor → Sentiment Analyzer → Priority Ranker → Context Investigator → Response Coordinator
    Expected Time: 25-35 seconds
    Use Case: Comprehensive analysis for strategic decision making
    """
    
    def __init__(self):
        """Initialize the deep workflow with all 5 agents."""
        # Create shared LLM instance
        self.llm = ChatOpenAI(
            model=settings.OPENAI_MODEL_NAME,
            api_key=settings.OPENAI_API_KEY,
            temperature=0.3
        )
        
        # Initialize all agents
        self.monitor_agent = create_monitor_agent(self.llm)
        self.sentiment_analyzer = create_sentiment_analyzer(self.llm)
        self.priority_ranker = create_priority_ranker(self.llm)
        self.context_investigator = create_context_investigator(self.llm)
        self.response_coordinator = create_response_coordinator(self.llm)
    
    def create_tasks(self, company_name: str) -> list[Task]:
        """
        Create the comprehensive task sequence for deep workflow.
        
        Args:
            company_name: Name of the company to analyze (e.g., "Apple", "Tesla")
            
        Returns:
            List of tasks configured for the deep workflow
        """
        
        # Task 1: Search real internet for company mentions
        monitor_task = Task(
            description=(
                f"Conduct comprehensive real internet search for {company_name} mentions using Tavily API. "
                f"Search across Twitter, Reddit, news sites, review platforms, and forums for actual customer "
                f"feedback from the last 24-48 hours. Focus on complaints, issues, negative sentiment, and "
                f"any potential PR risks. Gather 10-20 high-quality real mentions with platform details, "
                f"content, URLs, timestamps, and relevance scores. This must be REAL internet data."
            ),
            expected_output=(
                "Comprehensive JSON dataset of real internet mentions including: platform, user, content, "
                "URL, timestamp, relevance_score, mention_type. Minimum 10-20 mentions from actual sources "
                "with detailed metadata for further analysis."
            ),
            agent=self.monitor_agent,
            output_file=f"outputs/monitor_{company_name.lower()}_deep.json"
        )
        
        # Task 2: Detailed sentiment analysis
        sentiment_task = Task(
            description=(
                f"Perform detailed sentiment analysis on all {company_name} mentions from Monitor Agent. "
                f"For each mention, calculate: precise sentiment score (-1 to +1), urgency level (0-10), "
                f"user influence estimation based on platform and engagement, viral potential assessment "
                f"(Low/Medium/High), and emotional intensity. Identify patterns in negative sentiment and "
                f"flag all mentions with sentiment < -0.5 as critical. Provide detailed reasoning for scores."
            ),
            expected_output=(
                "Detailed sentiment analysis with each mention scored for: sentiment_score, urgency_level, "
                "user_influence, viral_potential, emotional_intensity, critical_flag, and detailed reasoning. "
                "Include aggregate statistics, sentiment trends, and top critical issues requiring attention."
            ),
            agent=self.sentiment_analyzer,
            context=[monitor_task],
            output_file=f"outputs/sentiment_{company_name.lower()}_deep.json"
        )
        
        # Task 3: Priority ranking with business impact scoring
        priority_task = Task(
            description=(
                f"Rank all {company_name} issues by business impact using comprehensive scoring system. "
                f"Score each issue (0-100 points): User Influence (0-30), Sentiment Severity (0-25), "
                f"Viral Potential (0-25), Frequency/Pattern (0-20). Classify as: Critical (71-100), "
                f"High (51-70), Medium (31-50), Low (0-30). Provide rationale for each score and "
                f"identify which issues pose the greatest business risk if left unaddressed."
            ),
            expected_output=(
                "Prioritized ranking of all issues with business impact scores, classification levels, "
                "detailed scoring rationale, and risk assessment. Include recommended response timeline "
                "for each priority level and identification of top 3-5 most critical issues."
            ),
            agent=self.priority_ranker,
            context=[monitor_task, sentiment_task],
            output_file=f"outputs/priority_{company_name.lower()}_deep.json"
        )
        
        # Task 4: Pattern investigation and root cause analysis
        investigation_task = Task(
            description=(
                f"Investigate patterns in {company_name} customer feedback to determine if issues are "
                f"isolated incidents or systemic problems. Analyze: frequency patterns, user overlap, "
                f"geographic distribution, platform correlation, and growth trends. Identify root causes "
                f"from real mention content. Determine if this represents growing dissatisfaction that "
                f"could escalate into a major crisis or if these are manageable isolated complaints."
            ),
            expected_output=(
                "Comprehensive pattern analysis report including: issue categorization (isolated vs systemic), "
                "frequency trends, correlation analysis, root cause identification, growth projection, "
                "and assessment of crisis escalation risk. Include specific evidence from real mentions."
            ),
            agent=self.context_investigator,
            context=[monitor_task, sentiment_task, priority_task],
            output_file=f"outputs/investigation_{company_name.lower()}_deep.json"
        )
        
        # Task 5: Comprehensive response coordination with detailed email previews
        response_task = Task(
            description=(
                f"Create comprehensive response strategy with detailed email previews for {company_name} "
                f"based on complete analysis. Generate 3-5 email previews for: Engineering (technical issues), "
                f"PR/Marketing (reputation management), Customer Support (response templates), and "
                f"Management (strategic decisions). Each email should include: appropriate recipient, "
                f"priority-based subject line, full message body with evidence from real mentions, "
                f"specific recommended actions, timeline expectations, and success metrics. "
                f"DO NOT send actual emails - create detailed previews only."
            ),
            expected_output=(
                "Complete response strategy with 3-5 detailed email previews formatted for immediate use. "
                "Include email headers, priority levels, full professional content, specific evidence, "
                "actionable recommendations, and implementation timelines. Format for easy review and approval."
            ),
            agent=self.response_coordinator,
            context=[monitor_task, sentiment_task, priority_task, investigation_task],
            output_file=f"outputs/emails_{company_name.lower()}_deep.txt"
        )
        
        return [monitor_task, sentiment_task, priority_task, investigation_task, response_task]
    
    def run(self, company_name: str) -> Dict[str, Any]:
        """
        Execute the comprehensive deep workflow for a given company.
        
        Args:
            company_name: Name of the company to analyze
            
        Returns:
            Dictionary containing comprehensive workflow results and metadata
        """
        start_time = time.time()
        
        try:
            # Create tasks for this company
            tasks = self.create_tasks(company_name)
            
            # Create and configure crew for deep analysis
            crew = Crew(
                agents=[
                    self.monitor_agent,
                    self.sentiment_analyzer, 
                    self.priority_ranker,
                    self.context_investigator,
                    self.response_coordinator
                ],
                tasks=tasks,
                process=Process.sequential,
                verbose=True,
                memory=True,  # Enable memory for complex analysis
                max_rpm=20,   # Slightly lower rate for deeper processing
                planning=True  # Enable planning for complex workflow
            )
            
            # Execute the comprehensive workflow
            result = crew.kickoff()
            
            end_time = time.time()
            processing_time = round(end_time - start_time, 2)
            
            # Parse and structure the comprehensive results
            workflow_results = {
                "status": "success",
                "workflow": "deep",
                "company": company_name,
                "agents_used": 5,
                "processing_time": f"{processing_time} seconds",
                "execution_timestamp": datetime.utcnow().isoformat(),
                "tasks_completed": len(tasks),
                "crew_output": str(result),
                "analysis_depth": "comprehensive",
                "performance": {
                    "target_time": "25-35 seconds",
                    "actual_time": processing_time,
                    "performance_rating": "excellent" if processing_time <= 35 else "acceptable" if processing_time <= 50 else "slow"
                },
                "capabilities": [
                    "Real internet monitoring",
                    "Advanced sentiment analysis", 
                    "Business impact prioritization",
                    "Pattern investigation",
                    "Strategic response coordination"
                ]
            }
            
            return workflow_results
            
        except Exception as e:
            end_time = time.time()
            processing_time = round(end_time - start_time, 2)
            
            return {
                "status": "error",
                "workflow": "deep",
                "company": company_name,
                "error": str(e),
                "processing_time": f"{processing_time} seconds",
                "execution_timestamp": datetime.utcnow().isoformat(),
                "analysis_depth": "failed"
            }