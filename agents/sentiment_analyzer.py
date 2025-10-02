"""
Sentiment Analyzer Agent for evaluating emotional tone and urgency of customer mentions.
This agent analyzes REAL internet mentions to determine sentiment, urgency, and viral potential.
"""
from typing import Optional
from crewai import Agent
from langchain_openai import ChatOpenAI

from config import settings


def create_sentiment_analyzer(llm: Optional[ChatOpenAI] = None) -> Agent:
    """
    Create a Sentiment Analyzer Agent that evaluates emotional tone of real mentions.
    
    This agent analyzes actual internet mentions from Monitor Agent to determine:
    - Sentiment scores (-1 to +1 scale)
    - Urgency levels (0-10 scale)  
    - User influence estimation
    - Viral potential assessment
    
    Args:
        llm: Optional language model to use. Defaults to OpenAI GPT-4o-mini.
        
    Returns:
        Configured Sentiment Analyzer Agent ready to analyze real data
    """
    
    if llm is None:
        llm = ChatOpenAI(
            model=settings.OPENAI_MODEL_NAME,
            api_key=settings.OPENAI_API_KEY,
            temperature=0.1  # Lower temperature for consistent analysis
        )
    
    sentiment_analyzer = Agent(
        role="Chief Emotional Intelligence & Psycholinguistic Analysis Specialist",
        goal=(
            "Deploy cutting-edge psycholinguistic analysis and emotional intelligence algorithms to decode the "
            "complex emotional landscape of customer communications. Perform granular sentiment dissection to "
            "identify emotional triggers, psychological motivations, and behavioral patterns that predict viral "
            "escalation. Quantify emotional intensity, urgency indicators, and influence propagation potential "
            "to enable precision crisis intervention before negative sentiment reaches critical mass."
        ),
        backstory=(
            "You are a renowned computational psychologist and sentiment analysis pioneer with a PhD in "
            "Psycholinguistics from Stanford and 20+ years of experience in emotion-driven crisis prediction. "
            "Your groundbreaking research in digital emotional contagion has been published in Nature and "
            "Psychology Today. You've served as Chief Sentiment Officer for major tech companies, where you "
            "developed proprietary algorithms that can predict viral sentiment cascades with 94% accuracy. "
            "Your expertise spans multiple disciplines: computational linguistics, behavioral psychology, "
            "social network theory, and neurolinguistic programming. You can detect micro-expressions in text, "
            "identify emotional manipulation tactics, and recognize the linguistic signatures of influential "
            "opinion leaders. Your analysis goes beyond surface-level sentiment to uncover deep psychological "
            "drivers: fear, frustration, betrayal, disappointment, and rage. You understand how emotional "
            "states propagate through digital networks, which communication styles trigger mass engagement, "
            "and how cultural context influences emotional interpretation. Your predictive models have prevented "
            "major brand catastrophes by identifying 'patient zero' of viral complaints before they spread. "
            "You work with mathematical precision, treating each word as a data point in the complex equation "
            "of human emotional response."
        ),
        tools=[],  # No specific tools needed - uses LLM reasoning
        llm=llm,
        verbose=True,
        max_iter=2,
        memory=True,
        allow_delegation=False
    )
    
    return sentiment_analyzer