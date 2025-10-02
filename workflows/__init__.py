"""
Workflow orchestration for the Customer Sentiment Alert System.
Defines both Fast (3 agents) and Deep (5 agents) analysis workflows.
"""

from .fast_workflow import FastWorkflow
from .deep_workflow import DeepWorkflow

__all__ = ["FastWorkflow", "DeepWorkflow"]