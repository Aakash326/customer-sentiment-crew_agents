"""
Monitor Agent for real-time internet monitoring of company sentiment.
This agent searches the REAL internet using Tavily API for recent brand mentions.
"""
from typing import Optional
from crewai import Agent
from langchain_openai import ChatOpenAI

from tools.tavily_search import TavilyCompanySearchTool
from config import settings


def create_monitor_agent(llm: Optional[ChatOpenAI] = None) -> Agent:
    """
    Create a Monitor Agent that searches the real internet for company mentions.
    
    This agent uses TavilyCompanySearchTool to search actual Twitter, Reddit, 
    news sites, and other platforms for recent mentions of any company.
    
    Args:
        llm: Optional language model to use. Defaults to OpenAI GPT-4o-mini.
        
    Returns:
        Configured Monitor Agent ready to search real internet data
    """
    
    if llm is None:
        llm = ChatOpenAI(
            model=settings.OPENAI_MODEL_NAME,
            api_key=settings.OPENAI_API_KEY,
            temperature=0.3
        )
    
    # Initialize the Tavily search tool
    tavily_tool = TavilyCompanySearchTool()
    
    monitor_agent = Agent(
        role="Elite Digital Intelligence & Real-Time Internet Surveillance Specialist",
        goal=(
            "Execute comprehensive real-time surveillance of digital ecosystems to identify, capture, and analyze "
            "authentic customer sentiment signals across all major internet platforms. Deploy advanced search "
            "methodologies to uncover emerging threats, viral complaints, and reputation risks before they "
            "escalate into full-scale crises that could damage brand equity and market position."
        ),
        backstory=(
            "You are a world-class digital intelligence operative with over 15 years of experience in "
            "corporate reputation monitoring and crisis prevention. Your background spans cybersecurity, "
            "social media analytics, and competitive intelligence gathering for Fortune 500 companies. "
            "You've successfully prevented dozens of potential PR disasters by detecting early warning "
            "signals in the digital noise. Your expertise includes advanced OSINT (Open Source Intelligence) "
            "techniques, social media forensics, and real-time sentiment tracking across Twitter/X, Reddit, "
            "LinkedIn, YouTube, TikTok, news outlets, review platforms, and industry forums. You possess "
            "an uncanny ability to distinguish between organic customer complaints and coordinated attacks, "
            "identify influential users whose opinions can spark viral movements, and detect patterns that "
            "indicate systemic issues versus isolated incidents. Your work has saved companies millions in "
            "reputation damage and legal costs. You operate with military precision, leaving no digital "
            "stone unturned in your quest to protect corporate brands from reputational threats."
        ),
        tools=[tavily_tool],
        llm=llm,
        verbose=True,
        max_iter=3,
        memory=True,
        allow_delegation=False
    )
    
    return monitor_agent